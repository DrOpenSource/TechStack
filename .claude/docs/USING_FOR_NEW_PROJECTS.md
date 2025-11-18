# Using TechStack Framework for New Projects

**Purpose:** Step-by-step guide to apply the TechStack framework to a new, blank repository

---

## 🎯 What is TechStack?

TechStack is **not an application** - it's a **development framework** containing:
- AI agent definitions (8 specialized agents)
- Reusable skills (21 skills)
- Development workflows
- Mock-first development system
- Best practices and templates

Think of it as a **blueprint** for building applications with AI-driven development.

---

## 🚀 Quick Start: New Project Setup

### **Option 1: Fork & Adapt (Recommended for similar projects)**

```bash
# 1. Fork or clone TechStack
git clone https://github.com/DrOpenSource/TechStack.git my-new-project
cd my-new-project

# 2. Remove TechStack git history (start fresh)
rm -rf .git
git init
git add .
git commit -m "Initial commit with TechStack framework"

# 3. Connect to your new repo
git remote add origin https://github.com/your-username/my-new-project.git
git push -u origin main

# 4. Customize for your project
# (See customization section below)
```

---

### **Option 2: Selective Import (Recommended for different tech stacks)**

```bash
# 1. Create your new project
mkdir my-new-project
cd my-new-project
git init

# 2. Copy only what you need from TechStack
# From TechStack repo:

# Copy agent definitions
cp -r /path/to/TechStack/.claude/agents .claude/agents

# Copy skills you'll use
cp -r /path/to/TechStack/.claude/skills .claude/skills

# Copy workflows
cp -r /path/to/TechStack/.claude/workflows .claude/workflows

# Copy docs (optional)
cp -r /path/to/TechStack/.claude/docs .claude/docs

# 3. Initialize your actual application
# (Next.js, React, or whatever you're building)
npx create-next-app@latest .
# or
npm create vite@latest .

# 4. Commit
git add .
git commit -m "Initial project with TechStack framework"
```

---

### **Option 3: Hybrid (Use as Reference)**

```bash
# 1. Create your new project normally
npx create-next-app@latest my-new-project
cd my-new-project

# 2. Create .claude directory
mkdir -p .claude/{agents,skills,workflows,docs,context}

# 3. Copy specific skills/agents you need
# Example: Copy mock-first development skill
cp /path/to/TechStack/.claude/skills/development/* .claude/skills/development/

# 4. Reference TechStack documentation as needed
# Keep TechStack repo open in another window for reference
```

---

## 📋 Step-by-Step: Complete New Project Setup

### **Step 1: Initialize Project Structure** (30 minutes)

```bash
# 1. Create project directory
mkdir my-app
cd my-app

# 2. Initialize git
git init

# 3. Create .claude framework directory
mkdir -p .claude/{agents,skills,workflows,docs,context}

# 4. Copy TechStack framework files
# (Choose what's relevant to your project)

# Essential files to copy:
cp /path/to/TechStack/.claude/agents/*.md .claude/agents/
cp -r /path/to/TechStack/.claude/skills/development .claude/skills/
cp /path/to/TechStack/.claude/workflows/* .claude/workflows/

# 5. Initialize your application
# Choose your tech stack:

# Next.js (recommended - matches TechStack docs):
npx create-next-app@latest . --typescript --tailwind --app

# Or React + Vite:
npm create vite@latest . -- --template react-ts

# Or other framework:
# (You'll need to adapt TechStack docs accordingly)
```

---

### **Step 2: Customize for Your Project** (1 hour)

**A. Update Tech Stack Documentation**

```bash
# Edit .claude/docs/TECH_STACK.md
code .claude/docs/TECH_STACK.md
```

Replace with YOUR tech stack decisions:

```yaml
# .claude/docs/TECH_STACK.md

# My App Tech Stack

## Frontend
Framework: Next.js 15 (or whatever you chose)
Language: TypeScript
Styling: TailwindCSS
State: Zustand
Forms: React Hook Form + Zod

## Backend
Platform: Next.js API Routes
Database: Supabase / PostgreSQL / MongoDB (choose)
Auth: NextAuth / Supabase Auth / Clerk (choose)

## Infrastructure
Hosting: Vercel / Netlify (choose)
Database: Supabase / Railway (choose)
Storage: S3 / Cloudinary (choose)

## Development
Mock-First: Enabled
Testing: Vitest + Playwright
CI/CD: GitHub Actions
```

---

**B. Update Project Context**

```yaml
# .claude/context/project-state.yml

project_name: "MyApp"
created_at: "2025-11-18"
description: "Brief description of what your app does"

architecture:
  frontend: "Next.js 15"
  backend: "Your choice"
  database: "Your choice"
  auth: "Your choice"

mock_first_status:
  framework_installed: false  # Will set to true after setup
  mock_mode_enabled: false

directories:
  services: "services/"
  components: "components/"
  lib: "lib/"
```

---

**C. Customize Agent Instructions**

```markdown
# .claude/agents/product-architect.md

# Edit to reflect YOUR project context

## Project Context
This project is building: [YOUR APP DESCRIPTION]

Target users: [YOUR USERS]

Key features:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

## Tech Stack
[Use your TECH_STACK.md decisions]
```

Do this for each agent you'll use.

---

### **Step 3: Set Up Mock-First Development** (1 hour)

**A. Copy Mock-First Templates**

```bash
# Copy all mock-first development templates
cp -r /path/to/TechStack/.claude/skills/development/templates/* ./

# Organize them in your project:
mkdir -p lib/config lib/mocks services/mock services/real hooks components/mock

# Move files to proper locations:
mv mockConfig.ts lib/config/
mv mockUtils.ts lib/mocks/
mv sampleData.ts lib/mocks/
mv useService.ts hooks/
mv mockUserService.ts services/mock/
mv mockAuthService.ts services/mock/
mv SampleDataComponents.tsx components/mock/
mv .env.example .env.local
```

**B. Configure Environment**

```bash
# Edit .env.local
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_MOCK_DELAY=800
NEXT_PUBLIC_MOCK_ERROR_RATE=0

# For when you're ready for real backend:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**C. Install Dependencies**

```bash
# Install required packages
npm install @faker-js/faker zod

# Optional but recommended:
npm install -D vitest @testing-library/react
```

---

### **Step 4: Create Your First Feature** (2 hours)

**Follow the mock-first workflow:**

```yaml
# Example: User Profile Feature

Step 1: Define Service Interface
  File: services/types/UserService.ts

  export interface User {
    id: string;
    name: string;
    email: string;
  }

  export interface UserService {
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User | null>;
    create(data: CreateUserInput): Promise<User>;
  }

Step 2: Create Mock Service
  File: services/mock/mockUserService.ts

  import { UserService } from '../types/UserService';
  import { simulateDelay, MockDataStore } from '@/lib/mocks/mockUtils';

  const MOCK_USERS = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ];

  const store = new MockDataStore(MOCK_USERS);

  export const mockUserService: UserService = {
    async getAll() {
      await simulateDelay();
      return store.getAll();
    },
    async getById(id: string) {
      await simulateDelay();
      return store.getById(id);
    },
    async create(data) {
      await simulateDelay();
      return store.create({ ...data, id: `user-${Date.now()}` });
    },
  };

Step 3: Create Service Hook
  File: hooks/useUserService.ts

  import { createServiceHook } from '@/hooks/useService';
  import { mockUserService } from '@/services/mock/mockUserService';
  // Real service will be imported later

  export const useUserService = createServiceHook(
    mockUserService,
    mockUserService // For now, both use mock
  );

Step 4: Build UI Component
  File: components/UserList.tsx

  'use client';
  import { useUserService } from '@/hooks/useUserService';
  import { useEffect, useState } from 'react';

  export function UserList() {
    const userService = useUserService();
    const [users, setUsers] = useState([]);

    useEffect(() => {
      userService.getAll().then(setUsers);
    }, []);

    return (
      <div>
        <h1>Users</h1>
        {users.map(user => (
          <div key={user.id}>{user.name} - {user.email}</div>
        ))}
      </div>
    );
  }

Step 5: Test with Mocks
  # Start dev server
  npm run dev

  # Visit your page
  ✓ Users load from mock data
  ✓ No backend needed
  ✓ Works immediately!
```

---

### **Step 5: Plan Your Full Application** (2-3 hours)

**Use Product Architect workflow:**

```markdown
# .claude/context/application-plan.md

# MyApp Feature Roadmap

## Phase 1: Core Features (Week 1-2) - MOCK FIRST
Features:
  - User authentication (phone + OTP)
  - User profile management
  - Dashboard homepage

Services Needed (Mock):
  - authService
  - userService
  - profileService

Approach:
  - Build all UI with mocks
  - Complete user flows
  - Get stakeholder approval
  - No backend dependencies

## Phase 2: Backend Implementation (Week 2-3) - PARALLEL
Backend Tasks:
  - Set up Supabase project
  - Configure authentication
  - Create user schema
  - Implement real services

Frontend Tasks (Parallel):
  - Refine UI
  - Add animations
  - Polish components

## Phase 3: Integration (Week 3-4)
  - Switch MOCK_MODE=false
  - Integration testing
  - Bug fixes
  - Performance optimization

## Phase 4: Launch (Week 4+)
  - Deploy to production
  - Monitor metrics
  - Iterate based on feedback
```

---

## 🗂️ Recommended Project Structure

```
my-app/
├── .claude/                        # TechStack framework
│   ├── agents/                     # Copied from TechStack
│   ├── skills/                     # Copied from TechStack
│   ├── workflows/                  # Copied from TechStack
│   ├── docs/                       # Customized for your project
│   └── context/                    # Generated during development
│       ├── project-state.yml
│       ├── service-inventory.ts
│       └── migration-tracker.ts
│
├── app/                            # Next.js app directory
│   ├── api/                        # API routes
│   ├── (routes)/                   # Your pages
│   └── layout.tsx
│
├── components/                     # React components
│   ├── ui/                         # Reusable UI components
│   └── mock/                       # Mock-first components
│       └── SampleDataComponents.tsx
│
├── services/                       # Service layer
│   ├── types/                      # Service interfaces
│   ├── mock/                       # Mock implementations
│   └── real/                       # Real implementations
│
├── lib/                            # Utilities
│   ├── config/
│   │   └── mockConfig.ts
│   └── mocks/
│       ├── mockUtils.ts
│       ├── sampleData.ts
│       └── fixtures/
│
├── hooks/                          # React hooks
│   └── useService.ts
│
├── .env.local                      # Environment config
├── package.json
└── tsconfig.json
```

---

## 📚 What to Keep vs Customize

### **Keep As-Is:**
- ✅ `.claude/agents/*` - Agent definitions are generic
- ✅ `.claude/workflows/*` - Workflows are reusable
- ✅ `.claude/skills/development/*` - Mock-first framework
- ✅ Mock-first templates - Universal patterns

### **Customize:**
- 🔧 `.claude/docs/TECH_STACK.md` - Your specific tech choices
- 🔧 `.claude/docs/QUICK_START.md` - Your project setup
- 🔧 `.claude/context/*` - Generated for your project
- 🔧 Sample data (`sampleData.ts`) - Your domain data

### **Create New:**
- ➕ Your application code (app/, components/, etc.)
- ➕ Your services (services/*)
- ➕ Your schemas (lib/validations/*)
- ➕ Your tests (__tests__/*)

---

## 🎯 Example: Building a Task Manager App

**Step-by-step example:**

```bash
# 1. Initialize project
npx create-next-app@latest task-manager --typescript --tailwind --app
cd task-manager

# 2. Copy TechStack framework
mkdir -p .claude/{agents,skills,workflows,docs,context}
# Copy files from TechStack repo

# 3. Copy mock-first templates
# Set up lib/config/mockConfig.ts, lib/mocks/*, etc.

# 4. Define your domain
# File: services/types/TaskService.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

export interface TaskService {
  getAll(): Promise<Task[]>;
  create(data: CreateTaskInput): Promise<Task>;
  update(id: string, data: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
}

# 5. Create mock service
# File: services/mock/mockTaskService.ts
const MOCK_TASKS = [
  {
    id: '1',
    title: 'Build UI',
    description: 'Create task list component',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-11-20',
    createdAt: '2025-11-18T10:00:00Z',
  },
  // ... more tasks
];

export const mockTaskService: TaskService = {
  async getAll() {
    await simulateDelay();
    return MOCK_TASKS;
  },
  // ... implement other methods
};

# 6. Build UI with mocks
# File: app/tasks/page.tsx
'use client';
import { useTaskService } from '@/hooks/useTaskService';

export default function TasksPage() {
  const taskService = useTaskService(); // Auto-routes to mock
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    taskService.getAll().then(setTasks);
  }, []);

  return (
    <div>
      <h1>My Tasks</h1>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

# 7. Test immediately
npm run dev
# ✓ App works with no backend!
# ✓ Can demo to stakeholders
# ✓ Can iterate on UI quickly

# 8. Later: Build real backend
# Set up Supabase, create tasks table, implement real service

# 9. Switch to real
# .env.local: NEXT_PUBLIC_MOCK_MODE=false
# No component code changes needed!
```

---

## ✅ Checklist: New Project Setup

### **Initial Setup:**
- [ ] Clone or copy TechStack framework
- [ ] Remove TechStack git history (if forked)
- [ ] Initialize your application (Next.js, etc.)
- [ ] Copy mock-first templates
- [ ] Install dependencies (`@faker-js/faker`, `zod`)
- [ ] Configure `.env.local` with `MOCK_MODE=true`

### **Customization:**
- [ ] Update `.claude/docs/TECH_STACK.md` with your choices
- [ ] Update `.claude/context/project-state.yml`
- [ ] Customize sample data for your domain
- [ ] Update agent instructions with project context

### **First Feature:**
- [ ] Define service interface (types/)
- [ ] Create mock service (services/mock/)
- [ ] Create service hook (hooks/)
- [ ] Build UI component
- [ ] Test with mock data
- [ ] Verify complete user flow works

### **Documentation:**
- [ ] Update README.md with project info
- [ ] Document your tech stack decisions
- [ ] Create feature roadmap
- [ ] Set up development workflow

---

## 🚦 What NOT to Copy

**Don't copy these from TechStack to your new project:**

- ❌ `.git/` - TechStack's git history
- ❌ `node_modules/` - Dependencies (install fresh)
- ❌ Any application-specific code (TechStack has none, it's just framework)
- ❌ Skills you won't use (e.g., if not using Supabase, skip Supabase skills)

---

## 🎓 Learning Path

**Week 1: Setup & Learn**
1. Set up project structure
2. Copy relevant TechStack files
3. Read mock-first development docs
4. Build first feature with mocks

**Week 2: Build with Mocks**
1. Define all service interfaces
2. Create mock services
3. Build complete UI
4. Validate user flows

**Week 3: Real Implementation**
1. Set up backend (Supabase, etc.)
2. Implement real services
3. Switch to MOCK_MODE=false
4. Integration testing

**Week 4: Production**
1. Deploy to Vercel/Netlify
2. Monitor metrics
3. Iterate on feedback

---

## 💡 Pro Tips

1. **Start Simple:** Don't copy everything. Start with:
   - Mock-first development skill
   - 2-3 relevant agents
   - 1 workflow

2. **Customize Gradually:** Adapt TechStack docs as you learn your needs

3. **Keep Framework Separate:** Your `.claude/` directory is configuration, not application code

4. **Version Control:** Commit framework separately from app code

5. **Reference TechStack:** Keep the original repo for reference

---

## 🆘 Common Questions

**Q: Should I fork TechStack or start fresh?**
A: Start fresh for your app, copy .claude/ framework selectively

**Q: Do I need all 21 skills?**
A: No! Copy only what's relevant to your tech stack

**Q: Can I use this with non-Next.js projects?**
A: Yes! Adapt the tech stack docs. Core concepts (agents, mock-first) are universal

**Q: How do I keep up with TechStack updates?**
A: Periodically check TechStack repo, merge useful updates into your `.claude/` directory

---

## 📖 Further Reading

- **Mock-First Development:** `.claude/skills/development/mock-first-development.md`
- **Quick Start:** `.claude/skills/development/QUICK_START_MOCK_FIRST.md`
- **Integration Guide:** `.claude/skills/development/INTEGRATION_GUIDE.md`
- **Feature Workflow:** `.claude/workflows/feature-development-mock-first.md`

---

**Last Updated:** 2025-11-18
