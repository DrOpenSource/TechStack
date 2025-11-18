# Feature Development Workflow (Mock-First)

**Purpose:** End-to-end workflow for building features using mock-first development strategy

**Estimated Timeline:** 3-5 days per feature (40% faster than traditional approach)

---

## 🎯 Overview

This workflow enables **parallel development** by building UI with mocks first, then integrating real backend services.

```
Traditional Flow (Sequential):
Plan → Backend (blocked) → Frontend (blocked) → Test → Deploy
Timeline: 5-7 days

Mock-First Flow (Parallel):
Plan → Mock + UI (parallel) Backend → Integrate → Test → Deploy
Timeline: 3-5 days
```

---

## 📋 Workflow Stages

### **Stage 1: Discovery & Planning** (2-3 hours)

**Lead:** Product Architect + System Architect

**Tasks:**

1. **Context Discovery**
   ```bash
   # Check existing project state
   - Review .claude/context/project-state.yml
   - Review .claude/context/service-inventory.ts
   - Check current MOCK_MODE setting
   - Identify existing services that can be reused
   ```

2. **Feature Breakdown**
   ```yaml
   Feature: [Feature Name]

   User Stories:
     - As a [user], I can [action]
     - As a [user], I can [action]

   Required Services:
     - [service1]: [purpose]
     - [service2]: [purpose]

   Dependencies:
     - Existing: [list services that exist]
     - New Mock: [list services to mock]
     - New Real: [list services to build real]
   ```

3. **Mock-First Decision Matrix**
   ```yaml
   For each service:
     - Mock first? [Yes/No]
     - Reason: [complexity/integration/etc.]
     - Priority: [critical/high/medium/low]
     - Estimated hours: [mock, real, integration]
   ```

4. **Phasing Strategy**
   ```yaml
   Week 1: Build with Mocks
     - UI complete
     - User flow validated
     - Demo ready

   Week 2: Backend Implementation
     - Real services built
     - Database schemas created
     - Integration ready

   Week 3: Integration & Testing
     - Switch to real backend
     - Integration tests
     - Deploy
   ```

**Output:**
- Feature plan document
- Service interface definitions
- Timeline with milestones
- Resource allocation

---

### **Stage 2: Mock Implementation** (4-8 hours)

**Lead:** Frontend Developer + System Architect

**Tasks:**

1. **Create Service Interfaces**
   ```typescript
   // services/types/[Feature]Service.ts
   export interface FeatureService {
     method1(param: Type): Promise<ReturnType>;
     method2(param: Type): Promise<ReturnType>;
   }
   ```

2. **Build Mock Service**
   ```typescript
   // services/mock/mock[Feature]Service.ts
   import { simulateDelay, MockDataStore } from '@/lib/mocks/mockUtils';
   import { FeatureService } from '../types/FeatureService';

   const MOCK_DATA = [/* fixture data */];
   const store = new MockDataStore(MOCK_DATA);

   export const mockFeatureService: FeatureService = {
     async method1(param) {
       await simulateDelay();
       return store.getAll();
     },
     // ... implement all interface methods
   };
   ```

3. **Create Service Hook**
   ```typescript
   // hooks/useFeatureService.ts
   import { createServiceHook } from '@/hooks/useService';
   import { mockFeatureService } from '@/services/mock/mockFeatureService';
   import { featureService } from '@/services/real/featureService'; // Will implement later

   export const useFeatureService = createServiceHook(
     mockFeatureService,
     featureService
   );
   ```

4. **Update Service Inventory**
   ```typescript
   // .claude/context/service-inventory.ts
   {
     serviceName: 'featureService',
     location: 'services/featureService.ts',
     status: 'mock',
     mockLocation: 'services/mock/mockFeatureService.ts',
     realLocation: null, // Will implement later
     dependencies: [],
     usedBy: [],
     priority: 'high',
     migrationStatus: 'planned',
   }
   ```

**Output:**
- Service interface defined
- Mock service implemented
- Service hook created
- Inventory updated

---

### **Stage 3: UI Development** (1-2 days)

**Lead:** Frontend Developer

**Tasks:**

1. **Build Components Using Service Hooks**
   ```typescript
   // components/FeaturePage.tsx
   import { useFeatureService } from '@/hooks/useFeatureService';
   import { FormWithSampleData } from '@/components/mock/SampleDataComponents';
   import { SAMPLE_DATA } from '@/lib/mocks/sampleData';

   export function FeaturePage() {
     const featureService = useFeatureService(); // Auto-routes to mock
     const [data, setData] = useState([]);

     useEffect(() => {
       featureService.getAll().then(setData);
     }, []);

     return (
       <FormWithSampleData
         sampleData={SAMPLE_DATA.feature}
         onFill={handleAutoFill}
       >
         {/* UI components */}
       </FormWithSampleData>
     );
   }
   ```

2. **Add Sample Data**
   ```typescript
   // Update lib/mocks/sampleData.ts
   export const SAMPLE_FEATURE_DATA = {
     field1: 'Sample value',
     field2: 'Sample value',
   };

   export const SAMPLE_DATA = {
     // ... existing data
     feature: SAMPLE_FEATURE_DATA,
   };
   ```

3. **Test Complete User Flow**
   ```bash
   # Ensure MOCK_MODE is enabled
   NEXT_PUBLIC_MOCK_MODE=true npm run dev

   # Walk through entire flow
   ✓ All screens load
   ✓ Forms pre-populate
   ✓ Validation works
   ✓ Success/error states show
   ✓ Navigation flows correctly
   ```

4. **Create Mock Data Inspector View** (Optional)
   ```typescript
   // For debugging/demos
   {mockConfig.enabled && (
     <div>Current data: {JSON.stringify(data, null, 2)}</div>
   )}
   ```

**Output:**
- Complete UI built
- User flow validated
- Works entirely with mocks
- No backend needed
- Demo-ready

---

### **Stage 4: Backend Implementation** (PARALLEL with Stage 3)

**Lead:** Backend Developer + Database Engineer

**Tasks:**

1. **Review Mock Interface**
   ```typescript
   // Read services/types/[Feature]Service.ts
   // Understand expected methods and data structures
   // Note: Must match interface exactly
   ```

2. **Database Schema Design**
   ```sql
   -- migrations/[timestamp]_create_feature_table.sql
   CREATE TABLE feature (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     field1 TEXT NOT NULL,
     field2 TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- RLS Policies
   ALTER TABLE feature ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view own data"
     ON feature FOR SELECT
     USING (auth.uid() = user_id);
   ```

3. **Implement Real Service**
   ```typescript
   // services/real/featureService.ts
   import { supabase } from '@/lib/supabase';
   import { FeatureService } from '../types/FeatureService';

   export const featureService: FeatureService = {
     async method1(param) {
       const { data, error } = await supabase
         .from('feature')
         .select('*');

       if (error) throw new Error(error.message);
       return data;
     },
     // ... implement all interface methods
   };
   ```

4. **Configure Third-Party Integrations**
   ```typescript
   // If needed: SMS, Payment, Storage, etc.
   // lib/integrations/smsProvider.ts
   export const smsProvider = {
     async send(phone, message) {
       const response = await fetch(SMS_API_URL, {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${SMS_API_KEY}` },
         body: JSON.stringify({ phone, message }),
       });
       return response.json();
     },
   };
   ```

5. **Create API Tests**
   ```typescript
   // __tests__/services/featureService.test.ts
   describe('FeatureService (Real)', () => {
     beforeEach(() => {
       process.env.NEXT_PUBLIC_MOCK_MODE = 'false';
     });

     it('should fetch data from database', async () => {
       const data = await featureService.getAll();
       expect(data).toBeDefined();
     });
   });
   ```

**Output:**
- Database schema created
- Real service implemented
- Third-party integrations configured
- API tests passing

---

### **Stage 5: Integration** (4-6 hours)

**Lead:** Backend Developer + Frontend Developer + QA Engineer

**Tasks:**

1. **Environment Configuration**
   ```bash
   # Update .env.local for staging
   NEXT_PUBLIC_MOCK_MODE=false
   NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   # ... other real service credentials
   ```

2. **Service Inventory Update**
   ```typescript
   // .claude/context/service-inventory.ts
   {
     serviceName: 'featureService',
     status: 'hybrid', // Changed from 'mock'
     mockLocation: 'services/mock/mockFeatureService.ts',
     realLocation: 'services/real/featureService.ts', // Now exists
     migrationStatus: 'completed', // Changed from 'planned'
   }
   ```

3. **Toggle Testing**
   ```bash
   # Test with mocks (should still work)
   NEXT_PUBLIC_MOCK_MODE=true npm run dev
   ✓ UI works
   ✓ Data appears
   ✓ Forms work

   # Test with real backend
   NEXT_PUBLIC_MOCK_MODE=false npm run dev
   ✓ UI works (no code changes needed!)
   ✓ Real data from database
   ✓ Real API calls
   ```

4. **Fix Discrepancies**
   ```typescript
   // Common issues to fix:
   // 1. Data format differences
   // 2. Error handling
   // 3. Loading states
   // 4. Edge cases
   // 5. Validation rules
   ```

5. **Integration Tests**
   ```typescript
   // __tests__/integration/feature.test.ts
   describe('Feature Integration', () => {
     it('should work with mock services', async () => {
       await setMockMode(true);
       // Test flow
     });

     it('should work with real services', async () => {
       await setMockMode(false);
       // Test flow
     });
   });
   ```

6. **Performance Validation**
   ```bash
   # Check response times
   Mock: ~100-500ms ✓
   Real: ~200-1000ms ✓

   # Check bundle size
   No significant increase ✓
   ```

**Output:**
- Real backend integrated
- Both modes tested
- Performance validated
- No UI code changes needed

---

### **Stage 6: Quality Assurance** (4-6 hours)

**Lead:** QA Engineer

**Tasks:**

1. **Unit Tests (Mock Mode)**
   ```typescript
   describe('Component Tests', () => {
     beforeEach(() => {
       process.env.NEXT_PUBLIC_MOCK_MODE = 'true';
     });

     it('should render correctly', () => {
       // Fast tests using mocks
     });
   });
   ```

2. **Integration Tests (Real Mode)**
   ```typescript
   describe('API Integration Tests', () => {
     beforeEach(() => {
       process.env.NEXT_PUBLIC_MOCK_MODE = 'false';
     });

     it('should interact with database', async () => {
       // Real database tests
     });
   });
   ```

3. **E2E Tests (Both Modes)**
   ```typescript
   describe('E2E: Feature Flow', () => {
     it('works with mocks (fast)', async () => {
       await setMockMode(true);
       // Complete user journey
     });

     it('works with real backend (slow)', async () => {
       await setMockMode(false);
       // Complete user journey
     });
   });
   ```

4. **Error Scenario Testing**
   ```bash
   # Use mock error simulation
   NEXT_PUBLIC_MOCK_ERROR_RATE=25 npm run dev

   ✓ Error messages display correctly
   ✓ Retry logic works
   ✓ Loading states show
   ```

5. **Security Review**
   ```yaml
   - [ ] RLS policies configured
   - [ ] Auth checks in place
   - [ ] Input validation working
   - [ ] XSS prevention
   - [ ] SQL injection prevention
   - [ ] CORS configured
   ```

6. **Performance Testing**
   ```bash
   # Load testing
   - Mock mode: Handle 1000 req/sec ✓
   - Real mode: Handle 100 req/sec ✓

   # Memory usage
   - No memory leaks ✓
   - Proper cleanup ✓
   ```

**Output:**
- Test suite complete
- Both modes validated
- Security verified
- Performance acceptable

---

### **Stage 7: Deployment** (2-3 hours)

**Lead:** DevOps Agent

**Tasks:**

1. **Staging Deployment**
   ```bash
   # Deploy to staging with real backend
   git push staging

   # Configure environment
   NEXT_PUBLIC_MOCK_MODE=false
   # ... all production credentials
   ```

2. **Smoke Tests**
   ```bash
   ✓ Homepage loads
   ✓ Authentication works
   ✓ Feature functionality works
   ✓ Database connections stable
   ✓ Third-party APIs responding
   ```

3. **Production Deployment**
   ```bash
   # Merge to main
   git checkout main
   git merge feature-branch

   # Deploy to production
   git push production

   # Verify deployment
   ✓ App deployed
   ✓ Environment variables set
   ✓ Database migrations run
   ✓ Services healthy
   ```

4. **Monitoring Setup**
   ```typescript
   // Ensure error tracking is enabled
   Sentry: ✓ Configured
   Logs: ✓ Streaming
   Analytics: ✓ Tracking
   Alerts: ✓ Configured
   ```

5. **Keep Mocks for Testing**
   ```bash
   # Mocks remain in codebase
   services/mock/ ✓ Retained

   # Used for:
   - Unit tests (fast)
   - Development
   - Demos
   - Onboarding
   ```

**Output:**
- Feature deployed to production
- MOCK_MODE=false
- Monitoring active
- Mocks retained for testing

---

## 🎯 Success Criteria

Feature is complete when:

- ✅ Works with MOCK_MODE=true (mocks)
- ✅ Works with MOCK_MODE=false (real backend)
- ✅ No code changes needed between modes
- ✅ All tests passing (unit, integration, E2E)
- ✅ Performance acceptable
- ✅ Security validated
- ✅ Deployed to production
- ✅ Monitoring in place

---

## 📊 Timeline Example

**Feature:** User Registration (Phone + OTP)

```
Day 1 (6 hours):
  Morning:
    - Planning & design (2h)
    - Create mockAuthService (1h)
    - Create mockUserService (1h)

  Afternoon:
    - Build registration UI (2h)
    - Test complete flow with mocks ✓

Day 2 (8 hours):
  Morning (Parallel):
    - Frontend: Polish UI (2h)
    - Backend: Set up Supabase Auth (2h)

  Afternoon (Parallel):
    - Frontend: Add validations (2h)
    - Backend: Implement authService (2h)
    - Database: Create users table (2h)

Day 3 (6 hours):
  Morning:
    - Switch MOCK_MODE=false (1h)
    - Integration testing (2h)

  Afternoon:
    - Fix issues (2h)
    - QA testing (1h)

Day 4 (4 hours):
  Morning:
    - Deploy to staging (1h)
    - Smoke tests (1h)

  Afternoon:
    - Deploy to production (1h)
    - Monitoring (1h)

Total: 24 hours (3 days)
```

---

## 🔧 Tools & Commands

```bash
# Start development with mocks
npm run dev:mock

# Start development with real backend
npm run dev:real

# Run tests with mocks (fast)
npm run test:unit

# Run tests with real backend (slow)
npm run test:integration

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Check service status
npm run services:status

# Check migration progress
npm run migration:status
```

---

## 📝 Agent Coordination

| Stage | Primary Agent | Supporting Agents | Output |
|-------|---------------|-------------------|--------|
| Planning | Product Architect | System Architect | Feature plan |
| Mock Implementation | System Architect | Frontend Developer | Mock services |
| UI Development | Frontend Developer | - | Complete UI |
| Backend Implementation | Backend Developer | Database Engineer | Real services |
| Integration | Backend Developer | Frontend Developer, QA | Integrated system |
| QA | QA Engineer | - | Test reports |
| Deployment | DevOps Agent | - | Live feature |

---

## ✅ Checklist

Before starting:
- [ ] Context discovered (.claude/context/*)
- [ ] Service inventory reviewed
- [ ] Mock-first decision made
- [ ] Interfaces defined
- [ ] Timeline created

During development:
- [ ] Mocks implemented first
- [ ] UI complete with mocks
- [ ] Stakeholder demo done
- [ ] Backend implemented
- [ ] Integration tested

Before deployment:
- [ ] Both modes tested
- [ ] Security validated
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Monitoring configured

After deployment:
- [ ] Production verified
- [ ] Mocks retained
- [ ] Context updated
- [ ] Metrics tracked

---

**Related Documents:**
- Context Discovery: `.claude/skills/development/context-discovery.md`
- Planning Workflow: `.claude/skills/development/mock-first-planning-workflow.md`
- Mock-First Skill: `.claude/skills/development/mock-first-development.md`

**Last Updated:** 2025-11-18
