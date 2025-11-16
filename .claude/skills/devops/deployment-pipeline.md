# 🚀 Deployment Pipeline Skill

**Category:** DevOps
**Purpose:** Set up CI/CD with GitHub Actions for automated testing and deployment

---

## 🎯 What This Skill Does

Automates the entire deployment process:
- Run tests on every commit
- Type checking and linting
- Deploy to Vercel on merge to main
- Preview deployments for PRs
- Database migration checks

---

## 📝 Implementation

```yaml
# .github/workflows/ci-cd.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  # Job 1: Lint and Type Check
  quality-checks:
    name: Code Quality Checks
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: TypeScript type check
        run: npm run type-check

  # Job 2: Run Tests
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: quality-checks

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # Job 3: Build
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [quality-checks, test]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  # Job 4: Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [quality-checks, test, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

      - name: Post deployment notification
        run: |
          echo "Deployed to production successfully!"
```

---

## ✅ Pipeline Checklist

- [ ] GitHub Actions workflow created
- [ ] Lint step configured
- [ ] Type check step configured
- [ ] Test step configured
- [ ] Build step configured
- [ ] Deployment step configured
- [ ] Environment secrets added to GitHub
- [ ] Notifications configured (optional)
- [ ] Branch protection rules set
- [ ] Tested with a PR

---

## 🔐 Required GitHub Secrets

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
CRON_SECRET
```

---

**Used By:** devops-agent
