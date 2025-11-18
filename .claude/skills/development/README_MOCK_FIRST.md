# Mock-First Development Framework

> **Build functional demos and prototypes WITHOUT backend dependencies**

## 📌 What is This?

A complete framework for **mock-first development** that enables teams to:

- ✅ Build entire user flows **without backend setup**
- ✅ Work in **parallel** (frontend/backend teams)
- ✅ **Demo to stakeholders** immediately
- ✅ **Switch to real backend** with a config toggle
- ✅ Test **error states** and **loading scenarios**

---

## 🎯 The Problem It Solves

**Traditional Development Flow:**

```
1. Design UI mockups
2. Wait for backend API ❌ BLOCKED
3. Wait for database schema ❌ BLOCKED
4. Wait for OTP integration ❌ BLOCKED
5. Finally build UI
6. Discover UX issues
7. Start over...
```

**Mock-First Development Flow:**

```
1. Design UI mockups
2. Build UI with mock data ✅ IMMEDIATE
3. Complete entire user flow ✅ WORKING
4. Get stakeholder feedback ✅ DEMO READY
5. Backend team works in parallel ✅ NO BLOCKING
6. Plug in real backend ✅ CLEAN SWAP
7. Ship to production ✅ FAST
```

---

## 🚀 Quick Start

### **Option 1: Use Complete Templates** (Recommended)

```bash
# Copy all templates to your project
cd your-project/
cp -r .claude/skills/development/templates/* ./

# Set up environment
cp .env.example .env.local

# Edit .env.local
echo "NEXT_PUBLIC_MOCK_MODE=true" > .env.local

# Start development
npm run dev
```

### **Option 2: Follow Step-by-Step Guide**

See: [`QUICK_START_MOCK_FIRST.md`](./QUICK_START_MOCK_FIRST.md)

### **Option 3: Read Full Documentation**

See: [`mock-first-development.md`](./mock-first-development.md)

---

## 📦 What's Included

### **1. Configuration System** (`mockConfig.ts`)
- Environment-based toggle (`MOCK_MODE`)
- Network delay simulation
- Error rate simulation
- Feature-specific toggles

### **2. Mock Data Layer**
- **Utilities** (`mockUtils.ts`) - Delay, pagination, search, sorting
- **Sample Data** (`sampleData.ts`) - Pre-defined data for forms
- **Generators** - Create realistic mock data

### **3. Service Abstraction**
- **Hooks** (`useService.ts`) - Auto-select mock/real services
- **Factories** - Service creation patterns
- **Examples** - User service, Auth service

### **4. UI Components** (`SampleDataComponents.tsx`)
- Sample data hints
- Auto-fill buttons
- Mock mode badge
- OTP input with hints
- Loading indicators

### **5. Documentation**
- Full skill guide
- Quick start guide
- Templates and examples
- Troubleshooting guide

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         COMPONENT LAYER                 │
│  (Uses services via hooks - unchanged)  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       SERVICE SELECTION LAYER           │
│  useService() → Auto-routes based on    │
│                 MOCK_MODE config         │
└──────┬─────────────────────┬────────────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│ Mock Service │      │ Real Service │
│ • Fast       │      │ • Supabase   │
│ • Offline    │      │ • APIs       │
│ • No setup   │      │ • Database   │
└──────────────┘      └──────────────┘
```

**Key Principle:** Components never know if they're using mock or real services.

---

## 💡 Usage Patterns

### **Pattern 1: Service Hook (Recommended)**

```typescript
// hooks/useUserService.ts
import { createServiceHook } from '@/hooks/useService';
import { mockUserService } from '@/services/mock/mockUserService';
import { userService } from '@/services/real/userService';

export const useUserService = createServiceHook(mockUserService, userService);

// Component usage
function UserList() {
  const userService = useUserService(); // Auto-selects mock or real
  const users = await userService.getAll();
}
```

### **Pattern 2: Form Auto-Fill**

```typescript
import { FormWithSampleData } from '@/components/mock/SampleDataComponents';
import { SAMPLE_DATA } from '@/lib/mocks/sampleData';

function ProfileForm() {
  return (
    <FormWithSampleData
      sampleData={SAMPLE_DATA.userProfile}
      onFill={setFormData}
    >
      {/* Your form fields */}
    </FormWithSampleData>
  );
}
```

### **Pattern 3: OTP with Mock Hint**

```typescript
import { OTPInputWithHint } from '@/components/mock/SampleDataComponents';

function OTPVerification() {
  return (
    <OTPInputWithHint
      value={otp}
      onChange={setOtp}
      mockCode="123456"  // Shows in dev mode
    />
  );
}
```

---

## 🎛️ Configuration

### **Environment Variables**

```bash
# .env.local (Development - Mocks)
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_MOCK_DELAY=800
NEXT_PUBLIC_MOCK_ERROR_RATE=0

# .env.production (Production - Real)
NEXT_PUBLIC_MOCK_MODE=false
```

### **Runtime Control**

```bash
# Fast mocks for development
NEXT_PUBLIC_MOCK_MODE=true npm run dev

# Real backend for integration testing
NEXT_PUBLIC_MOCK_MODE=false npm run dev

# Test slow networks
NEXT_PUBLIC_MOCK_DELAY=3000 npm run dev

# Test error states
NEXT_PUBLIC_MOCK_ERROR_RATE=20 npm run dev
```

---

## 📚 File Structure

```
.claude/skills/development/
├── mock-first-development.md       # Full skill documentation
├── QUICK_START_MOCK_FIRST.md       # Quick start guide
├── README_MOCK_FIRST.md             # This file
└── templates/                       # Ready-to-use templates
    ├── mockConfig.ts                # Central configuration
    ├── mockUtils.ts                 # Utility functions
    ├── sampleData.ts                # Sample data library
    ├── useService.ts                # Service selection hooks
    ├── mockUserService.ts           # Example user service
    ├── mockAuthService.ts           # Example auth service
    ├── SampleDataComponents.tsx     # UI components
    └── .env.example                 # Environment template
```

---

## 🎯 Benefits

| Challenge | Solution |
|-----------|----------|
| **Backend blocks frontend** | Frontend works independently with mocks |
| **Can't demo early** | Always-ready demo with pre-filled data |
| **Hard to test edge cases** | Simulate errors, delays, edge cases easily |
| **Slow development** | Parallel team workflows |
| **Testing requires full stack** | Fast unit tests with mocks |
| **Onboarding friction** | New devs start contributing immediately |

---

## 🔄 Migration Path

### **Week 1-2: Build with Mocks**
```bash
NEXT_PUBLIC_MOCK_MODE=true
```
- Build all UI components
- Complete user flows
- Get stakeholder feedback

### **Week 3: Implement Real Backend**
```bash
# Toggle between mock/real for testing
NEXT_PUBLIC_MOCK_MODE=true/false
```
- Implement real services
- Test side-by-side
- Ensure parity

### **Week 4: Production**
```bash
NEXT_PUBLIC_MOCK_MODE=false
```
- Deploy with real backend
- Keep mocks for testing

---

## 🧪 Testing Scenarios

### **Scenario 1: Demo to Stakeholders**
```bash
NEXT_PUBLIC_MOCK_MODE=true \
NEXT_PUBLIC_MOCK_DELAY=500 \
npm run dev
```
- Fast responses
- Pre-filled forms
- No setup required

### **Scenario 2: Test Loading States**
```bash
NEXT_PUBLIC_MOCK_DELAY=3000 npm run dev
```
- Simulate slow network
- Validate loading indicators
- Test user patience

### **Scenario 3: Test Error Handling**
```bash
NEXT_PUBLIC_MOCK_ERROR_RATE=25 npm run dev
```
- Random errors
- Test retry logic
- Validate error messages

### **Scenario 4: Integration Testing**
```bash
NEXT_PUBLIC_MOCK_MODE=false npm run test:e2e
```
- Real backend
- Database queries
- API integration

---

## 🆘 Troubleshooting

### **Mock mode not enabled?**

1. Check `.env.local` exists
2. Verify `NEXT_PUBLIC_MOCK_MODE=true`
3. Restart dev server
4. Check browser console for `[MOCK]` logs

### **Services calling real backend?**

1. Use `useService()` hook (not direct import)
2. Verify service factory checks `mockConfig.enabled`
3. Clear browser cache

### **Sample data not showing?**

1. Ensure mock mode is enabled
2. Check component imports
3. Verify `mockConfig.enabled === true` in console

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [`mock-first-development.md`](./mock-first-development.md) | Complete skill guide with all patterns |
| [`QUICK_START_MOCK_FIRST.md`](./QUICK_START_MOCK_FIRST.md) | 5-minute setup guide |
| [`README_MOCK_FIRST.md`](./README_MOCK_FIRST.md) | This overview document |
| [`templates/`](./templates/) | Ready-to-use code templates |

---

## 🎓 Best Practices

1. **✅ DO:** Start every feature with mocks
2. **✅ DO:** Use service hooks for abstraction
3. **✅ DO:** Keep mock and real services matching same interface
4. **✅ DO:** Test both modes before deploying
5. **❌ DON'T:** Import services directly in components
6. **❌ DON'T:** Hardcode backend URLs
7. **❌ DON'T:** Skip mock implementation
8. **❌ DON'T:** Forget to update mocks when API changes

---

## 🚀 Getting Started

1. **Read:** [Quick Start Guide](./QUICK_START_MOCK_FIRST.md) (5 min)
2. **Copy:** Templates to your project (2 min)
3. **Configure:** `.env.local` with `MOCK_MODE=true` (1 min)
4. **Build:** Your first mock service (10 min)
5. **Iterate:** Build entire user flow with mocks (1-2 days)
6. **Switch:** To real backend when ready (hours, not days)

---

## 💬 Questions?

- **Full Documentation:** See `mock-first-development.md`
- **Quick Setup:** See `QUICK_START_MOCK_FIRST.md`
- **Code Examples:** See `templates/` directory
- **Troubleshooting:** See sections above

---

## 📊 Success Metrics

Your implementation is successful when:

- ✅ Complete user flow works without backend
- ✅ Frontend team 100% unblocked
- ✅ Switching `MOCK_MODE` requires zero code changes
- ✅ Demo always ready for stakeholders
- ✅ Test suite runs in < 10 seconds (with mocks)
- ✅ New developers productive in < 1 hour

---

**Happy Building! 🎉**

**Last Updated:** 2025-11-18
