# 🛠️ Skills Library

Reusable capabilities that agents invoke to perform specific tasks.

---

## 📂 Skills by Category

### **Frontend Skills (5)**

| Skill | Purpose | Primary Agents |
|-------|---------|----------------|
| `pwa-builder` | Service worker, manifest, offline support | frontend-dev |
| `component-library` | Reusable UI components (buttons, forms, cards) | frontend-dev |
| `chart-builder` | Data visualization with Recharts | frontend-dev, report-generator |
| `mobile-first-ui` | Responsive design patterns, touch-friendly UI | frontend-dev |
| `form-validator` | Client-side validation patterns | frontend-dev |

### **Backend Skills (6)**

| Skill | Purpose | Primary Agents |
|-------|---------|----------------|
| `api-designer` | RESTful API structure and patterns | backend-dev, system-architect |
| `auth-setup` | OTP authentication, JWT, sessions | backend-dev, integration-specialist |
| `database-ops` | CRUD operations, query optimization | backend-dev, database-engineer |
| `schema-designer` | Database schema creation, relationships | database-engineer, system-architect |
| `reminder-system` | Scheduled notifications and cron jobs | backend-dev |
| `multi-tenant-setup` | Organization-specific data isolation (RLS) | database-engineer, system-architect |

### **Integration Skills (4)**

| Skill | Purpose | Primary Agents |
|-------|---------|----------------|
| `sms-integrator` | SMS/OTP providers (Msg91, Twilio, Fast2SMS) | integration-specialist |
| `whatsapp-integrator` | WhatsApp Business API integration | integration-specialist |
| `notification-setup` | Push notifications (FCM) | integration-specialist |
| `payment-gateway` | Razorpay, Stripe integration | integration-specialist |

### **Quality Skills (3)**

| Skill | Purpose | Primary Agents |
|-------|---------|----------------|
| `test-suite-builder` | Jest/Vitest test creation | qa-engineer |
| `performance-tester` | Load testing, optimization | qa-engineer |
| `security-scanner` | Vulnerability checking (OWASP) | qa-engineer, code-reviewer |

### **DevOps Skills (2)**

| Skill | Purpose | Primary Agents |
|-------|---------|----------------|
| `deployment-pipeline` | CI/CD setup (GitHub Actions) | devops-agent |
| `monitoring-setup` | Logging, error tracking (Sentry) | devops-agent |

---

## 📖 How to Use Skills

### **In Agent Invocations**
```
"Use [agent] with [skill] to [task]"

Examples:
"Use frontend-dev with pwa-builder to set up offline support"
"Use backend-dev with auth-setup to implement OTP authentication"
"Use integration-specialist with sms-integrator to add Msg91"
```

### **Skills Are Automatically Invoked**
Agents know which skills they need and invoke them automatically based on the task.

---

## 🔄 Skill Reusability

Skills can be:
- **Reused** across multiple features
- **Shared** across agents
- **Extended** for new requirements
- **Ported** to other projects

---

## 📝 Creating New Skills

When you need a new capability:

1. **Identify the need** - What specific task needs to be repeated?
2. **Choose category** - Frontend, Backend, Integration, Quality, or DevOps?
3. **Create skill file** - Document the implementation pattern
4. **Test** - Verify it works in multiple scenarios
5. **Update this README** - Add to the appropriate category table

---

## ✅ Status

**Skills Documented:** 20
**Categories:** 5
**Ready for Use:** ✅ All skills

---

**Last Updated:** 2025-11-14
