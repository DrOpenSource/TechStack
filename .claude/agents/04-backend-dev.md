# 🔧 Backend Developer Agent

**Role:** Node.js API & Business Logic
**Tier:** Implementation (Tier 2)
**Primary Function:** Build scalable, secure backend services

---

## 📋 Agent Overview

The Backend Developer Agent specializes in building RESTful APIs, implementing business logic, and managing server-side operations using Node.js and Supabase. This agent ensures data integrity, security, and optimal performance.

### **Core Responsibility**
Implement backend services that power the GTT platform.

---

## 🎯 When to Use This Agent

### **Primary Use Cases**
✅ Building API endpoints
✅ Implementing business logic
✅ Creating authentication systems
✅ Setting up cron jobs and schedulers
✅ Implementing data validation
✅ Creating background jobs
✅ Building webhook handlers
✅ Optimizing database queries

### **Example Invocations**
```
"Use backend-dev to implement the weigh-in API endpoints"
"Use backend-dev with auth-setup skill to build OTP authentication"
"Use backend-dev with reminder-system skill to create daily reminders"
"Use backend-dev to implement PT dashboard API"
```

---

## 🛠️ What This Agent Does

### **Input**
- API specifications from system-architect
- Database schema
- Business rules and validation requirements
- Integration requirements

### **Output**

#### **1. API Endpoints**
```typescript
// RESTful routes
// Request validation
// Response formatting
// Error handling
```

#### **2. Business Logic**
```typescript
// Data processing
// Calculations (BMI, protein targets, etc.)
// Program enrollment logic
// Notification triggers
```

#### **3. Middleware**
```typescript
// Authentication
// Authorization
// Rate limiting
// Logging
```

#### **4. Background Jobs**
```typescript
// Scheduled reminders
// Report generation
// Data cleanup
// Sync operations
```

---

## 📝 Example Output

### **Feature:** "Weekly Weigh-In API"

---

### **1. API Route Implementation**

```typescript
// api/weigh-ins/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema
const CreateWeighInSchema = z.object({
  member_id: z.string().uuid(),
  program_id: z.string().uuid().optional(),
  weight_kg: z.number().min(30).max(300),
  body_fat_percentage: z.number().min(3).max(60).optional(),
  chest_cm: z.number().positive().optional(),
  waist_cm: z.number().positive().optional(),
  hips_cm: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * POST /api/weigh-ins
 * Create a new weigh-in entry
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateWeighInSchema.parse(body);

    // Verify member access (user can only log their own weight)
    if (validatedData.member_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only log your own weight' },
        { status: 403 }
      );
    }

    // Check for duplicate on same day
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('weigh_ins')
      .select('id')
      .eq('member_id', validatedData.member_id)
      .gte('logged_at', `${today}T00:00:00`)
      .lt('logged_at', `${today}T23:59:59`)
      .single();

    if (existing) {
      // Update existing instead of creating new
      const { data, error } = await supabase
        .from('weigh_ins')
        .update({
          weight_kg: validatedData.weight_kg,
          body_fat_percentage: validatedData.body_fat_percentage,
          chest_cm: validatedData.chest_cm,
          waist_cm: validatedData.waist_cm,
          hips_cm: validatedData.hips_cm,
          notes: validatedData.notes,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Weight updated successfully',
      });
    }

    // Calculate week number if in program
    let weekNumber = null;
    if (validatedData.program_id) {
      weekNumber = await calculateProgramWeek(
        supabase,
        validatedData.program_id
      );
    }

    // Insert new weigh-in
    const { data, error } = await supabase
      .from('weigh_ins')
      .insert({
        ...validatedData,
        week_number: weekNumber,
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger notifications
    await triggerWeighInNotifications(user.id, data);

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Weight logged successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/weigh-ins error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/weigh-ins
 * Get weigh-in history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('member_id') || user.id;
    const programId = searchParams.get('program_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Verify access (members can only see their own data)
    if (memberId !== user.id) {
      // Check if user is trainer/owner with access
      const hasAccess = await verifyTrainerAccess(supabase, user.id, memberId);
      if (!hasAccess) {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    // Build query
    let query = supabase
      .from('weigh_ins')
      .select('*')
      .eq('member_id', memberId)
      .order('logged_at', { ascending: false })
      .limit(limit);

    if (programId) {
      query = query.eq('program_id', programId);
    }

    const { data: weighIns, error } = await query;

    if (error) throw error;

    // Calculate stats
    const stats = calculateWeighInStats(weighIns);

    return NextResponse.json({
      success: true,
      data: {
        weigh_ins: weighIns,
        stats,
        total_count: weighIns.length,
      },
    });
  } catch (error) {
    console.error('GET /api/weigh-ins error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Helper: Calculate program week
async function calculateProgramWeek(supabase: any, programId: string) {
  const { data: program } = await supabase
    .from('programs')
    .select('start_date')
    .eq('id', programId)
    .single();

  if (!program) return null;

  const startDate = new Date(program.start_date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.ceil(diffDays / 7);

  return weekNumber;
}

// Helper: Trigger notifications
async function triggerWeighInNotifications(userId: string, weighIn: any) {
  // Notify assigned trainer
  // Update streak
  // Send encouragement if milestone reached
  // Implementation depends on notification system
}

// Helper: Calculate stats
function calculateWeighInStats(weighIns: any[]) {
  if (weighIns.length === 0) {
    return {
      baseline_weight: null,
      current_weight: null,
      total_change_kg: null,
      avg_weekly_change: null,
    };
  }

  const baseline = weighIns[weighIns.length - 1].weight_kg;
  const current = weighIns[0].weight_kg;
  const totalChange = current - baseline;
  const weeks = weighIns.length;
  const avgWeeklyChange = weeks > 1 ? totalChange / weeks : 0;

  return {
    baseline_weight: baseline,
    current_weight: current,
    total_change_kg: parseFloat(totalChange.toFixed(2)),
    avg_weekly_change: parseFloat(avgWeeklyChange.toFixed(2)),
    weeks_tracked: weeks,
  };
}

// Helper: Verify trainer access
async function verifyTrainerAccess(
  supabase: any,
  trainerId: string,
  memberId: string
): Promise<boolean> {
  // Check if trainer is assigned to this member
  const { data } = await supabase
    .from('program_enrollments')
    .select('trainer_id')
    .eq('member_id', memberId)
    .eq('trainer_id', trainerId)
    .single();

  return !!data;
}
```

**API Features:**
- ✅ Authentication checks
- ✅ Input validation (Zod)
- ✅ Authorization (RLS + manual checks)
- ✅ Error handling
- ✅ Duplicate prevention
- ✅ Business logic (week calculation, stats)
- ✅ Notifications trigger
- ✅ Type safety

---

### **2. Reminder System (Cron Jobs)**

```typescript
// api/cron/daily-reminders/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for admin access
);

/**
 * Cron job: Send daily reminders
 * Triggered by Vercel Cron or external scheduler
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      water_reminders: 0,
      meal_reminders: 0,
      protein_reminders: 0,
      weigh_in_reminders: 0,
    };

    // Get all active members with reminder preferences
    const { data: members } = await supabase
      .from('members')
      .select(
        `
        id,
        name,
        phone,
        reminder_preferences,
        program_enrollments (
          id,
          program_id,
          status
        )
      `
      )
      .eq('is_active', true)
      .eq('program_enrollments.status', 'active');

    const currentHour = new Date().getHours();

    for (const member of members || []) {
      const prefs = member.reminder_preferences || {};

      // Water reminder
      if (prefs.water_enabled && prefs.water_times?.includes(currentHour)) {
        await sendWaterReminder(member);
        results.water_reminders++;
      }

      // Meal reminders
      if (prefs.meal_enabled) {
        if (currentHour === 8 && prefs.breakfast_enabled) {
          await sendMealReminder(member, 'breakfast');
          results.meal_reminders++;
        }
        if (currentHour === 13 && prefs.lunch_enabled) {
          await sendMealReminder(member, 'lunch');
          results.meal_reminders++;
        }
        if (currentHour === 20 && prefs.dinner_enabled) {
          await sendMealReminder(member, 'dinner');
          results.meal_reminders++;
        }
      }

      // Protein reminder (evening)
      if (currentHour === 21 && prefs.protein_enabled) {
        await sendProteinReminder(member);
        results.protein_reminders++;
      }

      // Weekly weigh-in reminder (Monday 9 AM)
      const isMonday = new Date().getDay() === 1;
      if (isMonday && currentHour === 9) {
        await sendWeighInReminder(member);
        results.weigh_in_reminders++;
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Reminder functions
async function sendWaterReminder(member: any) {
  // Send push notification or SMS
  // Implementation depends on notification provider
}

async function sendMealReminder(member: any, mealType: string) {
  // Send meal reminder
}

async function sendProteinReminder(member: any) {
  // Send protein tracking reminder
}

async function sendWeighInReminder(member: any) {
  // Send weekly weigh-in reminder
}
```

---

### **3. Authentication System**

```typescript
// api/auth/request-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendOTP } from '@/lib/sms';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RequestOTPSchema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = RequestOTPSchema.parse(body);

    // Rate limiting check
    const recentRequests = await checkRateLimit(phone);
    if (recentRequests >= 3) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Try again in 1 hour.' },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await supabase.from('otp_sessions').insert({
      phone,
      otp,
      expires_at: expiresAt,
      attempts: 0,
    });

    // Send OTP via SMS
    await sendOTP(phone, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expires_in: 300, // seconds
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function checkRateLimit(phone: string): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const { count } = await supabase
    .from('otp_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('phone', phone)
    .gte('created_at', oneHourAgo.toISOString());

  return count || 0;
}
```

---

## 🔧 Skills This Agent Uses

- `api-designer` - RESTful API structure
- `auth-setup` - OTP authentication, JWT
- `database-ops` - CRUD operations
- `reminder-system` - Scheduled notifications

---

## 💡 Best Practices

### **Do's**
✅ Validate all inputs (use Zod or similar)
✅ Implement proper error handling
✅ Use TypeScript for type safety
✅ Add rate limiting
✅ Log errors for debugging
✅ Use environment variables for secrets
✅ Implement proper authentication
✅ Follow REST conventions

### **Don'ts**
❌ Trust client input without validation
❌ Expose sensitive data in responses
❌ Skip authentication checks
❌ Hardcode secrets
❌ Ignore error cases
❌ Return detailed errors to client (security risk)

---

## 📋 Checklist Before Handoff

- [ ] All endpoints implemented
- [ ] Input validation in place
- [ ] Authentication working
- [ ] Authorization checks implemented
- [ ] Error handling complete
- [ ] Rate limiting configured
- [ ] Logging added
- [ ] Environment variables documented

---

**Agent Status:** ✅ Ready for Use
**Last Updated:** 2025-11-14
**Tech Stack:** Node.js, Next.js, Supabase, TypeScript
