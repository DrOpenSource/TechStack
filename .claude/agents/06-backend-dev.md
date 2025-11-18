# 🔧 Backend Developer Agent

**Role:** Node.js API & Business Logic
**Tier:** Implementation (Tier 2)
**Primary Function:** Build scalable, secure backend services

---

## 📋 Agent Overview

The Backend Developer Agent specializes in building RESTful APIs, implementing business logic, and managing server-side operations using Node.js and Supabase. This agent ensures data integrity, security, and optimal performance.

### **Core Responsibility**
Implement backend services that power the application platform.

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
"Use backend-dev to implement the data entry API endpoints"
"Use backend-dev with auth-setup skill to build OTP authentication"
"Use backend-dev with notification-system skill to create scheduled notifications"
"Use backend-dev to implement admin dashboard API"
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
// Calculations and aggregations
// Project enrollment logic
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

### **Feature:** "Data Entry API"

---

### **1. API Route Implementation**

```typescript
// api/data-entries/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema
const CreateDataEntrySchema = z.object({
  user_id: z.string().uuid(),
  project_id: z.string().uuid().optional(),
  value: z.number(),
  metric_type: z.string(),
  metadata: z.record(z.any()).optional(),
  notes: z.string().max(500).optional(),
});

/**
 * POST /api/data-entries
 * Create a new data entry
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
    const validatedData = CreateDataEntrySchema.parse(body);

    // Verify user access (user can only log their own data)
    if (validatedData.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only log your own data' },
        { status: 403 }
      );
    }

    // Check for duplicate on same day (if applicable)
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('data_entries')
      .select('id')
      .eq('user_id', validatedData.user_id)
      .eq('metric_type', validatedData.metric_type)
      .gte('logged_at', `${today}T00:00:00`)
      .lt('logged_at', `${today}T23:59:59`)
      .single();

    if (existing) {
      // Update existing instead of creating new
      const { data, error } = await supabase
        .from('data_entries')
        .update({
          value: validatedData.value,
          metadata: validatedData.metadata,
          notes: validatedData.notes,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Data entry updated successfully',
      });
    }

    // Calculate period number if in project
    let periodNumber = null;
    if (validatedData.project_id) {
      periodNumber = await calculateProjectPeriod(
        supabase,
        validatedData.project_id
      );
    }

    // Insert new data entry
    const { data, error } = await supabase
      .from('data_entries')
      .insert({
        ...validatedData,
        period_number: periodNumber,
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger notifications
    await triggerDataEntryNotifications(user.id, data);

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Data entry logged successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/data-entries error:', error);

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
 * GET /api/data-entries
 * Get data entry history
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
    const userId = searchParams.get('user_id') || user.id;
    const projectId = searchParams.get('project_id');
    const metricType = searchParams.get('metric_type');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Verify access (users can only see their own data)
    if (userId !== user.id) {
      // Check if user is admin/staff with access
      const hasAccess = await verifyStaffAccess(supabase, user.id, userId);
      if (!hasAccess) {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    // Build query
    let query = supabase
      .from('data_entries')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(limit);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data: dataEntries, error } = await query;

    if (error) throw error;

    // Calculate stats
    const stats = calculateDataEntryStats(dataEntries);

    return NextResponse.json({
      success: true,
      data: {
        data_entries: dataEntries,
        stats,
        total_count: dataEntries.length,
      },
    });
  } catch (error) {
    console.error('GET /api/data-entries error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Helper: Calculate project period
async function calculateProjectPeriod(supabase: any, projectId: string) {
  const { data: project } = await supabase
    .from('projects')
    .select('start_date')
    .eq('id', projectId)
    .single();

  if (!project) return null;

  const startDate = new Date(project.start_date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const periodNumber = Math.ceil(diffDays / 7);

  return periodNumber;
}

// Helper: Trigger notifications
async function triggerDataEntryNotifications(userId: string, dataEntry: any) {
  // Notify assigned staff
  // Update streak
  // Send notification if milestone reached
  // Implementation depends on notification system
}

// Helper: Calculate stats
function calculateDataEntryStats(dataEntries: any[]) {
  if (dataEntries.length === 0) {
    return {
      baseline_value: null,
      current_value: null,
      total_change: null,
      avg_change_per_period: null,
    };
  }

  const baseline = dataEntries[dataEntries.length - 1].value;
  const current = dataEntries[0].value;
  const totalChange = current - baseline;
  const periods = dataEntries.length;
  const avgChangePerPeriod = periods > 1 ? totalChange / periods : 0;

  return {
    baseline_value: baseline,
    current_value: current,
    total_change: parseFloat(totalChange.toFixed(2)),
    avg_change_per_period: parseFloat(avgChangePerPeriod.toFixed(2)),
    periods_tracked: periods,
  };
}

// Helper: Verify staff access
async function verifyStaffAccess(
  supabase: any,
  staffId: string,
  userId: string
): Promise<boolean> {
  // Check if staff is assigned to this user
  const { data } = await supabase
    .from('project_enrollments')
    .select('staff_id')
    .eq('user_id', userId)
    .eq('staff_id', staffId)
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

### **2. Notification System (Cron Jobs)**

```typescript
// api/cron/scheduled-notifications/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for admin access
);

/**
 * Cron job: Send scheduled notifications
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
      task_reminders: 0,
      deadline_alerts: 0,
      status_updates: 0,
      recurring_notifications: 0,
    };

    // Get all active users with notification preferences
    const { data: users } = await supabase
      .from('users')
      .select(
        `
        id,
        name,
        email,
        phone,
        notification_preferences,
        project_enrollments (
          id,
          project_id,
          status
        )
      `
      )
      .eq('is_active', true)
      .eq('project_enrollments.status', 'active');

    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();

    for (const user of users || []) {
      const prefs = user.notification_preferences || {};

      // Task reminders
      if (prefs.task_reminders_enabled && prefs.reminder_times?.includes(currentHour)) {
        await sendTaskReminder(user);
        results.task_reminders++;
      }

      // Deadline alerts
      if (prefs.deadline_alerts_enabled) {
        await sendDeadlineAlerts(user);
        results.deadline_alerts++;
      }

      // Daily status update (morning)
      if (currentHour === 9 && prefs.daily_digest_enabled) {
        await sendDailyDigest(user);
        results.status_updates++;
      }

      // Weekly recap (Monday 9 AM)
      const isMonday = currentDay === 1;
      if (isMonday && currentHour === 9 && prefs.weekly_recap_enabled) {
        await sendWeeklyRecap(user);
        results.recurring_notifications++;
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

// Notification functions
async function sendTaskReminder(user: any) {
  // Send push notification or email
  // Implementation depends on notification provider
}

async function sendDeadlineAlerts(user: any) {
  // Send deadline alerts for upcoming tasks
}

async function sendDailyDigest(user: any) {
  // Send daily activity digest
}

async function sendWeeklyRecap(user: any) {
  // Send weekly progress recap
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
- `notification-system` - Scheduled notifications

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
