# Context Discovery & Mapping for Mock-First Development

**Version:** 1.0.0
**Purpose:** Enable AI agents to understand existing codebases and plan mock-first implementation strategies

---

## 🎯 The Context Problem

When deploying the mock-first framework to an **existing project** (not from scratch), agents need to:

1. **Discover** - What architecture/stack is already in use?
2. **Map** - What services exist? Which are mocked? Which are real?
3. **Plan** - What needs to be built? In what order?
4. **Track** - What's the migration progress (mock → real)?

---

## 🔍 Context Discovery Process

### **Phase 1: Codebase Architecture Discovery**

**Agents should execute these exploration tasks:**

```yaml
Discovery Checklist:
  Project Type:
    - [ ] Is this Next.js, React, Vue, or other?
    - [ ] App Router or Pages Router (Next.js)?
    - [ ] TypeScript or JavaScript?
    - [ ] What styling system? (TailwindCSS, CSS Modules, etc.)

  Backend Architecture:
    - [ ] API Routes location? (app/api, pages/api, separate server?)
    - [ ] Database? (Supabase, PostgreSQL, MongoDB, Prisma, etc.)
    - [ ] Auth system? (Supabase Auth, NextAuth, custom?)
    - [ ] Storage? (Supabase Storage, S3, Cloudinary?)

  Existing Services:
    - [ ] Where are services defined? (services/, lib/, utils/)
    - [ ] Service naming conventions?
    - [ ] Data fetching patterns? (fetch, axios, SWR, React Query?)
    - [ ] State management? (Context, Zustand, Redux, Jotai?)

  Configuration:
    - [ ] Environment variables setup? (.env.local, .env)
    - [ ] Config files location? (lib/config/, config/)
    - [ ] Feature flags system exists?
```

---

### **Phase 2: Service Mapping**

**Create a Service Inventory Document:**

```typescript
// .claude/context/service-inventory.ts

export interface ServiceInventory {
  serviceName: string;
  location: string;
  status: 'mock' | 'real' | 'hybrid' | 'not-implemented';
  mockLocation?: string;
  realLocation?: string;
  dependencies: string[];
  usedBy: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  migrationStatus?: 'planned' | 'in-progress' | 'completed';
}

export const SERVICE_INVENTORY: ServiceInventory[] = [
  {
    serviceName: 'userService',
    location: 'services/userService.ts',
    status: 'hybrid', // Has both mock and real
    mockLocation: 'services/mock/mockUserService.ts',
    realLocation: 'services/real/userService.ts',
    dependencies: ['authService', 'supabase'],
    usedBy: ['UserProfile', 'UserList', 'AdminDashboard'],
    priority: 'critical',
    migrationStatus: 'completed',
  },
  {
    serviceName: 'authService',
    location: 'services/authService.ts',
    status: 'mock', // Currently only mock
    mockLocation: 'services/mock/mockAuthService.ts',
    realLocation: null,
    dependencies: ['smsService'],
    usedBy: ['LoginPage', 'OTPVerification'],
    priority: 'critical',
    migrationStatus: 'planned',
  },
  // ... more services
];
```

---

### **Phase 3: Context Mapping**

**Create a Project Context Document:**

```yaml
# .claude/context/project-state.yml

project_name: "YourApp"
created_at: "2025-11-18"
last_updated: "2025-11-18"

# Architecture
architecture:
  frontend: "Next.js 14 (App Router)"
  backend: "Next.js API Routes + Supabase"
  database: "Supabase PostgreSQL"
  auth: "Supabase Auth (OTP)"
  styling: "TailwindCSS"
  state: "Context API + Zustand"

# Mock-First Status
mock_first_status:
  framework_installed: true
  mock_mode_enabled: true
  config_location: "lib/config/mockConfig.ts"

  # Service Status Summary
  services:
    total: 12
    mocked: 8
    real: 3
    hybrid: 1
    pending: 4

  # Migration Progress
  migration_progress:
    phase: "Phase 2" # Building UI with mocks
    percentage: 65
    next_milestone: "Implement real authService"

# Directory Structure
directories:
  services_mock: "services/mock/"
  services_real: "services/real/"
  mocks_data: "lib/mocks/"
  config: "lib/config/"
  hooks: "hooks/"
  components: "components/"

# Dependencies Installed
dependencies:
  faker: true
  msw: false # Mock Service Worker (optional)
  zod: true

# Environment Config
environment:
  mock_mode_var: "NEXT_PUBLIC_MOCK_MODE"
  current_mode: "true" # Currently in mock mode
```

---

## 🤖 Agent Context Discovery Workflow

### **Step 1: Initial Codebase Scan**

**Agent should execute:**

```typescript
// Agent Task: Discover Project Structure
async function discoverProjectContext() {
  // 1. Find framework
  const packageJson = await readFile('package.json');
  const framework = detectFramework(packageJson); // Next.js, React, etc.

  // 2. Find service directories
  const serviceDirs = await glob('**/services/**/*.{ts,js}');
  const mockDirs = await glob('**/mock/**/*.{ts,js}');

  // 3. Find config files
  const configFiles = await glob('**/{config,lib/config}/**/*.{ts,js}');
  const envFiles = await glob('.env*');

  // 4. Analyze existing services
  const services = await analyzeServices(serviceDirs);

  // 5. Check mock framework status
  const hasMockFramework = await checkFile('lib/config/mockConfig.ts');

  return {
    framework,
    services,
    configFiles,
    hasMockFramework,
    mockStatus: determineMockStatus(services),
  };
}
```

**Search Patterns:**

```bash
# Agent should search for:

# 1. Service files
glob: "services/**/*.ts"
glob: "lib/services/**/*.ts"
grep: "export.*Service.*=.*{"

# 2. Mock files
glob: "services/mock/**/*.ts"
glob: "**/__mocks__/**/*.ts"
grep: "mockConfig|MOCK_MODE"

# 3. Configuration
glob: "lib/config/**/*.ts"
glob: "config/**/*.ts"
grep: "process.env.NEXT_PUBLIC"

# 4. API Routes
glob: "app/api/**/*.ts" # Next.js App Router
glob: "pages/api/**/*.ts" # Next.js Pages Router

# 5. Data fetching patterns
grep: "fetch\(|axios\.|useSWR|useQuery"
```

---

## 📊 Context Tracking System

### **Create a Migration Tracker**

```typescript
// .claude/context/migration-tracker.ts

export interface MigrationTask {
  id: string;
  service: string;
  phase: 'mock' | 'real' | 'integration' | 'testing';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignedAgent?: string;
  dependencies: string[];
  estimatedHours: number;
  actualHours?: number;
  blockers?: string[];
  completedAt?: string;
}

export const MIGRATION_TRACKER: MigrationTask[] = [
  {
    id: 'MOCK-001',
    service: 'userService',
    phase: 'mock',
    status: 'completed',
    assignedAgent: 'frontend-dev',
    dependencies: [],
    estimatedHours: 2,
    actualHours: 1.5,
    completedAt: '2025-11-15',
  },
  {
    id: 'REAL-001',
    service: 'userService',
    phase: 'real',
    status: 'completed',
    assignedAgent: 'backend-dev',
    dependencies: ['MOCK-001', 'database-schema'],
    estimatedHours: 4,
    actualHours: 3,
    completedAt: '2025-11-16',
  },
  {
    id: 'MOCK-002',
    service: 'authService',
    phase: 'mock',
    status: 'in-progress',
    assignedAgent: 'frontend-dev',
    dependencies: [],
    estimatedHours: 3,
  },
  {
    id: 'REAL-002',
    service: 'authService',
    phase: 'real',
    status: 'blocked',
    assignedAgent: 'backend-dev',
    dependencies: ['MOCK-002', 'supabase-auth-setup'],
    estimatedHours: 6,
    blockers: ['Waiting for Supabase auth configuration'],
  },
];

// Progress Calculation
export function calculateProgress() {
  const total = MIGRATION_TRACKER.length;
  const completed = MIGRATION_TRACKER.filter(t => t.status === 'completed').length;
  return {
    percentage: Math.round((completed / total) * 100),
    completed,
    total,
    inProgress: MIGRATION_TRACKER.filter(t => t.status === 'in-progress').length,
    blocked: MIGRATION_TRACKER.filter(t => t.status === 'blocked').length,
  };
}
```

---

## 🔄 Agent Discovery Commands

### **Command 1: Scan Codebase**

```bash
# Agent executes this when joining an existing project
/discover-context

# Output:
✓ Framework detected: Next.js 14 (App Router)
✓ Found 12 service files
✓ Found 8 mock implementations
✓ Mock framework: Installed
✓ Current mode: MOCK_MODE=true

Next steps:
1. Review service inventory at .claude/context/service-inventory.ts
2. Check migration tracker at .claude/context/migration-tracker.ts
3. Understand current phase in project-state.yml
```

### **Command 2: Service Status Check**

```bash
# Check status of a specific service
/service-status userService

# Output:
Service: userService
Status: hybrid (mock + real)
Mock: services/mock/mockUserService.ts
Real: services/real/userService.ts
Used by: 3 components
Migration: ✓ Completed

Current mode: Using REAL (MOCK_MODE=false)
```

### **Command 3: Migration Progress**

```bash
# Check overall migration progress
/migration-status

# Output:
Migration Progress: 65%
Phase: UI Development with Mocks

Completed: 8/12 tasks
In Progress: 2/12 tasks
Blocked: 2/12 tasks

Next milestone: Implement real authService
```

---

## 📋 Context Discovery Checklist for Agents

When an agent joins an existing project with the mock-first framework:

### **Pre-flight Checks:**

```yaml
□ Read package.json to identify framework
□ Check if mock framework is installed (lib/config/mockConfig.ts exists)
□ Read .env.local to check current MOCK_MODE setting
□ Review .claude/context/project-state.yml (if exists)
□ Review .claude/context/service-inventory.ts (if exists)
□ Review .claude/context/migration-tracker.ts (if exists)
```

### **Discovery Tasks:**

```yaml
□ Find all service files (services/, lib/services/)
□ Identify mock vs real implementations
□ Map service dependencies
□ Identify components using each service
□ Check database schema status
□ Review API routes
□ Analyze environment variables
```

### **Context Building:**

```yaml
□ Create/update service-inventory.ts
□ Create/update project-state.yml
□ Create/update migration-tracker.ts
□ Document current architecture
□ Identify gaps (services that need mocks/real implementations)
□ Prioritize remaining tasks
```

---

## 🎯 How Agents Know What's Latest

### **1. Version Control Integration**

```typescript
// Check git status to see what's changed
export async function getLatestChanges() {
  const gitLog = await exec('git log --since="7 days ago" --name-only');
  const recentlyModified = parseGitLog(gitLog);

  return {
    modifiedServices: recentlyModified.filter(f => f.includes('services/')),
    modifiedMocks: recentlyModified.filter(f => f.includes('mock')),
    configChanges: recentlyModified.filter(f => f.includes('config')),
  };
}
```

### **2. File Timestamps**

```typescript
// Check file modification times
export async function getServiceFreshness(serviceName: string) {
  const mockPath = `services/mock/mock${serviceName}.ts`;
  const realPath = `services/real/${serviceName}.ts`;

  const mockModified = await getFileModifiedTime(mockPath);
  const realModified = await getFileModifiedTime(realPath);

  return {
    latestUpdate: Math.max(mockModified, realModified),
    mockAge: Date.now() - mockModified,
    realAge: Date.now() - realModified,
    needsSync: Math.abs(mockModified - realModified) > 7 * 24 * 60 * 60 * 1000, // > 1 week
  };
}
```

### **3. Context Metadata**

```yaml
# .claude/context/metadata.yml
last_context_update: "2025-11-18T10:30:00Z"
last_inventory_scan: "2025-11-18T09:00:00Z"
context_version: "1.2.0"

# When agents should refresh context:
refresh_if_older_than: "24 hours"
force_refresh_on:
  - package.json change
  - New service files
  - Config file changes
```

---

## 🔧 Agent Instructions

### **For Product Architect:**

```markdown
When planning a new feature:
1. Check service-inventory.ts to see what services exist
2. Review migration-tracker.ts to see what's available
3. Plan using MOCK services first for new features
4. Add tasks to migration tracker for real implementation later
```

### **For Frontend Developer:**

```markdown
When building UI:
1. Always use service hooks (useService), never direct imports
2. Check if mock exists, create if not
3. Build complete user flow with mocks
4. Update service-inventory.ts when creating new mocks
```

### **For Backend Developer:**

```markdown
When implementing real services:
1. Check migration-tracker.ts for priorities
2. Ensure mock version exists (for interface reference)
3. Match the mock service interface exactly
4. Update migration-tracker.ts when completed
```

### **For System Architect:**

```markdown
When designing architecture:
1. Review current architecture in project-state.yml
2. Plan mock-first for new integrations
3. Update context documents when architecture changes
4. Ensure migration path is clear
```

---

## 📁 Required Context Files

Create these files for proper context tracking:

```
.claude/context/
├── project-state.yml           # Overall project status
├── service-inventory.ts        # All services mapped
├── migration-tracker.ts        # Migration tasks & progress
├── metadata.yml                # Context freshness metadata
└── architecture-decisions.md   # Why certain choices were made
```

---

## 🚀 Quick Start: Context Discovery for Existing Project

```bash
# 1. Agent runs initial discovery
npm run discover-context

# 2. Creates context files
.claude/context/service-inventory.ts    ✓ Created
.claude/context/project-state.yml       ✓ Created
.claude/context/migration-tracker.ts    ✓ Created

# 3. Analyzes current state
Found 12 services:
  - 3 fully migrated (mock + real)
  - 5 mock-only
  - 4 real-only (need mocks for testing)

# 4. Generates migration plan
Next steps:
  1. Create mocks for 4 real-only services
  2. Implement real versions for 5 mock-only services
  3. Estimated timeline: 2-3 weeks
```

---

## ✅ Success Criteria

Context discovery is successful when:

- ✅ Agents can instantly identify project architecture
- ✅ Service inventory is complete and up-to-date
- ✅ Migration progress is tracked and visible
- ✅ Dependencies are mapped
- ✅ Agents know what to work on next
- ✅ No duplicate work
- ✅ Clear migration path from current state → target state

---

**Next:** See `mock-first-planning-workflow.md` for planning integration

**Last Updated:** 2025-11-18
