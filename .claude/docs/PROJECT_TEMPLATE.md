# 📋 Project Template

**Purpose:** Configuration template for customizing the AI Agent Framework for your specific project

**Instructions:** Copy this file and fill in your project details

---

## Project Identity

```yaml
PROJECT_NAME: "Your Project Name"
SHORT_NAME: "YourApp"
DESCRIPTION: "Brief description of what your application does"
VERSION: "1.0.0"
```

---

## Domain & Industry

```yaml
DOMAIN: "industry"  # Options: healthcare, fintech, ecommerce, saas, education, etc.
TARGET_USERS: "description of primary users"
USE_CASE: "primary use case or problem being solved"
```

---

## Technology Stack

```yaml
FRONTEND:
  framework: "Next.js 14"  # or React, Vue, etc.
  language: "TypeScript"
  styling: "TailwindCSS"
  state: "React Context"  # or Redux, Zustand, etc.

BACKEND:
  runtime: "Node.js"
  framework: "Next.js API Routes"
  database: "PostgreSQL (Supabase)"
  auth: "Supabase Auth"

DEPLOYMENT:
  hosting: "Vercel"
  database_host: "Supabase Cloud"
  cdn: "Vercel Edge Network"
```

---

## Domain Terminology

**Map generic terms to your domain-specific terminology:**

```yaml
ENTITIES:
  user: "customer"        # Generic "user" becomes "customer", "patient", "student", etc.
  admin: "manager"        # Generic "admin" becomes "manager", "doctor", "teacher", etc.
  staff: "employee"       # Generic "staff" becomes your staff role
  organization: "company" # Generic "organization" becomes your org type

DATA_CONCEPTS:
  data_entry: "transaction"  # What users log/create
  project: "campaign"        # What users are enrolled in
  metric: "kpi"              # What you measure
  period: "quarter"          # Time divisions

FEATURES:
  primary_action: "checkout"  # Main user action
  secondary_action: "browse"  # Secondary action
  data_visualization: "analytics_dashboard"
```

---

## Business Rules

```yaml
VALIDATION_RULES:
  user_id_format: "USR-XXXXX"
  min_age: 18
  max_items_per_user: 100

COMPLIANCE:
  data_privacy: "GDPR"  # or HIPAA, SOC2, etc.
  security_standard: "SOC2"
  accessibility: "WCAG AA"
```

---

## Feature Flags

```yaml
FEATURES:
  simulation_first: true    # Use prototype-dev agent?
  quality_validation: true  # Use design-qa agent?
  offline_support: true     # PWA with offline capabilities?
  real_time: false          # WebSocket/real-time features?
  multi_language: false     # i18n support?
  dark_mode: true

INTEGRATIONS:
  payment_gateway: "Stripe"  # or null if not needed
  email_provider: "SendGrid"
  sms_provider: "Twilio"
  analytics: "Google Analytics"
```

---

## Agent Customization

**Which agents to use for your project:**

```yaml
AGENTS_ENABLED:
  orchestrator: true          # ✅ Always recommended
  product_architect: true     # ✅ Always recommended
  system_architect: true      # ✅ Always recommended
  prototype_dev: true         # ✅ If using simulation-first
  design_qa: true             # ✅ If quality validation enabled
  frontend_dev: true          # ✅ For UI work
  backend_dev: true           # ✅ For API work
  database_engineer: true     # ✅ For data modeling
  qa_engineer: true           # ⚠️ Optional but recommended
  integration_specialist: false # ⚠️ Only if 3rd party integrations
  devops_agent: true          # ✅ For deployment
  report_generator: false     # ⚠️ Only if reporting features needed
  code_reviewer: true         # ⚠️ Optional but recommended
```

---

## Example: Healthcare Project

```yaml
PROJECT_NAME: "HealthTrack Pro"
SHORT_NAME: "HealthTrack"
DOMAIN: "healthcare"

ENTITIES:
  user: "patient"
  admin: "doctor"
  staff: "nurse"
  organization: "hospital"

DATA_CONCEPTS:
  data_entry: "vital_signs"
  project: "treatment_plan"
  metric: "health_indicator"
  period: "visit"

COMPLIANCE:
  data_privacy: "HIPAA"
  security_standard: "HITRUST"
  accessibility: "WCAG AA"

FEATURES:
  simulation_first: true
  quality_validation: true
  offline_support: true  # For clinics with poor connectivity
```

---

## Example: E-Commerce Project

```yaml
PROJECT_NAME: "ShopHub"
SHORT_NAME: "ShopHub"
DOMAIN: "ecommerce"

ENTITIES:
  user: "customer"
  admin: "store_owner"
  staff: "sales_rep"
  organization: "merchant"

DATA_CONCEPTS:
  data_entry: "order"
  project: "campaign"
  metric: "sales_metric"
  period: "month"

INTEGRATIONS:
  payment_gateway: "Stripe"
  email_provider: "SendGrid"
  shipping: "Shippo"

FEATURES:
  simulation_first: true
  real_time: true  # Real-time inventory updates
  multi_language: true  # International markets
```

---

## Next Steps

1. Fill in this template with your project details
2. Save as `.claude/docs/MY_PROJECT_CONFIG.md`
3. Reference this file when invoking agents
4. Update agents if domain-specific customization needed

**Template Status:** Ready for customization
