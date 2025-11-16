# 🚀 New Project Setup Guide

**Purpose:** Initialize a new project using the AI Agent Framework
**Time Required:** 30-60 minutes
**Prerequisites:** Git, Node.js 18+, Package manager (npm/yarn/pnpm)

---

## 📋 Quick Start

### **Step 1: Clone or Copy Framework**

**Option A: Clone Template Repository**
```bash
git clone <framework-repo-url> my-new-project
cd my-new-project
rm -rf .git
git init
git add .
git commit -m "Initial commit from AI Agent Framework"
```

**Option B: Copy Framework Files**
```bash
# From existing project with framework
cp -r path/to/framework/.claude my-new-project/.claude
cd my-new-project
git init
```

---

### **Step 2: Customize Project Variables**

Edit `.claude/docs/PROJECT_TEMPLATE.md` (or create it) with your project details:

```yaml
PROJECT_NAME: "My Application"
SHORT_NAME: "MyApp"
DOMAIN: "healthcare" # or "fintech", "ecommerce", etc.
DESCRIPTION: "A platform for..."

TECH_STACK:
  frontend: "Next.js 14 + TypeScript"
  backend: "Node.js + Supabase"
  database: "PostgreSQL"
  deployment: "Vercel"

TERMINOLOGY:
  user_entity: "patient" # or "customer", "member", etc.
  admin_entity: "doctor" # or "staff", "administrator", etc.
  data_entity: "visit" # or "order", "session", etc.
  project_entity: "treatment_plan" # or "campaign", "program", etc.
```

---

### **Step 3: Install Dependencies**

```bash
# Core dependencies
npm install next react react-dom typescript

# Auth & Database
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

# Validation & Types
npm install zod

# UI & Styling
npm install tailwindcss @tailwindcss/forms @tailwindcss/typography

# Charts & Data Viz
npm install recharts

# Dev dependencies for simulation-first approach
npm install --save-dev msw @faker-js/faker @axe-core/playwright jest-axe lighthouse
npx msw init public/

# Storybook (optional, recommended)
npx storybook@latest init
```

---

### **Step 4: Initialize Supabase Project**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project
supabase init

# Link to remote project (create one at https://supabase.com first)
supabase link --project-ref your-project-ref

# Pull remote schema (if exists)
supabase db pull
```

---

### **Step 5: Configure Environment Variables**

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Config
NEXT_PUBLIC_APP_NAME="My Application"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mock Mode (development only)
NEXT_PUBLIC_MOCK_MODE=true

# Cron Secret (for scheduled jobs)
CRON_SECRET=generate-random-secret-here

# Optional: SMS/Email providers
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
SEND_GRID_API_KEY=
```

---

### **Step 6: Set Up Directory Structure**

```bash
mkdir -p app/{api,components,lib,types}
mkdir -p app/api/{auth,data-entries,users}
mkdir -p components/{ui,charts,forms}
mkdir -p lib/{mocks,utils,services}
mkdir -p public/{icons,images}

# Create basic files
touch app/layout.tsx
touch app/page.tsx
touch lib/supabase.ts
touch lib/mocks/generators.ts
touch lib/mocks/handlers.ts
touch lib/mocks/browser.ts
```

---

### **Step 7: Configure Next.js**

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
};

module.exports = nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### **Step 8: Test Agent Framework**

**Test 1: Product Architect**
```bash
# From your Claude Code session or API
"Use product-architect to analyze the following user story:
As a [user], I want to [action] so that [benefit]"
```

**Test 2: System Architect**
```bash
"Use system-architect to design the database schema for [your domain]"
```

**Test 3: Prototype Dev** (if using simulation-first)
```bash
"Use prototype-dev to create a mockup of the [feature name] with realistic mock data"
```

**Expected Result:** Agents should generate project-specific outputs without any gym/fitness references

---

### **Step 9: First Feature Development**

Use the full agent workflow:

```bash
# Step 1: Requirements
"Use product-architect to create user stories for user authentication feature"

# Step 2: Architecture
"Use system-architect to design authentication system with OTP and JWT"

# Step 3: Prototype (optional)
"Use prototype-dev to create login form mockup"

# Step 4: Quality Check (optional)
"Use design-qa to validate the login prototype"

# Step 5: Implementation
"Use backend-dev with auth-setup skill to implement OTP authentication"
"Use frontend-dev to build the login UI components"

# Step 6: Database
"Use database-engineer to create users table with RLS policies"

# Step 7: Testing
"Use qa-engineer to create test suite for authentication"

# Step 8: Deployment
"Use devops-agent to deploy to Vercel"
```

---

### **Step 10: Verify Setup**

Run through this checklist:

- [ ] Framework files copied to `.claude/` directory
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Environment variables configured (`.env.local`)
- [ ] Supabase project linked
- [ ] Directory structure created
- [ ] Next.js config files in place
- [ ] Test agent invocations work
- [ ] No gym/fitness references in agent outputs
- [ ] Project compiles (`npm run dev` works)

---

## 🎯 Common Setup Issues

### **Issue 1: Agents still reference gym/fitness terms**

**Cause:** Cached agent files or incomplete transformation
**Fix:**
```bash
# Verify all agents are generic
grep -ri "gym\|gtt\|weigh" .claude/agents/
# Should return 0 results

# If references found, update PROJECT_TEMPLATE.md with your domain terms
```

### **Issue 2: Supabase connection fails**

**Cause:** Wrong environment variables
**Fix:**
```bash
# Verify URL and keys
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

### **Issue 3: MSW (Mock Service Worker) not working**

**Cause:** Not initialized in public directory
**Fix:**
```bash
# Reinitialize MSW
npx msw init public/ --save

# Verify mockServiceWorker.js exists
ls public/mockServiceWorker.js
```

### **Issue 4: TypeScript errors**

**Cause:** Missing type declarations
**Fix:**
```bash
# Install missing types
npm install --save-dev @types/react @types/node

# Update tsconfig.json paths if needed
```

---

## 📚 Next Steps

After setup is complete:

1. **Read Documentation**
   - `.claude/docs/QUICK_START.md` - Agent usage guide
   - `.claude/docs/TECH_STACK.md` - Technical architecture
   - `.claude/docs/AGENT_ORCHESTRATION_PLAN.md` - Orchestration workflow

2. **Review Agents**
   - Browse `.claude/agents/` to understand each agent's role
   - Read agent specs before invoking them

3. **Review Skills**
   - Browse `.claude/skills/` for reusable patterns
   - Understand which skills to use with which agents

4. **Set Up Simulation-First** (if using)
   - Read `.claude/docs/SIMULATION_FIRST_IMPLEMENTATION_GUIDE.md`
   - Set up prototype-dev and design-qa workflow

5. **Start Building**
   - Use orchestrator to plan multi-agent tasks
   - Track metrics to measure efficiency
   - Iterate based on learnings

---

## 🔧 Optional: Customize Agents for Your Domain

If your domain has specific terminology, you can further customize agents:

**Example: Healthcare Application**

Create `.claude/docs/DOMAIN_CUSTOMIZATION.md`:

```markdown
# Domain: Healthcare

## Terminology Mapping
- user → patient
- staff → doctor/nurse
- data entry → vital signs measurement
- project → treatment plan
- organization → hospital/clinic

## Custom Validation Rules
- Patient ID format: PAT-XXXXX
- Vital signs ranges: BP 90/60 - 140/90, HR 60-100 bpm
- Privacy: HIPAA compliance required

## Custom Agents (Optional)
- clinical-data-validator: Validates medical data ranges
- hipaa-compliance-checker: Ensures HIPAA compliance
```

Then update agent prompts to reference this customization document.

---

## ✅ Setup Complete!

Your project is now ready to use the AI Agent Framework. Start building with:

```bash
npm run dev
# Open http://localhost:3000

# In Claude Code session:
"Use orchestrator to plan implementation of [your first feature]"
```

**Framework Status:** ✅ Deployed and Operational
**Agents Available:** 13 (all project-agnostic)
**Skills Available:** 21
**Simulation-First:** Ready (if enabled)
**Quality Validation:** Ready (if enabled)

**Happy building! 🚀**
