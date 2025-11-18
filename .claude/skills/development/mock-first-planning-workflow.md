# Mock-First Planning Workflow

**Version:** 1.0.0
**Purpose:** Planning framework for coordinating mock and real development stages across AI agents

---

## 🎯 The Planning Challenge

Traditional planning assumes **sequential development** (design → backend → frontend).

Mock-first planning enables **parallel development** with clear phase transitions.

---

## 📊 Development Phases

```
Phase 1: MOCK-FIRST PROTOTYPING (Week 1-2)
├─ Build UI with mock services
├─ Complete user flows
├─ Validate UX with stakeholders
└─ No backend dependencies

Phase 2: PARALLEL IMPLEMENTATION (Week 2-3)
├─ Frontend: Refine UI (still using mocks)
├─ Backend: Build real services
├─ Database: Create schemas
└─ Teams work independently

Phase 3: INTEGRATION (Week 3-4)
├─ Switch services from mock → real
├─ Integration testing
├─ Fix discrepancies
└─ End-to-end testing

Phase 4: PRODUCTION (Week 4+)
├─ Deploy with real backend
├─ Keep mocks for testing
├─ Monitor & iterate
└─ MOCK_MODE=false
```

---

## 🤖 Agent Roles in Mock-First Development

### **Product Architect**

**Responsibilities:**
- Break down features into user stories
- Identify which services are needed
- Determine mock vs real priority
- Create phased implementation plan

**Mock-First Planning:**
```yaml
Feature: User Registration Flow

Phase 1 (Mock):
  User Stories:
    - As a user, I can enter my phone number
    - As a user, I can receive and enter OTP
    - As a user, I can create my profile

  Required Mocks:
    - mockAuthService.sendOTP()
    - mockAuthService.verifyOTP()
    - mockUserService.create()

  Success Criteria:
    - Complete flow works without backend
    - Forms are pre-fillable
    - Can demo to stakeholders

Phase 2 (Real):
  Backend Implementation:
    - Supabase Auth integration
    - SMS provider setup (Msg91)
    - User table schema

  Migration Tasks:
    - Replace mockAuthService with realAuthService
    - Switch MOCK_MODE for auth feature

  Success Criteria:
    - Real OTP sent to phone
    - User persisted in database
    - Auth tokens working
```

---

### **System Architect**

**Responsibilities:**
- Design service interfaces (contracts)
- Plan mock and real implementations
- Ensure interface consistency
- Design migration strategy

**Mock-First Design Pattern:**

```typescript
// 1. Define Service Interface (Contract)
// services/types/AuthService.ts
export interface AuthService {
  sendOTP(phone: string): Promise<OTPResponse>;
  verifyOTP(phone: string, otp: string): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

// 2. Mock Implementation
// services/mock/mockAuthService.ts
export const mockAuthService: AuthService = {
  // Implements interface with fake data
};

// 3. Real Implementation
// services/real/authService.ts
export const authService: AuthService = {
  // Implements interface with Supabase
};

// 4. Service Selector
// hooks/useAuthService.ts
export const useAuthService = createServiceHook(
  mockAuthService,
  authService
);
```

**Decision Matrix:**

| Component | Mock First? | Reason |
|-----------|-------------|--------|
| Authentication | ✅ Yes | Allows UI testing without SMS setup |
| User CRUD | ✅ Yes | Fast iteration on forms |
| File Upload | ✅ Yes | Test UI without storage config |
| Payment | ✅ Yes | Avoid test payment setup early |
| Analytics | ❌ No | Can use console.log initially |
| Error Logging | ❌ No | Can use console.error initially |

---

### **Frontend Developer**

**Responsibilities:**
- Build UI with mock services
- Create component library
- Implement complete user flows
- Prepare for real service integration

**Workflow:**

```yaml
Step 1: Check Service Availability
  - Review service-inventory.ts
  - If mock exists: Use it
  - If not: Create mock first

Step 2: Build UI Components
  - Use service hooks (auto-routing)
  - Never import services directly
  - Add sample data hints
  - Pre-populate forms in dev

Step 3: Complete User Flow
  - Test entire journey end-to-end
  - Validate with mocks
  - Get stakeholder feedback
  - No backend needed

Step 4: Prepare for Real Integration
  - Ensure service hooks are used
  - No hardcoded mock imports
  - Ready for MOCK_MODE toggle
```

**Example Task Breakdown:**

```typescript
// Task: Build User Profile Page

// 1. Check for existing service
const userService = useUserService(); // ✓ Hook exists

// 2. Build component with mock data
function UserProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // This will use mock initially, real later
    userService.getCurrentUser().then(setProfile);
  }, []);

  return (
    <FormWithSampleData
      sampleData={SAMPLE_DATA.userProfile}
      onFill={handleAutoFill}
    >
      {/* Form fields */}
    </FormWithSampleData>
  );
}

// 3. Test with mock (MOCK_MODE=true)
// 4. Later: Switch to real (MOCK_MODE=false)
// Component code: UNCHANGED ✓
```

---

### **Backend Developer**

**Responsibilities:**
- Implement real services matching mock interfaces
- Create database schemas
- Set up third-party integrations
- Ensure API parity with mocks

**Workflow:**

```yaml
Step 1: Review Mock Implementation
  - Read mock service interface
  - Understand expected behavior
  - Note data structures
  - Check used by which components

Step 2: Implement Real Service
  - Match interface exactly
  - Handle errors properly
  - Add validation
  - Test independently

Step 3: Database Setup
  - Create migrations
  - Set up relationships
  - Configure RLS policies
  - Seed test data

Step 4: Integration Points
  - Configure third-party APIs
  - Set up environment variables
  - Test with Postman/Insomnia
  - Document API
```

**Example Implementation:**

```typescript
// Backend receives: mockAuthService interface
export interface AuthService {
  sendOTP(phone: string): Promise<OTPResponse>;
  verifyOTP(phone: string, otp: string): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

// Backend implements: Real version
// services/real/authService.ts
import { supabase } from '@/lib/supabase';
import { smsProvider } from '@/lib/sms';

export const authService: AuthService = {
  async sendOTP(phone: string): Promise<OTPResponse> {
    // Real Supabase Auth
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' }
    });

    if (error) throw new Error(error.message);

    return {
      success: true,
      message: `OTP sent to ${phone}`,
      expiresIn: 300, // 5 minutes
    };
  },

  // ... implement other methods matching interface
};

// Frontend: No changes needed! ✓
```

---

### **Database Engineer**

**Responsibilities:**
- Design schemas based on mock data structures
- Create migrations
- Set up relationships
- Configure security (RLS)

**Mock-to-Schema Mapping:**

```typescript
// 1. Review mock data structure
const MOCK_USER = {
  id: 'user-001',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '+919876543210',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

// 2. Create database schema
-- migrations/001_create_users_table.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 3. Schema matches mock data structure ✓
```

---

### **QA Engineer**

**Responsibilities:**
- Test with both mock and real services
- Create test suites using mocks
- Validate real service behavior
- Performance testing

**Testing Strategy:**

```typescript
// Unit Tests: Use Mocks (Fast)
describe('UserProfile Component', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true';
  });

  it('should load user profile', async () => {
    // Uses mock service automatically
    // Tests run in milliseconds
  });
});

// Integration Tests: Use Real Services
describe('User API Integration', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'false';
  });

  it('should create user in database', async () => {
    // Uses real Supabase
    // Tests actual integration
  });
});

// E2E Tests: Toggle Between Both
describe('User Registration Flow E2E', () => {
  it('should work with mocks', async () => {
    await setMockMode(true);
    // Fast, deterministic
  });

  it('should work with real backend', async () => {
    await setMockMode(false);
    // Full integration test
  });
});
```

---

## 📋 Planning Workflow Template

### **New Feature: User Registration**

**Step 1: Product Architect Planning**

```yaml
Feature: User Registration Flow

User Stories:
  1. As a user, I can enter my phone number
  2. As a user, I can receive OTP code
  3. As a user, I can verify OTP
  4. As a user, I can create my profile
  5. As a user, I can upload profile picture

Services Needed:
  - authService (OTP send/verify)
  - userService (create, update)
  - storageService (upload avatar)

Phased Plan:
  Week 1: Mock everything, build UI
  Week 2: Backend implements real services
  Week 3: Switch to real, integration test
  Week 4: Deploy

Dependencies:
  - Supabase Auth setup
  - SMS provider (Msg91)
  - Storage bucket configuration
```

---

**Step 2: System Architect Design**

```yaml
Service Interfaces:

AuthService:
  sendOTP(phone): OTPResponse
  verifyOTP(phone, otp): AuthResponse
  getCurrentUser(): User | null
  signOut(): void

UserService:
  create(data): User
  update(id, data): User
  getById(id): User | null

StorageService:
  uploadAvatar(file): { url: string }
  deleteAvatar(url): void

Mock Implementation Timeline:
  Day 1: mockAuthService
  Day 1: mockUserService
  Day 2: mockStorageService

Real Implementation Timeline:
  Day 3-4: Supabase Auth + SMS
  Day 4-5: User CRUD + Database
  Day 5-6: Storage + File upload
```

---

**Step 3: Task Distribution**

```yaml
Frontend Developer (Week 1):
  - [ ] Create registration form UI
  - [ ] Implement OTP input component
  - [ ] Build profile creation form
  - [ ] Add avatar upload UI
  - [ ] Test complete flow with mocks
  - [ ] Add sample data hints
  - [ ] Get stakeholder approval

Backend Developer (Week 1-2):
  - [ ] Design database schema
  - [ ] Create migrations
  - [ ] Set up Supabase Auth
  - [ ] Configure SMS provider
  - [ ] Implement authService
  - [ ] Implement userService
  - [ ] Set up storage bucket
  - [ ] Create API tests

Database Engineer (Week 1):
  - [ ] Design users table schema
  - [ ] Create migration scripts
  - [ ] Set up RLS policies
  - [ ] Configure auth schema
  - [ ] Add indexes

QA Engineer (Week 2-3):
  - [ ] Write unit tests (with mocks)
  - [ ] Write integration tests (real)
  - [ ] Create E2E test suite
  - [ ] Test error scenarios
  - [ ] Performance testing
  - [ ] Security testing

DevOps (Week 3):
  - [ ] Configure environment variables
  - [ ] Set up SMS provider in prod
  - [ ] Configure storage permissions
  - [ ] Deploy to staging
  - [ ] Deploy to production
```

---

## 🔄 Migration Workflow

### **When to Switch from Mock to Real**

```yaml
Criteria for Migration:
  UI Complete:
    - [ ] All screens built
    - [ ] User flow validated
    - [ ] Stakeholder approved
    - [ ] No UX changes expected

  Real Service Ready:
    - [ ] Backend implementation complete
    - [ ] Database schema deployed
    - [ ] API tests passing
    - [ ] Environment configured

  Testing Complete:
    - [ ] Unit tests with mocks passing
    - [ ] Integration tests ready
    - [ ] Performance acceptable
    - [ ] Security validated

Migration Process:
  1. Set MOCK_MODE=false in staging
  2. Run integration test suite
  3. Fix any discrepancies
  4. Validate performance
  5. Deploy to production
  6. Monitor for errors
  7. Keep mocks for testing
```

---

## 🎯 Decision Framework

### **Should I Build Mock First?**

```yaml
Build Mock First If:
  ✅ Third-party integration (SMS, payment, etc.)
  ✅ Complex backend setup required
  ✅ UI needs validation before backend work
  ✅ Teams working in parallel
  ✅ Frequent demos to stakeholders
  ✅ Testing needs to be fast

Skip Mock If:
  ❌ Simple logging/analytics
  ❌ Read-only external APIs
  ❌ One-person team
  ❌ Backend already exists
  ❌ API is very simple (< 2 methods)
```

---

## 📊 Planning Tools

### **Migration Gantt Chart**

```
Week 1: MOCK PHASE
├─ Day 1-2: Create mock services
├─ Day 3-5: Build UI with mocks
└─ Day 6-7: Stakeholder demos

Week 2: PARALLEL PHASE
├─ Frontend: Refine UI (mocks) ───────┐
├─ Backend: Build real services ──────┤ Simultaneous
└─ Database: Create schemas ──────────┘

Week 3: INTEGRATION PHASE
├─ Day 1-2: Switch to real services
├─ Day 3-4: Integration testing
└─ Day 5-7: Bug fixes

Week 4: PRODUCTION
├─ Day 1-2: Staging deployment
├─ Day 3-4: Production deployment
└─ Day 5-7: Monitoring
```

---

## ✅ Planning Checklist

Before starting any feature:

```yaml
□ Feature broken into user stories
□ Required services identified
□ Mock-first vs direct implementation decided
□ Service interfaces defined
□ Mock implementation timeline set
□ Real implementation timeline set
□ Dependencies mapped
□ Teams assigned
□ Migration criteria defined
□ Testing strategy defined
□ Rollout plan created
```

---

## 🚀 Example: Complete Feature Planning

**Feature:** E-commerce Order Management

```yaml
# 1. DISCOVERY (Product Architect)
User Stories:
  - Browse products
  - Add to cart
  - Checkout
  - Payment
  - Order tracking

Services Needed:
  - productService
  - cartService
  - orderService
  - paymentService
  - notificationService

# 2. ARCHITECTURE (System Architect)
Mock-First Services:
  ✅ paymentService (avoid test payment setup)
  ✅ notificationService (no SMS/email early)
  ✅ productService (faster iteration)
  ❌ cartService (simple, localStorage)

Interface Definitions:
  PaymentService:
    - createPaymentIntent(amount): Intent
    - verifyPayment(id): Status

  OrderService:
    - create(data): Order
    - getById(id): Order
    - updateStatus(id, status): Order

# 3. PHASING (All Agents)
Phase 1 (Week 1): Build with Mocks
  - Frontend: Complete checkout flow
  - Backend: Design database schema
  - Status: UI ready for demo

Phase 2 (Week 2): Parallel Development
  - Frontend: Polish UI (still mocks)
  - Backend: Implement real payment gateway
  - Database: Create order tables

Phase 3 (Week 3): Integration
  - Switch MOCK_MODE=false
  - Integration testing
  - Fix discrepancies

Phase 4 (Week 4): Production
  - Deploy with real backend
  - Monitor payments
  - Keep mocks for testing

# 4. SUCCESS METRICS
Week 1: ✓ Demo-ready checkout flow
Week 2: ✓ Real payment integration working
Week 3: ✓ E2E tests passing (both modes)
Week 4: ✓ Live orders processing
```

---

## 📖 Integration with Existing Workflows

This mock-first planning workflow **extends** the existing `feature-development.md` workflow:

**Before:** Design → Backend → Frontend → Test → Deploy

**After:** Design → Mock → UI (parallel) Backend → Integrate → Test → Deploy

See: `.claude/workflows/feature-development-mock-first.md` for updated workflow

---

**Last Updated:** 2025-11-18
**Next:** See `context-discovery.md` for understanding existing codebases
