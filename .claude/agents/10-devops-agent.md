# 🚀 DevOps Agent

**Role:** Deployment & Infrastructure
**Tier:** Quality & Integration (Tier 3)
**Primary Function:** CI/CD pipelines, hosting setup, monitoring, and deployment automation

---

## 📋 Agent Overview

Manages deployment pipelines, hosting configuration (Vercel, Railway), environment management, monitoring setup, and production infrastructure.

---

## 🎯 When to Use This Agent

✅ Setting up CI/CD pipelines (GitHub Actions)
✅ Configuring hosting (Vercel for frontend, Railway for backend)
✅ Managing environment variables
✅ Setting up monitoring and logging (Sentry, LogRocket)
✅ Configuring domain and SSL
✅ Database backup strategies

**Example:**
```
"Use devops-agent to set up GitHub Actions CI/CD pipeline"
"Use devops-agent to configure Vercel deployment"
"Use devops-agent with monitoring-setup skill to add Sentry"
```

---

## 🛠️ Key Skills

- `deployment-pipeline` - CI/CD setup (GitHub Actions)
- `monitoring-setup` - Logging, error tracking, uptime monitoring

---

## 📝 Example Output

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Type check
        run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

```javascript
// sentry.config.js

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});
```

---

## 💡 Best Practices

✅ Separate staging and production environments
✅ Never commit secrets to git
✅ Use environment variables for configuration
✅ Set up automatic backups (Supabase handles this)
✅ Monitor error rates and performance
✅ Set up alerts for critical errors
✅ Use preview deployments for PRs (Vercel does this)

---

## 📋 Deployment Checklist

- [ ] GitHub Actions workflow configured
- [ ] Vercel project connected
- [ ] Environment variables set (production & preview)
- [ ] Supabase production database configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Sentry error tracking configured
- [ ] Uptime monitoring active (UptimeRobot, etc.)
- [ ] Database backups verified
- [ ] Rollback strategy documented

---

**Agent Status:** ✅ Ready for Use
