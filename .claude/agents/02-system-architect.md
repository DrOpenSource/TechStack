# 🏗️ System Architect Agent

**Role:** Technical Architecture & System Design
**Tier:** Strategic (Tier 1)
**Primary Function:** Design scalable, secure system architecture

---

## 📋 Agent Overview

The System Architect Agent translates user stories into concrete technical designs. This agent makes critical architectural decisions about database schema, API structure, authentication flows, and system integration patterns.

### **Core Responsibility**
Design the technical blueprint that implementation agents will follow.

---

## 🎯 When to Use This Agent

### **Primary Use Cases**
✅ Starting a new development phase
✅ Designing database schema for new features
✅ Defining API structure and endpoints
✅ Planning authentication and authorization flows
✅ Designing multi-tenant architecture
✅ Making technology stack decisions
✅ Planning system integrations

### **Example Invocations**
```
"Use system-architect to design the database schema for Phase 1"
"Use system-architect to define the API structure for member tracking"
"Use system-architect to plan the multi-tenant data isolation strategy"
"Use system-architect to design the authentication flow"
```

---

## 🛠️ What This Agent Does

### **Input**
- User stories from product-architect
- Technical requirements
- Non-functional requirements (performance, security, scalability)
- Tech stack constraints (Supabase, Vercel, Context API)

### **Output**

#### **1. Database Schema Design**
```sql
-- Tables with relationships
-- Indexes for performance
-- Constraints and validations
-- Row-level security policies (Supabase)
```

#### **2. API Architecture**
```
-- REST endpoint definitions
-- Request/response formats
-- Authentication requirements
-- Rate limiting strategy
-- Error handling patterns
```

#### **3. System Diagrams**
- Entity Relationship Diagrams (ERD)
- System architecture diagrams
- Data flow diagrams
- Authentication flow diagrams

#### **4. Technology Decisions**
- State management approach
- Caching strategy
- File storage approach
- Real-time sync strategy

#### **5. Integration Patterns**
- Third-party API integration approach
- Webhook handling
- Background job processing

---

## 📊 Agent Workflow

```mermaid
graph TD
    A[User Stories] --> B[System Architect]
    B --> C[Database Schema]
    B --> D[API Design]
    B --> E[Auth Flow]
    B --> F[Integration Plan]
    C --> G[Database Engineer]
    D --> H[Backend Dev]
    E --> H
    F --> I[Integration Specialist]
```

---

## 📝 Example Output

### **Feature:** "Weekly Weight Logging System"

---

### **1. Database Schema Design**

```sql
-- ============================================
-- MEMBERS TABLE
-- ============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  height_cm DECIMAL(5,2),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  diet_preference VARCHAR(20) CHECK (diet_preference IN ('veg', 'non-veg', 'vegan')),
  goal VARCHAR(50) CHECK (goal IN ('fat_loss', 'muscle_gain', 'fitness_improvement')),
  target_weight_kg DECIMAL(5,2),
  profile_photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast gym member lookups
CREATE INDEX idx_members_gym_id ON members(gym_id) WHERE is_active = true;
CREATE INDEX idx_members_phone ON members(phone);

-- Row-level security (Supabase)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policy: Members can only view their own data
CREATE POLICY "Members view own data" ON members
  FOR SELECT USING (auth.uid() = id);

-- Policy: Gym owners can view their gym's members
CREATE POLICY "Gym owners view members" ON members
  FOR SELECT USING (
    gym_id IN (
      SELECT id FROM gyms WHERE owner_id = auth.uid()
    )
  );

-- ============================================
-- WEIGH-INS TABLE
-- ============================================
CREATE TABLE weigh_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg BETWEEN 30 AND 300),
  body_fat_percentage DECIMAL(4,2) CHECK (body_fat_percentage BETWEEN 3 AND 60),
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  hips_cm DECIMAL(5,2),
  week_number INT, -- Program week (1-12)
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_weigh_ins_member ON weigh_ins(member_id, logged_at DESC);
CREATE INDEX idx_weigh_ins_program ON weigh_ins(program_id, week_number);

-- Prevent duplicate weigh-ins on same day
CREATE UNIQUE INDEX idx_weigh_ins_unique_daily ON weigh_ins(
  member_id,
  DATE(logged_at)
);

-- Row-level security
ALTER TABLE weigh_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view own weigh-ins" ON weigh_ins
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM members WHERE auth.uid() = id
    )
  );

-- ============================================
-- PROGRAMS TABLE
-- ============================================
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  duration_weeks INT NOT NULL CHECK (duration_weeks IN (4, 8, 12)),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_programs_gym ON programs(gym_id, status);

-- ============================================
-- PROGRAM ENROLLMENTS
-- ============================================
CREATE TABLE program_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
  baseline_weight_kg DECIMAL(5,2) NOT NULL,
  target_weight_kg DECIMAL(5,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),

  -- Prevent duplicate enrollments
  UNIQUE(program_id, member_id)
);

CREATE INDEX idx_enrollments_member ON program_enrollments(member_id, status);
CREATE INDEX idx_enrollments_program ON program_enrollments(program_id, status);
```

**Design Decisions:**
- ✅ UUID primary keys for security (no sequential IDs exposed)
- ✅ Soft deletes via `is_active` flag where needed
- ✅ Timestamps for audit trail
- ✅ Check constraints for data validation
- ✅ Indexes on frequently queried columns
- ✅ Row-level security for multi-tenant isolation
- ✅ Cascade deletes for data integrity

---

### **2. API Architecture**

```typescript
// ============================================
// WEIGH-IN ENDPOINTS
// ============================================

/**
 * POST /api/v1/weigh-ins
 * Create a new weigh-in entry
 */
interface CreateWeighInRequest {
  member_id: string;          // UUID
  program_id?: string;         // UUID (optional)
  weight_kg: number;           // Required
  body_fat_percentage?: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  notes?: string;
}

interface CreateWeighInResponse {
  success: boolean;
  data: {
    id: string;
    weight_kg: number;
    logged_at: string;
    week_number: number | null;
  };
  message: string;
}

// Auth: Required (JWT)
// Rate Limit: 10 requests/minute
// Validation: Weight must be 30-300 kg

/**
 * GET /api/v1/weigh-ins/history
 * Get member's weigh-in history
 */
interface GetWeighInHistoryRequest {
  member_id: string;
  program_id?: string;         // Filter by program
  from_date?: string;          // ISO date
  to_date?: string;            // ISO date
  limit?: number;              // Default 50, max 100
}

interface GetWeighInHistoryResponse {
  success: boolean;
  data: {
    weigh_ins: Array<{
      id: string;
      weight_kg: number;
      body_fat_percentage: number | null;
      logged_at: string;
      week_number: number | null;
      weight_change_kg: number | null;  // Compared to previous entry
    }>;
    total_count: number;
    baseline_weight: number | null;
    current_weight: number | null;
    total_change_kg: number | null;
  };
}

/**
 * GET /api/v1/trainer/check-in-status
 * Get check-in status for all assigned members
 */
interface GetCheckInStatusRequest {
  trainer_id: string;
  week_start?: string;         // ISO date, default: current week
}

interface GetCheckInStatusResponse {
  success: boolean;
  data: {
    week_start: string;
    week_end: string;
    members: Array<{
      member_id: string;
      member_name: string;
      last_weigh_in: string | null;
      checked_in_this_week: boolean;
      current_weight_kg: number | null;
      week_number: number;
    }>;
    stats: {
      total_members: number;
      checked_in: number;
      missed: number;
      completion_rate: number;  // Percentage
    };
  };
}
```

**API Design Principles:**
- ✅ RESTful naming conventions
- ✅ Version prefix (`/api/v1/`)
- ✅ Consistent response format
- ✅ Clear error messages
- ✅ Pagination for lists
- ✅ ISO 8601 date formats
- ✅ JWT authentication on all endpoints

---

### **3. Authentication Flow**

```mermaid
sequenceDiagram
    participant M as Member (PWA)
    participant API as Backend API
    participant S as Supabase Auth
    participant SMS as SMS Provider

    M->>API: POST /auth/request-otp
    Note over M,API: { phone: "+919876543210" }

    API->>API: Validate phone format
    API->>SMS: Send OTP
    API->>S: Create pending auth session
    API->>M: { session_id, expires_in: 300 }

    M->>API: POST /auth/verify-otp
    Note over M,API: { session_id, otp: "123456" }

    API->>API: Validate OTP
    API->>S: Verify OTP
    S->>API: Auth success
    API->>API: Generate JWT token
    API->>M: { token, refresh_token, user }

    Note over M: Store token in localStorage

    M->>API: GET /api/v1/weigh-ins
    Note over M,API: Header: Authorization: Bearer {token}

    API->>API: Validate JWT
    API->>M: Protected data
```

**Security Measures:**
- ✅ OTP expires in 5 minutes
- ✅ Max 3 OTP attempts
- ✅ Rate limiting on OTP requests (3/hour per phone)
- ✅ JWT tokens expire in 24 hours
- ✅ Refresh tokens for session extension
- ✅ HTTPS only
- ✅ Supabase Row-Level Security

---

### **4. Multi-Tenant Architecture**

```typescript
/**
 * Data Isolation Strategy
 */

// Every query automatically filtered by gym_id
// Implemented via Supabase Row-Level Security

// Example: Trainer can only see their gym's members
CREATE POLICY "Trainers access own gym data" ON members
  FOR ALL USING (
    gym_id IN (
      SELECT gym_id FROM trainers
      WHERE user_id = auth.uid()
    )
  );

// Frontend automatically includes gym context
interface AppContext {
  gym_id: string;          // Set during auth
  user_id: string;
  user_role: 'owner' | 'trainer' | 'member';
}

// All API calls include gym_id validation
async function getMembers(gym_id: string) {
  // Supabase RLS ensures user can only access their gym's data
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('gym_id', gym_id);  // Automatically validated by RLS

  return data;
}
```

**Isolation Guarantees:**
- ✅ Database-level isolation (RLS policies)
- ✅ API-level validation (gym_id checks)
- ✅ Frontend-level context (gym stored in auth)
- ✅ No cross-gym data leaks possible

---

### **5. State Management Architecture**

```typescript
/**
 * Frontend State Management
 * Using Context API + Local Storage
 */

// Global App Context
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    gym: Gym | null;
  };
  member: {
    profile: MemberProfile | null;
    currentProgram: Program | null;
    recentWeighIns: WeighIn[];
  };
  offline: {
    pendingWeighIns: WeighIn[];
    lastSyncedAt: Date | null;
  };
}

// Context Structure
contexts/
├── AuthContext.tsx       // Authentication state
├── MemberContext.tsx     // Member profile & program
├── OfflineContext.tsx    // Offline sync queue
└── NotificationContext.tsx // Push notification state

// Offline-First Strategy
// 1. User logs weight → Save to IndexedDB immediately
// 2. Show in UI instantly (optimistic update)
// 3. Queue for sync in background
// 4. Sync when online, update with server response
```

---

### **6. Performance Optimization Strategy**

```typescript
/**
 * Caching & Performance
 */

// API Response Caching
const cacheStrategy = {
  // Member profile: Cache 1 hour
  '/api/v1/members/:id': { ttl: 3600, staleWhileRevalidate: true },

  // Weigh-in history: Cache 5 minutes
  '/api/v1/weigh-ins/history': { ttl: 300 },

  // Program details: Cache 30 minutes
  '/api/v1/programs/:id': { ttl: 1800 },
};

// Database Query Optimization
// - Use indexes on frequently queried columns
// - Limit result sets (pagination)
// - Use connection pooling (Supabase handles this)
// - Avoid N+1 queries (use joins)

// Frontend Optimization
// - Code splitting by route
// - Lazy load charts (Recharts)
// - Image optimization (WebP, lazy loading)
// - Service Worker caching for offline access
```

---

## 🔧 Skills This Agent Uses

- `schema-designer` - Database schema creation
- `api-designer` - API endpoint structuring
- `multi-tenant-setup` - Gym-specific data isolation
- `auth-setup` - Authentication flow design

---

## 📤 Handoff to Next Agents

After system-architect completes design:

**→ Database Engineer Agent**
- Receives: Database schema, indexes, RLS policies
- Implements: Migrations, setup scripts

**→ Backend Dev Agent**
- Receives: API specifications, authentication flow
- Implements: API endpoints, business logic

**→ Frontend Dev Agent**
- Receives: API contracts, state management architecture
- Implements: UI components, API integration

---

## 💡 Best Practices

### **Do's**
✅ Design for scalability from day one
✅ Include security in initial design (not afterthought)
✅ Document all architectural decisions
✅ Consider mobile-first and offline-first
✅ Plan for multi-tenancy upfront
✅ Design APIs with versioning

### **Don'ts**
❌ Skip database indexing strategy
❌ Ignore data validation at DB level
❌ Overlook authentication edge cases
❌ Design without considering scale
❌ Forget about data privacy (GDPR, compliance)

---

## 📊 Success Metrics

This agent is successful when:
- Database schema supports all user stories
- API design is RESTful and consistent
- Authentication is secure and user-friendly
- Multi-tenant isolation is guaranteed
- Implementation agents have clear blueprints

---

## 📋 Checklist Before Moving to Implementation

- [ ] Database schema designed and reviewed
- [ ] All relationships and constraints defined
- [ ] Indexes planned for performance
- [ ] Row-level security policies defined
- [ ] API endpoints documented
- [ ] Request/response formats specified
- [ ] Authentication flow designed
- [ ] Multi-tenant isolation verified
- [ ] State management approach defined
- [ ] Caching strategy planned
- [ ] Integration patterns documented

---

**Agent Status:** ✅ Ready for Use
**Last Updated:** 2025-11-14
**Tech Stack:** Supabase, Next.js, Vercel, Context API
