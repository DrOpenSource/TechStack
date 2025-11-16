# 🚀 Phase Kickoff Workflow

**Purpose:** Start a new development phase (e.g., Phase 1, Phase 2) with proper planning

---

## 📋 Overview

Use this workflow when starting a new phase of development. It ensures all features are properly planned, prioritized, and ready for implementation.

---

## 🎯 Step-by-Step Process

### **Step 1: Feature Analysis**

```
"Use product-architect to analyze Phase [X] from the Product PRD"
```

**Output:**
- Complete list of features
- User stories for each feature
- Acceptance criteria
- Priority ranking (P0, P1, P2)
- Effort estimates

**Review:** Ensure all PRD requirements captured

---

### **Step 2: Technical Architecture**

```
"Use system-architect to design Phase [X] architecture"
```

**Output:**
- Complete database schema for phase
- All API endpoints defined
- Frontend component structure
- State management approach
- Integration requirements
- Performance considerations

**Review:** Architecture supports all features

---

### **Step 3: Create Implementation Plan**

#### **3.1 Group Features**
Organize features into logical groups:
- **Foundation** (must build first)
- **Core Features** (main functionality)
- **Integrations** (third-party connections)
- **Quality & Polish** (testing, optimization)

#### **3.2 Identify Dependencies**
```
Feature A → Must complete before Feature B
Feature C → Can build in parallel with Feature D
```

#### **3.3 Create Sprint Plan**
Break phase into 1-2 week sprints:
```
Sprint 1: Foundation
  - Authentication
  - Database setup
  - Basic UI structure

Sprint 2: Core Features
  - User tracking
  - Data collection

Sprint 3: Dashboards
  - User dashboard
  - Admin dashboard

Sprint 4: Quality
  - Testing
  - Performance optimization
  - Bug fixes
```

---

### **Step 4: Setup & Configuration**

#### **4.1 Database Setup**
```
"Use database-engineer to implement Phase [X] complete schema"
```

**Creates:**
- All tables for the phase
- Relationships
- Indexes
- RLS policies
- Migration scripts

---

#### **4.2 Environment Setup**
```
"Use devops-agent to configure Phase [X] environment"
```

**Sets up:**
- Environment variables
- Supabase configuration
- Third-party API keys (staging)
- CI/CD updates

---

### **Step 5: Kickoff Implementation**

Start with foundation features first:

```
# Example: Phase 1 Foundation
1. "Use backend-dev with auth-setup to implement authentication"
2. "Use frontend-dev with pwa-builder to set up PWA structure"
3. "Use integration-specialist with sms-integrator to set up Msg91"
```

Then proceed to core features using feature-development workflow.

---

## 📊 Example: Phase 1 Kickoff

### **PRD Phase 1 Features:**
1. User tracking & metrics
2. Automated notifications
3. User dashboard
4. Admin dashboard
5. Project setup
6. Data collection
7. Progress reports

---

### **Step 1: Analysis**
```
"Use product-architect to break down Phase 1 from Product PRD"
```

**Output:** 18 user stories across 7 feature groups

---

### **Step 2: Architecture**
```
"Use system-architect to design Phase 1 architecture"
```

**Output:**
- 12 database tables
- 25 API endpoints
- 15 UI components
- 3 third-party integrations

---

### **Step 3: Sprint Plan**

**Sprint 1 (Week 1-2): Foundation**
- Database setup
- Authentication (OTP)
- User profile
- Multi-tenant setup
- Basic UI shell

**Sprint 2 (Week 3-4): User Features**
- Data entry
- Data tracking
- Progress visualization
- Notification preferences

**Sprint 3 (Week 4-5): Dashboard Features**
- User dashboard
- Status monitoring
- Weekly reports
- User alerts

**Sprint 4 (Week 5-6): Admin Features**
- Admin dashboard
- Project management
- User analytics
- Report generation

**Sprint 5 (Week 6): Polish**
- Testing
- Bug fixes
- Performance optimization
- Documentation

---

### **Step 4: Database Setup**
```
"Use database-engineer to implement Phase 1 schema"
```

**Created:**
- organizations, users, roles, projects tables
- data_entries, metrics tables
- notification_preferences table
- RLS policies for all tables

---

### **Step 5: Start Building**
```
"Use backend-dev with auth-setup to implement OTP authentication"
"Use frontend-dev with pwa-builder to set up user PWA"
```

Then continue with feature-development workflow for each feature.

---

## ✅ Phase Kickoff Checklist

### **Planning**
- [ ] All PRD features analyzed
- [ ] User stories created
- [ ] Technical architecture designed
- [ ] Dependencies identified
- [ ] Sprint plan created

### **Setup**
- [ ] Database schema complete
- [ ] Migrations created
- [ ] Environment variables configured
- [ ] Third-party accounts created (staging)
- [ ] CI/CD pipeline updated

### **Team Alignment**
- [ ] All agents briefed on phase goals
- [ ] Feature priorities clear
- [ ] Success metrics defined
- [ ] Timeline agreed upon

### **Ready to Code**
- [ ] Foundation features identified
- [ ] First sprint backlog ready
- [ ] Development environment ready
- [ ] All agents ready to execute

---

## 📈 Success Metrics

Track these throughout the phase:

**Velocity**
- User stories completed per sprint
- Features deployed per week

**Quality**
- Test coverage percentage
- Bug count
- Code review issues

**Delivery**
- On-time delivery rate
- Sprint completion rate

---

## 💡 Pro Tips

1. **Start with foundation** - Don't skip basic setup
2. **Parallel work** - Multiple agents can work simultaneously
3. **Regular reviews** - Check progress weekly
4. **Adjust as needed** - Plans can change
5. **Document learnings** - Update workflows based on experience

---

## 🔄 During Phase

Weekly check-ins:
```
Week 1: "What did we complete? Any blockers?"
Week 2: "Are we on track? Need to adjust priorities?"
Week 3: "Quality checks passing? Ready for testing?"
Week 4: "Phase complete? Ready for deployment?"
```

---

**Workflow Status:** ✅ Ready for Use
**Last Updated:** 2025-11-14
