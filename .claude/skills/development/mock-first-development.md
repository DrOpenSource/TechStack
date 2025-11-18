# Mock-First Development Framework

**Version:** 1.0.0
**Category:** Development Strategy
**Agent Compatibility:** All agents (Frontend, Backend, QA, Architecture)

---

## 🎯 Purpose

Enable **rapid prototyping and parallel development** by building fully functional mock demos BEFORE integrating real backend services, databases, or third-party APIs.

### **The Core Problem This Solves**

During early-stage development, teams get blocked by:
- ❌ Backend setup dependencies
- ❌ Database schema finalization delays
- ❌ Third-party API integration complexity
- ❌ OTP verification testing friction
- ❌ Real-time data dependency

### **The Solution**

Build V1 as a **fully functional mock demo** with:
- ✅ No backend setup required
- ✅ No database or real data dependency
- ✅ No OTP or verification APIs
- ✅ Pre-populated dummy data OR sample data suggestions
- ✅ Complete user flow validation
- ✅ **Clean substitution points** for later real integration

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  (Components, Forms, Pages - UNCHANGED by mock mode)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVICE ABSTRACTION LAYER                       │
│  ┌──────────────────────────────────────────────┐           │
│  │  useService() Hook - Auto-selects provider   │           │
│  └──────────────┬───────────────────────────────┘           │
│                 │                                             │
│      ┌──────────▼────────┐      ┌────────────────────┐      │
│      │  MOCK_MODE=true   │      │  MOCK_MODE=false   │      │
│      └──────────┬────────┘      └─────────┬──────────┘      │
│                 │                           │                 │
│                 ▼                           ▼                 │
│      ┌──────────────────┐       ┌──────────────────┐        │
│      │  Mock Services   │       │  Real Services   │        │
│      │  • mockUserSvc   │       │  • userService   │        │
│      │  • mockAuthSvc   │       │  • authService   │        │
│      │  • mockDataSvc   │       │  • dataService   │        │
│      └─────────┬────────┘       └─────────┬────────┘        │
└────────────────┼──────────────────────────┼─────────────────┘
                 │                           │
                 ▼                           ▼
      ┌──────────────────┐       ┌──────────────────┐
      │  Mock Data Gen   │       │  Supabase API    │
      │  • Faker.js      │       │  • PostgreSQL    │
      │  • Zod schemas   │       │  • Realtime      │
      │  • Fixtures      │       │  • Storage       │
      └──────────────────┘       └──────────────────┘
```

---

## 🛠️ Implementation Guide

### **Step 1: Configuration Setup**

**Environment Variable Control:**

```bash
# .env.local (Development - Mock Mode)
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_MOCK_DELAY=800  # Simulate network latency (ms)
NEXT_PUBLIC_MOCK_ERROR_RATE=0  # 0-100, for testing error states

# .env.production (Production - Real Mode)
NEXT_PUBLIC_MOCK_MODE=false
```

**Centralized Configuration:**

```typescript
// lib/config/mockConfig.ts
export const mockConfig = {
  enabled: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  delay: parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '500', 10),
  errorRate: parseInt(process.env.NEXT_PUBLIC_MOCK_ERROR_RATE || '0', 10),

  // Feature-specific toggles
  features: {
    auth: process.env.NEXT_PUBLIC_MOCK_AUTH !== 'false',
    database: process.env.NEXT_PUBLIC_MOCK_DATABASE !== 'false',
    storage: process.env.NEXT_PUBLIC_MOCK_STORAGE !== 'false',
    sms: process.env.NEXT_PUBLIC_MOCK_SMS !== 'false',
  },
};

// Helper to check if any mock is enabled
export const isMockMode = () => mockConfig.enabled;
```

---

### **Step 2: Service Layer Abstraction**

**Service Factory Pattern:**

```typescript
// lib/services/factory.ts
import { mockConfig } from '@/lib/config/mockConfig';
import type { UserService } from './types';

export function createUserService(): UserService {
  if (mockConfig.enabled) {
    return import('./mock/mockUserService').then(m => m.mockUserService);
  }
  return import('./real/userService').then(m => m.userService);
}

// Usage in components
export async function getUserService() {
  return await createUserService();
}
```

**Hook-Based Service Access (Recommended):**

```typescript
// hooks/useService.ts
import { useMemo } from 'react';
import { mockConfig } from '@/lib/config/mockConfig';
import { userService } from '@/services/real/userService';
import { mockUserService } from '@/services/mock/mockUserService';

export function useUserService() {
  return useMemo(() => {
    return mockConfig.enabled ? mockUserService : userService;
  }, []);
}

// Component usage
function UserProfile() {
  const userService = useUserService();

  const handleSave = async (data) => {
    await userService.update(userId, data); // Auto-routes to mock or real
  };
}
```

---

### **Step 3: Mock Data Generation**

**Zod Schema-Based Mock Data:**

```typescript
// lib/mocks/generators/userGenerator.ts
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { userProfileSchema } from '@/lib/validations/userSchema';

export function generateMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: `+91${faker.string.numeric(10)}`,
    avatar: faker.image.avatar(),
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

// Generate multiple users
export function generateMockUsers(count: number = 10): User[] {
  return Array.from({ length: count }, () => generateMockUser());
}

// Validate against schema
export function generateValidMockUser(): User {
  const user = generateMockUser();
  return userProfileSchema.parse(user); // Ensures Zod validation
}
```

**Fixture Files for Consistent Data:**

```typescript
// lib/mocks/fixtures/users.fixture.ts
export const MOCK_USERS = [
  {
    id: 'user-demo-001',
    name: 'Alice Johnson',
    email: 'alice.demo@example.com',
    phone: '+919876543210',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'user-demo-002',
    name: 'Bob Smith',
    email: 'bob.demo@example.com',
    phone: '+919876543211',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  // ... more fixture data
];

export const DEMO_ADMIN = MOCK_USERS[0];
export const DEMO_USER = MOCK_USERS[1];
```

---

### **Step 4: Mock Service Implementation**

**Complete Service Example:**

```typescript
// services/mock/mockUserService.ts
import { MOCK_USERS } from '@/lib/mocks/fixtures/users.fixture';
import { generateMockUser } from '@/lib/mocks/generators/userGenerator';
import { mockConfig } from '@/lib/config/mockConfig';
import { simulateDelay, simulateError } from '@/lib/mocks/utils';

export const mockUserService = {
  async getAll(options?: PaginationOptions): Promise<PaginatedResponse<User>> {
    await simulateDelay(); // Realistic network latency
    await simulateError(); // Random error simulation (if enabled)

    const { page = 1, limit = 10 } = options || {};
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: MOCK_USERS.slice(start, end),
      pagination: {
        page,
        limit,
        total: MOCK_USERS.length,
        totalPages: Math.ceil(MOCK_USERS.length / limit),
      },
    };
  },

  async getById(id: string): Promise<User | null> {
    await simulateDelay();
    return MOCK_USERS.find(u => u.id === id) || null;
  },

  async create(userData: CreateUserInput): Promise<User> {
    await simulateDelay();
    const newUser = {
      ...generateMockUser(),
      ...userData,
      id: `user-mock-${Date.now()}`,
    };
    MOCK_USERS.push(newUser); // In-memory persistence
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    await simulateDelay();
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    MOCK_USERS[index] = { ...MOCK_USERS[index], ...updates };
    return MOCK_USERS[index];
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index !== -1) MOCK_USERS.splice(index, 1);
  },
};
```

**Mock Utilities:**

```typescript
// lib/mocks/utils.ts
import { mockConfig } from '@/lib/config/mockConfig';

export async function simulateDelay(customDelay?: number) {
  const delay = customDelay ?? mockConfig.delay;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export async function simulateError() {
  if (mockConfig.errorRate > 0) {
    const shouldError = Math.random() * 100 < mockConfig.errorRate;
    if (shouldError) {
      throw new Error('Simulated network error');
    }
  }
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
```

---

### **Step 5: Form Pre-Population**

**Sample Data Suggestions:**

```typescript
// components/forms/UserProfileForm.tsx
import { SAMPLE_DATA } from '@/lib/mocks/sampleData';

export function UserProfileForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Auto-populate in dev mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && mockConfig.enabled) {
      setForm(SAMPLE_DATA.userProfile);
    }
  }, []);

  return (
    <form>
      <Input
        name="name"
        label="Full Name"
        value={form.name}
        onChange={handleChange}
        placeholder="e.g., Alice Johnson"
        helperText={
          <SampleDataHint>
            Try: {SAMPLE_DATA.userProfile.name}
          </SampleDataHint>
        }
      />

      <Input
        name="email"
        label="Email"
        value={form.email}
        onChange={handleChange}
        placeholder="e.g., alice@example.com"
        helperText={
          <SampleDataHint>
            Try: {SAMPLE_DATA.userProfile.email}
          </SampleDataHint>
        }
      />
    </form>
  );
}
```

**Sample Data Library:**

```typescript
// lib/mocks/sampleData.ts
export const SAMPLE_DATA = {
  userProfile: {
    name: 'Alice Johnson',
    email: 'alice.demo@example.com',
    phone: '+919876543210',
    bio: 'Product designer passionate about user experience',
  },

  address: {
    street: '123 MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India',
  },

  payment: {
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/25',
    cvv: '123',
    name: 'Alice Johnson',
  },

  otp: {
    code: '123456',
    hint: 'Use 123456 for all OTP fields in demo mode',
  },
};
```

**Auto-Fill Component:**

```typescript
// components/ui/SampleDataHint.tsx
import { mockConfig } from '@/lib/config/mockConfig';

export function SampleDataHint({ children }: { children: React.ReactNode }) {
  if (!mockConfig.enabled) return null;

  return (
    <span className="text-xs text-muted-foreground italic">
      💡 {children}
    </span>
  );
}

// Quick-fill button
export function AutoFillButton({ onClick, label = 'Use Sample Data' }) {
  if (!mockConfig.enabled) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-primary hover:underline"
    >
      ⚡ {label}
    </button>
  );
}
```

---

### **Step 6: Authentication Mocking**

**Mock Auth Service:**

```typescript
// services/mock/mockAuthService.ts
import { DEMO_ADMIN, DEMO_USER } from '@/lib/mocks/fixtures/users.fixture';
import { simulateDelay } from '@/lib/mocks/utils';

export const mockAuthService = {
  async sendOTP(phone: string): Promise<{ success: boolean }> {
    await simulateDelay();
    console.log(`[MOCK] OTP sent to ${phone}: 123456`);
    return { success: true };
  },

  async verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
    await simulateDelay();

    // Accept any OTP in mock mode, or specifically 123456
    if (otp === '123456' || mockConfig.features.auth) {
      return {
        success: true,
        user: DEMO_USER,
        token: 'mock-jwt-token-' + Date.now(),
      };
    }

    throw new Error('Invalid OTP');
  },

  async signOut(): Promise<void> {
    await simulateDelay();
    console.log('[MOCK] User signed out');
  },

  async getCurrentUser(): Promise<User | null> {
    await simulateDelay();
    // Return demo user if "logged in"
    return DEMO_USER;
  },
};
```

---

### **Step 7: API Route Mocking (Next.js)**

**Mock API Handler Wrapper:**

```typescript
// lib/api/withMock.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockConfig } from '@/lib/config/mockConfig';

export function withMock<T>(
  realHandler: (req: NextRequest) => Promise<NextResponse<T>>,
  mockHandler: (req: NextRequest) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest) => {
    if (mockConfig.enabled) {
      console.log('[MOCK API]', req.method, req.url);
      return mockHandler(req);
    }
    return realHandler(req);
  };
}
```

**Usage in API Route:**

```typescript
// app/api/v1/users/route.ts
import { withMock } from '@/lib/api/withMock';
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mocks/fixtures/users.fixture';

// Real implementation
async function realHandler(req: NextRequest) {
  const { data } = await supabase.from('users').select('*');
  return NextResponse.json({ success: true, data });
}

// Mock implementation
async function mockHandler(req: NextRequest) {
  await new Promise(r => setTimeout(r, 500)); // Simulate latency
  return NextResponse.json({ success: true, data: MOCK_USERS });
}

// Export with automatic switching
export const GET = withMock(realHandler, mockHandler);
```

---

### **Step 8: Database Query Mocking**

**Supabase Client Wrapper:**

```typescript
// lib/supabase/createClient.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { mockConfig } from '@/lib/config/mockConfig';
import { createMockClient } from './mockClient';

export function createClient() {
  if (mockConfig.features.database) {
    return createMockClient(); // Returns mock Supabase-compatible client
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Mock Supabase Client:**

```typescript
// lib/supabase/mockClient.ts
import { MOCK_USERS } from '@/lib/mocks/fixtures/users.fixture';

export function createMockClient() {
  const mockData = {
    users: MOCK_USERS,
    // ... other tables
  };

  return {
    from(table: string) {
      return {
        select(query: string) {
          console.log(`[MOCK DB] SELECT ${query} FROM ${table}`);
          return {
            data: mockData[table] || [],
            error: null,
          };
        },
        insert(data: any) {
          console.log(`[MOCK DB] INSERT INTO ${table}`, data);
          mockData[table].push(data);
          return { data, error: null };
        },
        update(data: any) {
          console.log(`[MOCK DB] UPDATE ${table}`, data);
          return { data, error: null };
        },
        delete() {
          console.log(`[MOCK DB] DELETE FROM ${table}`);
          return { data: null, error: null };
        },
      };
    },
    auth: {
      signInWithOtp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  };
}
```

---

## 📋 Implementation Checklist

When implementing a new feature in **Mock-First Mode**, follow this checklist:

### **Phase 1: Setup (1 hour)**
- [ ] Create Zod validation schemas
- [ ] Generate mock data using faker + schemas
- [ ] Create fixture data for deterministic testing
- [ ] Define service interface (TypeScript types)

### **Phase 2: Mock Implementation (2-4 hours)**
- [ ] Implement mock service with CRUD operations
- [ ] Add realistic delays and error simulation
- [ ] Create sample data for forms
- [ ] Build form pre-population utilities

### **Phase 3: UI Development (1-2 days)**
- [ ] Build components using mock services
- [ ] Validate complete user flow end-to-end
- [ ] Test edge cases with error simulation
- [ ] Gather user feedback on flow

### **Phase 4: Real Integration (4-8 hours)**
- [ ] Implement real service layer
- [ ] Create database migrations/schema
- [ ] Set up API endpoints
- [ ] Replace mock with real services via config toggle
- [ ] Run integration tests

### **Phase 5: Validation (2-4 hours)**
- [ ] Test with MOCK_MODE=true
- [ ] Test with MOCK_MODE=false
- [ ] Ensure seamless switching
- [ ] Deploy to staging

---

## 🎓 Usage Patterns by Role

### **Frontend Developers**
```typescript
// Always use hooks to access services
const userService = useUserService();
const authService = useAuthService();

// Services auto-route to mock/real based on config
const users = await userService.getAll();
```

### **Backend Developers**
```typescript
// Implement both real and mock versions
// Real: services/real/userService.ts
// Mock: services/mock/mockUserService.ts

// Both must match the same interface
export interface UserService {
  getAll(options): Promise<User[]>;
  create(data): Promise<User>;
  // ...
}
```

### **QA Engineers**
```bash
# Test with mocks (fast, deterministic)
NEXT_PUBLIC_MOCK_MODE=true npm run test

# Test with real API (integration tests)
NEXT_PUBLIC_MOCK_MODE=false npm run test:e2e

# Simulate errors
NEXT_PUBLIC_MOCK_ERROR_RATE=20 npm run dev
```

### **Product Managers**
```bash
# Quick demo with pre-filled data
NEXT_PUBLIC_MOCK_MODE=true npm run dev

# Show realistic loading states
NEXT_PUBLIC_MOCK_DELAY=2000 npm run dev
```

---

## 🚀 Benefits Checklist

✅ **Parallel Development**
- Frontend & backend teams work independently
- No blocking dependencies

✅ **Faster Prototyping**
- Build complete user flows in hours, not days
- Validate UX before backend investment

✅ **Better Testing**
- Deterministic test data
- Error scenario simulation
- Fast test execution

✅ **Improved Demos**
- Always-working demo environment
- Pre-filled data for stakeholders
- No external service dependencies

✅ **Cleaner Architecture**
- Clear separation of concerns
- Type-safe service contracts
- Easy integration swapping

---

## 📚 File Structure

```
project/
├── lib/
│   ├── config/
│   │   └── mockConfig.ts          # Central config
│   ├── mocks/
│   │   ├── fixtures/              # Static test data
│   │   │   ├── users.fixture.ts
│   │   │   └── ...
│   │   ├── generators/            # Dynamic data generation
│   │   │   ├── userGenerator.ts
│   │   │   └── ...
│   │   ├── sampleData.ts          # Form sample data
│   │   └── utils.ts               # Mock utilities
│   └── api/
│       └── withMock.ts            # API route wrapper
├── services/
│   ├── real/                      # Real implementations
│   │   ├── userService.ts
│   │   └── ...
│   ├── mock/                      # Mock implementations
│   │   ├── mockUserService.ts
│   │   └── ...
│   ├── types.ts                   # Service interfaces
│   └── factory.ts                 # Service factories
├── hooks/
│   └── useService.ts              # Service selection hooks
└── components/
    └── ui/
        ├── SampleDataHint.tsx     # UI helpers
        └── AutoFillButton.tsx
```

---

## 🔄 Migration Path: Mock → Real

```typescript
// Step 1: Start with mock (Week 1)
NEXT_PUBLIC_MOCK_MODE=true

// Step 2: Build real services (Week 2-3)
// Implement services/real/* matching service interfaces

// Step 3: Test side-by-side (Week 3)
// Toggle between mock/real to verify parity

// Step 4: Switch to real (Week 4)
NEXT_PUBLIC_MOCK_MODE=false

// Step 5: Keep mocks for testing
// Use mocks in unit tests and demos
```

---

## 🎯 Success Metrics

Your mock-first implementation is successful when:

1. ✅ Complete user flow works without any backend setup
2. ✅ Frontend team can work 100% independently
3. ✅ Switching MOCK_MODE causes zero code changes in components
4. ✅ Demo is always running and stakeholder-ready
5. ✅ Test suite runs in < 10 seconds (using mocks)
6. ✅ New team members can start contributing in < 1 hour

---

## 📖 Quick Reference

| Task | Command |
|------|---------|
| **Run with mocks** | `NEXT_PUBLIC_MOCK_MODE=true npm run dev` |
| **Run with real backend** | `NEXT_PUBLIC_MOCK_MODE=false npm run dev` |
| **Simulate slow network** | `NEXT_PUBLIC_MOCK_DELAY=3000 npm run dev` |
| **Simulate errors** | `NEXT_PUBLIC_MOCK_ERROR_RATE=25 npm run dev` |
| **Generate mock data** | `npm run mocks:generate` |
| **Reset mock database** | `npm run mocks:reset` |

---

## 🔗 Related Skills

- [Form Validator](/skills/frontend/form-validator.md) - Works with mock data validation
- [API Designer](/skills/backend/api-designer.md) - Design APIs mocked initially
- [Test Suite Builder](/skills/quality/test-suite-builder.md) - Uses mocks for fast tests
- [Component Library](/skills/frontend/component-library.md) - Components work with mocks

---

## ✍️ Agent Instructions

When using this skill, agents should:

1. **ALWAYS start with mock implementation** before real services
2. **Generate mock data using Zod schemas** for type safety
3. **Create fixtures** for deterministic testing
4. **Use service hooks** in components, never import directly
5. **Test both modes** (mock=true, mock=false) before declaring complete
6. **Document sample data** in UI for user guidance
7. **Simulate realistic delays** for better UX testing

---

**Last Updated:** 2025-11-18
**Maintained By:** System Architect Agent
