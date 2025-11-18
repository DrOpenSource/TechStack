# Mock-First Framework Integration Guide

**Purpose:** Complete guide for AI agents joining existing projects with mock-first development

---

## 🎯 Two Key Questions Answered

### **1. How do agents understand context in existing codebases?**

**Answer:** Through systematic context discovery and mapping.

**Process:**

```yaml
Step 1: Automatic Discovery
  - Scan project structure
  - Identify framework (Next.js, React, etc.)
  - Find existing services
  - Map dependencies

Step 2: Context Mapping
  - Create service inventory
  - Document project state
  - Track migration progress
  - Map architectural decisions

Step 3: Continuous Updates
  - Git integration for changes
  - File timestamp tracking
  - Metadata versioning
  - Automated context refresh
```

**Implementation Files:**
- `.claude/context/service-inventory.ts` - All services mapped
- `.claude/context/project-state.yml` - Current state
- `.claude/context/migration-tracker.ts` - Progress tracking

**See:** `context-discovery.md` for full details

---

### **2. How does planning work for both mock and real development?**

**Answer:** Through phased planning with clear agent roles and parallel workflows.

**Phased Approach:**

```yaml
Phase 1: Mock-First Prototyping (Week 1-2)
  Who: Frontend Developer + System Architect
  What: Build UI with mocks
  Output: Demo-ready prototype

Phase 2: Parallel Implementation (Week 2-3)
  Who: Frontend (refine) + Backend (build real) + Database
  What: Teams work independently
  Output: UI polished, Real services ready

Phase 3: Integration (Week 3-4)
  Who: Backend + Frontend + QA
  What: Switch mock → real, test
  Output: Integrated system

Phase 4: Production (Week 4+)
  Who: DevOps
  What: Deploy with real backend
  Output: Live feature (MOCK_MODE=false)
```

**Implementation Files:**
- `.claude/workflows/feature-development-mock-first.md` - Complete workflow
- `.claude/skills/development/mock-first-planning-workflow.md` - Planning framework

---

## 🚀 Quick Start for Agents

### **New Agent Joining Existing Project**

**Step 1: Discover Context** (5 minutes)

```bash
# Read context files
1. .claude/context/project-state.yml       # Project overview
2. .claude/context/service-inventory.ts    # What services exist
3. .claude/context/migration-tracker.ts    # What's in progress

# Check current mode
cat .env.local | grep MOCK_MODE
# NEXT_PUBLIC_MOCK_MODE=true (or false)
```

**Step 2: Understand Your Role** (10 minutes)

```yaml
If Product Architect:
  Read: mock-first-planning-workflow.md → Agent Roles → Product Architect

If Frontend Developer:
  Read: feature-development-mock-first.md → Stage 3: UI Development

If Backend Developer:
  Read: feature-development-mock-first.md → Stage 4: Backend Implementation

If QA Engineer:
  Read: feature-development-mock-first.md → Stage 6: Quality Assurance

If System Architect:
  Read: mock-first-planning-workflow.md → Agent Roles → System Architect
```

**Step 3: Start Working** (immediate)

```typescript
// Frontend: Always use service hooks
const userService = useUserService(); // Auto-routes to mock or real

// Backend: Match mock interface
// services/types/UserService.ts ← Read this first
// services/mock/mockUserService.ts ← Understand expected behavior
// services/real/userService.ts ← Implement matching interface

// QA: Test both modes
process.env.NEXT_PUBLIC_MOCK_MODE = 'true'; // Fast tests
process.env.NEXT_PUBLIC_MOCK_MODE = 'false'; // Integration tests
```

---

## 📚 Complete Document Map

```
.claude/skills/development/
├── mock-first-development.md           # Main skill - Implementation patterns
├── QUICK_START_MOCK_FIRST.md           # 5-min setup for new projects
├── README_MOCK_FIRST.md                # Framework overview
├── context-discovery.md                # NEW: How to understand existing codebases
├── mock-first-planning-workflow.md     # NEW: Planning for mock + real stages
├── INTEGRATION_GUIDE.md                # NEW: This file - Complete integration
└── templates/                          # Ready-to-use code templates

.claude/workflows/
└── feature-development-mock-first.md   # NEW: End-to-end workflow

.claude/context/ (Created during project work)
├── project-state.yml                   # Current project status
├── service-inventory.ts                # All services mapped
├── migration-tracker.ts                # Migration progress
└── metadata.yml                        # Context freshness
```

---

## 🔍 Context Discovery System

### **How Agents Know What Exists**

**Automatic Discovery:**

```typescript
// Agents execute on project join:
1. Scan for framework → package.json
2. Find services → glob("services/**/*.ts")
3. Identify mocks → glob("services/mock/**/*.ts")
4. Check config → readFile("lib/config/mockConfig.ts")
5. Analyze env → readFile(".env.local")

// Create context files:
6. Generate service-inventory.ts
7. Generate project-state.yml
8. Generate migration-tracker.ts
```

**Service Inventory Example:**

```typescript
{
  serviceName: 'authService',
  location: 'services/authService.ts',
  status: 'hybrid', // Has both mock and real
  mockLocation: 'services/mock/mockAuthService.ts',
  realLocation: 'services/real/authService.ts',
  dependencies: ['smsService', 'supabase'],
  usedBy: ['LoginPage', 'OTPVerification'],
  priority: 'critical',
  migrationStatus: 'completed',
}
```

### **How Agents Know What's Latest**

**Version Control Integration:**

```bash
# Check recent changes
git log --since="7 days ago" services/

# Check service freshness
stat services/mock/mockAuthService.ts
stat services/real/authService.ts

# Context metadata
last_update: "2025-11-18T10:30:00Z"
refresh_if_older_than: "24 hours"
```

**Trigger Context Refresh:**

```yaml
Refresh context when:
  - package.json changes
  - New service files added
  - Config files modified
  - Context > 24 hours old
  - Agent explicitly requests
```

---

## 📋 Planning Framework

### **How Features Are Planned**

**Decision Matrix:**

| Service Type | Mock First? | Reason |
|--------------|-------------|--------|
| Third-party API | ✅ Yes | Avoid early integration complexity |
| Complex backend | ✅ Yes | UI can be built while backend develops |
| Simple CRUD | ✅ Yes | Faster iteration on forms |
| Logging/Analytics | ❌ No | Simple enough to implement directly |
| Read-only API | ❌ No | Can use real API immediately |

**Timeline Planning:**

```
Week 1: Mock Phase
├─ Product Architect: Break down feature
├─ System Architect: Define interfaces
├─ Frontend Developer: Build UI with mocks
└─ Output: Demo-ready prototype

Week 2: Parallel Phase
├─ Frontend: Refine UI (still mocks) ─────┐
├─ Backend: Build real services ──────────┤ Simultaneous
├─ Database: Create schemas ──────────────┘
└─ Output: UI polished + Real backend ready

Week 3: Integration Phase
├─ Switch MOCK_MODE=false
├─ Integration testing
├─ Fix discrepancies
└─ Output: Integrated system

Week 4: Production Phase
├─ Deploy to staging
├─ Deploy to production
└─ Output: Live feature
```

### **Agent Coordination**

```yaml
Feature: User Registration

Parallel Workstreams:
  Frontend (Using Mocks):
    - Build registration form
    - Add OTP input
    - Create profile form
    - Test complete flow
    - Stakeholder demo

  Backend (Building Real):
    - Design database schema
    - Set up Supabase Auth
    - Configure SMS provider
    - Implement authService
    - Create API tests

  Database:
    - Create users table
    - Set up RLS policies
    - Create migrations

Synchronization Point:
  - All streams complete → Integration phase
  - Switch MOCK_MODE=false
  - Test together
```

---

## 🎯 Complete Workflow Example

### **Feature: E-commerce Checkout**

**Step 1: Context Discovery** (Product Architect)

```yaml
# Read existing context
Current services:
  - productService: hybrid (mock + real)
  - cartService: real only (localStorage)
  - orderService: not implemented
  - paymentService: not implemented

Current mode: MOCK_MODE=true

# Decision: Build new services mock-first
New mocks needed:
  - orderService (complex state management)
  - paymentService (third-party integration)
```

**Step 2: Planning** (System Architect)

```typescript
// Define interfaces
interface OrderService {
  create(cart: Cart): Promise<Order>;
  getById(id: string): Promise<Order>;
  getHistory(userId: string): Promise<Order[]>;
}

interface PaymentService {
  createIntent(amount: number): Promise<PaymentIntent>;
  confirmPayment(id: string): Promise<PaymentStatus>;
}

// Timeline
Week 1: Mock + UI
Week 2: Real implementation
Week 3: Integration
```

**Step 3: Mock Implementation** (Frontend Developer)

```typescript
// services/mock/mockOrderService.ts
export const mockOrderService: OrderService = {
  async create(cart: Cart) {
    await simulateDelay();
    return {
      id: `order-${Date.now()}`,
      items: cart.items,
      total: cart.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },
  // ... implement other methods
};

// services/mock/mockPaymentService.ts
export const mockPaymentService: PaymentService = {
  async createIntent(amount: number) {
    await simulateDelay();
    console.log(`[MOCK] Payment intent created for ₹${amount}`);
    return {
      id: `pi_mock_${Date.now()}`,
      amount,
      status: 'requires_confirmation',
    };
  },
  async confirmPayment(id: string) {
    await simulateDelay();
    console.log(`[MOCK] Payment ${id} confirmed`);
    return { status: 'succeeded' };
  },
};
```

**Step 4: UI Development** (Frontend Developer)

```typescript
// components/CheckoutPage.tsx
import { useOrderService } from '@/hooks/useOrderService';
import { usePaymentService } from '@/hooks/usePaymentService';

export function CheckoutPage() {
  const orderService = useOrderService(); // Auto-routes to mock
  const paymentService = usePaymentService(); // Auto-routes to mock

  const handleCheckout = async () => {
    // 1. Create order
    const order = await orderService.create(cart);

    // 2. Create payment intent
    const intent = await paymentService.createIntent(order.total);

    // 3. Confirm payment
    const payment = await paymentService.confirmPayment(intent.id);

    // 4. Show success
    if (payment.status === 'succeeded') {
      router.push('/order-success');
    }
  };

  // This works entirely with mocks!
  // No Razorpay setup needed yet
  // No database needed yet
}
```

**Step 5: Backend Implementation** (Backend Developer - Parallel)

```typescript
// services/real/orderService.ts
import { supabase } from '@/lib/supabase';

export const orderService: OrderService = {
  async create(cart: Cart) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: auth.user.id,
        items: cart.items,
        total: cart.total,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
  // ... implement other methods matching interface
};

// services/real/paymentService.ts
import Razorpay from 'razorpay';

export const paymentService: PaymentService = {
  async createIntent(amount: number) {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paisa
      currency: 'INR',
    });

    return {
      id: order.id,
      amount: order.amount / 100,
      status: 'requires_confirmation',
    };
  },
  // ... implement other methods
};
```

**Step 6: Integration** (Backend + Frontend + QA)

```bash
# Switch to real services
echo "NEXT_PUBLIC_MOCK_MODE=false" > .env.local

# Restart dev server
npm run dev

# Test checkout flow
✓ Order created in database
✓ Razorpay payment intent created
✓ Payment confirmation works
✓ Success page shows

# Component code: UNCHANGED ✓
# Just toggled environment variable
```

**Step 7: Deployment** (DevOps)

```bash
# Deploy to production
git push production

# Environment:
NEXT_PUBLIC_MOCK_MODE=false
RAZORPAY_KEY_ID=prod_key
RAZORPAY_KEY_SECRET=prod_secret

# Monitoring:
✓ Orders being created
✓ Payments processing
✓ No errors

# Mocks retained for:
- Unit testing
- Development
- Demos
```

---

## ✅ Success Checklist

### **For Product Architects:**
- [ ] Feature broken into user stories
- [ ] Services identified
- [ ] Mock-first decisions made
- [ ] Timeline created
- [ ] Context documented

### **For System Architects:**
- [ ] Service interfaces defined
- [ ] Mock and real implementations planned
- [ ] Dependencies mapped
- [ ] Migration strategy clear

### **For Frontend Developers:**
- [ ] Service hooks used (no direct imports)
- [ ] Complete UI built with mocks
- [ ] Sample data added
- [ ] User flow validated
- [ ] No code changes needed for mock→real switch

### **For Backend Developers:**
- [ ] Mock interface reviewed
- [ ] Real service matches interface
- [ ] Database schema created
- [ ] Third-party APIs configured
- [ ] API tests passing

### **For QA Engineers:**
- [ ] Unit tests with mocks (fast)
- [ ] Integration tests with real backend
- [ ] Both modes validated
- [ ] Performance acceptable
- [ ] Security verified

### **For DevOps:**
- [ ] Environment configured correctly
- [ ] MOCK_MODE=false in production
- [ ] Monitoring set up
- [ ] Mocks retained for testing

---

## 🎓 Training Resources

**Read in this order:**

1. **Overview** (15 min)
   - `README_MOCK_FIRST.md` - Framework benefits

2. **Quick Setup** (30 min)
   - `QUICK_START_MOCK_FIRST.md` - Hands-on setup

3. **Context Discovery** (30 min)
   - `context-discovery.md` - Understanding existing projects

4. **Planning** (45 min)
   - `mock-first-planning-workflow.md` - How to plan features

5. **Workflow** (60 min)
   - `feature-development-mock-first.md` - Complete process

6. **Implementation** (2 hours)
   - `mock-first-development.md` - All patterns and code

7. **Integration** (30 min)
   - `INTEGRATION_GUIDE.md` - This document

**Total:** ~5 hours to master the framework

---

## 🚀 Ready to Start?

**For New Projects:**
1. Read `QUICK_START_MOCK_FIRST.md`
2. Copy templates
3. Start building

**For Existing Projects:**
1. Read `context-discovery.md`
2. Run context discovery
3. Follow `feature-development-mock-first.md`

---

**Questions Answered:**
1. ✅ How do agents understand context? → Context discovery system
2. ✅ How does planning work? → Phased planning workflow

**Last Updated:** 2025-11-18
