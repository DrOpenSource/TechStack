# 🛠️ Tech Stack Documentation

**Project:** Gym Transformation Tracker (GTT)
**Last Updated:** 2025-11-14

---

## 📋 Overview

This document outlines all technology decisions for the GTT platform. These choices are optimized for rapid development, scalability, and cost-effectiveness for the Indian market.

---

## 🎯 Core Technologies

### **Frontend**

#### **Framework: Next.js 14 (App Router)**
```json
{
  "framework": "Next.js",
  "version": "14.x",
  "rendering": "SSR + CSR",
  "routing": "App Router"
}
```

**Why Next.js:**
- ✅ Built-in SSR for better SEO
- ✅ API routes for backend
- ✅ Excellent Vercel integration
- ✅ Image optimization
- ✅ Code splitting
- ✅ TypeScript support

**Alternatives Considered:**
- Create React App (CRA) - ❌ Less features
- Vite + React - ✅ Faster but less features
- Remix - ✅ Good but smaller ecosystem

---

#### **Language: TypeScript**
```typescript
{
  "language": "TypeScript",
  "version": "5.x",
  "strict": true
}
```

**Why TypeScript:**
- ✅ Type safety reduces bugs
- ✅ Better IDE support
- ✅ Improved refactoring
- ✅ Self-documenting code
- ✅ Catches errors at compile time

---

#### **Styling: TailwindCSS**
```json
{
  "framework": "TailwindCSS",
  "version": "3.x"
}
```

**Why Tailwind:**
- ✅ Rapid development
- ✅ Utility-first approach
- ✅ Small bundle size (purged)
- ✅ Consistent design system
- ✅ Mobile-first by default

**Alternatives Considered:**
- Styled Components - ❌ Runtime overhead
- CSS Modules - ✅ Good but verbose
- Material UI - ❌ Heavy bundle size

---

#### **State Management: React Context API + Zustand**
```typescript
{
  "primary": "Context API",
  "complex": "Zustand",
  "version": "4.x"
}
```

**Why Context API + Zustand:**
- ✅ Context API for simple state (auth, theme)
- ✅ Zustand for complex state (offline queue)
- ✅ No Redux boilerplate
- ✅ TypeScript friendly
- ✅ Small bundle size

**State Management Strategy:**
```
AuthContext → User authentication, gym context
MemberContext → Member profile, program data
OfflineContext → Offline sync queue
NotificationContext → Push notification state

Zustand Store → Complex offline sync logic
```

---

#### **Charts: Recharts**
```json
{
  "library": "Recharts",
  "version": "2.x"
}
```

**Why Recharts:**
- ✅ React-friendly API
- ✅ Responsive by default
- ✅ Good documentation
- ✅ Lightweight
- ✅ Customizable

**Alternatives Considered:**
- Chart.js - ❌ Not React-native
- Victory - ✅ Good but larger
- D3.js - ❌ Steeper learning curve

---

### **Backend**

#### **Platform: Next.js API Routes**
```typescript
{
  "platform": "Next.js API Routes",
  "runtime": "Node.js 18+",
  "type": "Serverless"
}
```

**Why Next.js API Routes:**
- ✅ Same codebase as frontend
- ✅ Serverless (scales automatically)
- ✅ Vercel integration
- ✅ TypeScript support
- ✅ Easy to deploy

---

#### **Database: Supabase (PostgreSQL)**
```json
{
  "provider": "Supabase",
  "database": "PostgreSQL 15",
  "features": [
    "Row-Level Security",
    "Realtime subscriptions",
    "Built-in Auth",
    "Storage"
  ]
}
```

**Why Supabase:**
- ✅ PostgreSQL (robust, scalable)
- ✅ Built-in authentication
- ✅ Row-Level Security (perfect for multi-tenant)
- ✅ Realtime capabilities
- ✅ Generous free tier
- ✅ Automatic backups
- ✅ Great DX (developer experience)

**Database Features Used:**
- Row-Level Security (RLS) for multi-tenant isolation
- Postgres Functions for complex queries
- Triggers for automated tasks
- Full-text search
- JSON columns for flexible data

**Alternatives Considered:**
- Firebase - ❌ NoSQL limitations
- PlanetScale - ✅ Good but less features
- Railway Postgres - ✅ Good but manual setup
- MongoDB - ❌ Not ideal for relational data

---

#### **Authentication: Supabase Auth + Custom OTP**
```typescript
{
  "provider": "Supabase Auth",
  "method": "OTP (Phone)",
  "token": "JWT"
}
```

**Why Supabase Auth:**
- ✅ Built-in OTP support
- ✅ JWT tokens
- ✅ Row-Level Security integration
- ✅ Refresh token rotation
- ✅ Session management

**Auth Flow:**
```
1. User enters phone number
2. OTP sent via SMS provider
3. User verifies OTP
4. Supabase generates JWT
5. JWT used for API authentication
6. RLS policies enforce data access
```

---

### **Hosting & Deployment**

#### **Frontend Hosting: Vercel**
```json
{
  "provider": "Vercel",
  "tier": "Pro",
  "features": [
    "Automatic deployments",
    "Preview deployments",
    "Edge network",
    "Analytics"
  ]
}
```

**Why Vercel:**
- ✅ Best Next.js support (creators of Next.js)
- ✅ Automatic deployments from Git
- ✅ Preview URLs for PRs
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Environment variables
- ✅ Excellent performance

**Pricing:**
- Free tier: Generous (good for starting)
- Pro: ₹1,600/month (recommended for production)

---

#### **Backend Hosting: Vercel Serverless + Railway (optional)**
```json
{
  "primary": "Vercel Serverless Functions",
  "alternative": "Railway (for long-running jobs)"
}
```

**Why This Combination:**
- ✅ Vercel: Great for API routes (fast, scalable)
- ✅ Railway: For cron jobs, background tasks
- ✅ Supabase Edge Functions: Alternative for serverless

**Use Cases:**
- Vercel: API endpoints, authentication
- Railway: Scheduled reminders, report generation
- Supabase Functions: Database triggers, realtime

---

### **Infrastructure**

#### **Database Hosting: Supabase Cloud**
```json
{
  "provider": "Supabase Cloud",
  "region": "Mumbai (ap-south-1)",
  "tier": "Pro"
}
```

**Why Supabase Cloud:**
- ✅ Managed PostgreSQL
- ✅ Automatic backups
- ✅ Point-in-time recovery
- ✅ Monitoring included
- ✅ Mumbai region (low latency for India)

**Pricing:**
- Free tier: 500MB database, 2GB bandwidth
- Pro: $25/month (₹2,000) - 8GB database, 50GB bandwidth

---

#### **File Storage: Supabase Storage**
```json
{
  "provider": "Supabase Storage",
  "features": ["Image uploads", "PDFs", "Member photos"]
}
```

**Why Supabase Storage:**
- ✅ Integrated with database
- ✅ RLS policies apply
- ✅ Image transformations
- ✅ CDN included

**Alternatives for Scale:**
- Cloudflare R2 - ✅ Cheaper for large files
- AWS S3 - ✅ More features but complex

---

## 🔌 Third-Party Integrations

### **SMS Providers (Multiple Options)**

#### **Option 1: Msg91 (Recommended for India)**
```json
{
  "provider": "Msg91",
  "pricing": "₹0.15/SMS",
  "features": ["OTP", "Promotional", "Transactional"]
}
```

**Why Msg91:**
- ✅ India-focused
- ✅ Reliable delivery
- ✅ Good pricing
- ✅ Easy API

---

#### **Option 2: Twilio**
```json
{
  "provider": "Twilio",
  "pricing": "$0.04/SMS (~₹3.3)",
  "features": ["Global reach", "Reliable", "Great docs"]
}
```

**Why Twilio:**
- ✅ Most reliable
- ✅ Global coverage
- ✅ Excellent documentation
- ❌ Higher cost

---

#### **Option 3: Fast2SMS**
```json
{
  "provider": "Fast2SMS",
  "pricing": "₹0.12/SMS",
  "features": ["Cheap", "India-only"]
}
```

**Why Fast2SMS:**
- ✅ Cheapest
- ✅ Good for budget
- ❌ Less reliable than others

---

### **Payment Gateway (Future)**

#### **Option 1: Razorpay (Recommended)**
```json
{
  "provider": "Razorpay",
  "fees": "2% + ₹2 per transaction",
  "features": ["UPI", "Cards", "Wallets", "Subscriptions"]
}
```

**Why Razorpay:**
- ✅ India-focused
- ✅ Easy integration
- ✅ Subscription support
- ✅ Good documentation

---

#### **Option 2: Stripe**
```json
{
  "provider": "Stripe",
  "fees": "2.9% + ₹2 per transaction",
  "features": ["International", "Great API"]
}
```

---

### **Analytics & Monitoring**

#### **Error Tracking: Sentry**
```json
{
  "provider": "Sentry",
  "tier": "Developer (Free)",
  "features": ["Error tracking", "Performance monitoring"]
}
```

**Why Sentry:**
- ✅ Best error tracking
- ✅ Source maps support
- ✅ Performance insights
- ✅ Generous free tier

---

#### **Analytics: Vercel Analytics + Google Analytics**
```json
{
  "primary": "Vercel Analytics",
  "secondary": "Google Analytics 4"
}
```

**Why Both:**
- Vercel Analytics: Performance, Web Vitals
- Google Analytics: User behavior, conversions

---

## 🔧 Development Tools

### **Package Manager: npm**
```json
{
  "manager": "npm",
  "version": "9.x"
}
```

---

### **Code Quality**

#### **Linting: ESLint**
```json
{
  "tool": "ESLint",
  "config": "Next.js + TypeScript"
}
```

#### **Formatting: Prettier**
```json
{
  "tool": "Prettier",
  "integration": "ESLint"
}
```

#### **Type Checking: TypeScript Compiler**
```bash
npm run type-check
```

---

### **Testing**

#### **Unit Tests: Vitest**
```json
{
  "framework": "Vitest",
  "reason": "Fast, modern, Vite-compatible"
}
```

#### **Component Tests: React Testing Library**
```json
{
  "library": "React Testing Library",
  "reason": "Best practices, user-centric"
}
```

#### **E2E Tests: Playwright (Phase 2)**
```json
{
  "framework": "Playwright",
  "reason": "Fast, reliable, multi-browser"
}
```

---

### **CI/CD: GitHub Actions**
```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  - lint
  - type-check
  - test
  - build
  - deploy (on main branch)
```

---

## 💰 Cost Estimate (Monthly)

### **Phase 1 (MVP - First 3 months)**
```
Supabase Pro: ₹2,000
Vercel Pro: ₹1,600
Msg91 SMS: ₹1,000 (for ~7,000 OTPs)
Domain: ₹100
Sentry (Free): ₹0

Total: ~₹4,700/month (~$57/month)
```

### **Phase 2 (Scale - 10 gyms, 500 members)**
```
Supabase Pro: ₹2,000
Vercel Pro: ₹1,600
Msg91 SMS: ₹3,000 (~20,000 OTPs + reminders)
Railway: ₹800 (for background jobs)
Cloudflare R2: ₹400 (image storage)
Sentry Team: ₹2,000

Total: ~₹9,800/month (~$120/month)
```

### **Phase 3 (Scale - 100 gyms, 5,000 members)**
```
Supabase Pro: ₹5,000 (larger database)
Vercel Pro: ₹1,600
Msg91 SMS: ₹15,000 (~100,000 SMS/month)
Railway: ₹1,600
Cloudflare R2: ₹800
Sentry Team: ₹2,000

Total: ~₹26,000/month (~$315/month)
```

**Revenue:** 100 gyms × ₹999 = ₹99,900/month
**Profit Margin:** ~74%

---

## ✅ Tech Stack Summary

| Category | Technology | Reason |
|----------|-----------|---------|
| **Frontend Framework** | Next.js 14 | SSR, SEO, Vercel integration |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | TailwindCSS | Rapid development, small bundle |
| **State** | Context API + Zustand | Simple yet powerful |
| **Charts** | Recharts | React-friendly, responsive |
| **Database** | Supabase (PostgreSQL) | RLS, realtime, managed |
| **Auth** | Supabase Auth + OTP | Secure, easy integration |
| **Hosting** | Vercel + Railway | Scalable, easy deployment |
| **SMS** | Msg91 / Twilio | Reliable, affordable |
| **Payments** | Razorpay | India-focused, subscriptions |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking, performance |
| **CI/CD** | GitHub Actions | Automated, reliable |

---

## 🔄 Migration Paths

If we outgrow any service:

**Supabase → Self-hosted Postgres**
- Use Docker + Railway/AWS
- Keep same schema
- Migration: pg_dump/restore

**Vercel → AWS/GCP**
- Use Next.js standalone mode
- Deploy to EC2/Cloud Run
- Add load balancer

**Msg91 → Twilio**
- Swap API calls
- Same interface
- Easy migration

---

**Last Updated:** 2025-11-14
**Next Review:** After Phase 1 completion
