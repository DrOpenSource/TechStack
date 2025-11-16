# 🔄 Feature Development Workflow

**Purpose:** Standard process for developing new features from user story to deployment

---

## 📋 Overview

This workflow guides you through building a complete feature using the AI agent team. Follow these steps for consistent, high-quality implementation.

---

## 🚀 Step-by-Step Process

### **Step 1: Planning & Design (Strategic)**

#### **1.1 Create User Stories**
```
"Use product-architect to break down [feature name] into user stories"
```

**Output:**
- User stories with acceptance criteria
- Technical requirements
- Dependencies identified
- Priority ranking

**Review:** Verify all requirements are captured

---

#### **1.2 Design Technical Architecture**
```
"Use system-architect to design the technical approach for [feature name]"
```

**Output:**
- Database schema changes
- API endpoint specifications
- Frontend component structure
- Integration requirements

**Review:** Ensure design is scalable and secure

---

### **Step 2: Implementation (Parallel)**

#### **2.1 Database Setup**
```
"Use database-engineer with schema-designer skill to implement [feature] schema"
```

**Tasks:**
- Create/modify tables
- Add indexes
- Set up RLS policies
- Create migration scripts

**Deliverable:** Migration file ready to run

---

#### **2.2 Backend Development**
```
"Use backend-dev with api-designer skill to build [feature] API endpoints"
```

**Tasks:**
- Implement API endpoints
- Add business logic
- Implement validation
- Add error handling

**Deliverable:** Working API endpoints

---

#### **2.3 Frontend Development**
```
"Use frontend-dev with component-library skill to build [feature] UI"
```

**Tasks:**
- Create UI components
- Integrate with API
- Add form validation
- Implement loading states
- Add error handling

**Deliverable:** Working UI components

---

### **Step 3: Quality Assurance**

#### **3.1 Create Tests**
```
"Use qa-engineer to create test suite for [feature]"
```

**Tests to create:**
- Unit tests for business logic
- API integration tests
- Component rendering tests
- User flow tests

**Deliverable:** Test suite with 80%+ coverage

---

#### **3.2 Code Review**
```
"Use code-reviewer to review [feature] implementation"
```

**Review areas:**
- Security vulnerabilities
- Performance issues
- Code quality
- Best practices

**Deliverable:** Review report with action items

---

### **Step 4: Integration & Testing**

#### **4.1 Run All Tests**
```bash
npm run test
npm run lint
npm run type-check
```

**Fix:** Any failing tests or errors

---

#### **4.2 Manual Testing**
- Test on mobile device
- Test offline scenarios (PWA)
- Test edge cases
- Test error scenarios

**Deliverable:** Feature working as expected

---

### **Step 5: Deployment**

#### **5.1 Create PR**
```
git checkout -b feature/[feature-name]
git add .
git commit -m "feat: [feature description]"
git push origin feature/[feature-name]
```

Create pull request with:
- Feature description
- Screenshots (if UI changes)
- Testing notes
- Link to user story

---

#### **5.2 Deploy to Staging**
```
"Use devops-agent to deploy [feature] to staging"
```

**Verify:**
- Staging deployment successful
- Feature works in staging
- No errors in logs

---

#### **5.3 Deploy to Production**
```
# After PR approval and merge to main
"Use devops-agent to deploy to production"
```

**Monitor:**
- Deployment status
- Error rates
- User feedback

---

## 📊 Example: Implementing "Weekly Weigh-In" Feature

### **Day 1: Planning (2-3 hours)**
```
1. "Use product-architect to break down weekly weigh-in feature"
   → 3 user stories created

2. "Use system-architect to design weigh-in API and schema"
   → Schema designed, API endpoints defined
```

### **Day 2-3: Implementation (1-2 days)**
```
3. "Use database-engineer to create weigh_ins table"
   → Migration created

4. "Use backend-dev to build weigh-in API endpoints"
   → POST /weigh-ins implemented
   → GET /weigh-ins/history implemented

5. "Use frontend-dev to build WeighInForm component"
   → Form component created
   → Progress chart added
```

### **Day 4: Quality & Testing (4-6 hours)**
```
6. "Use qa-engineer to test weigh-in feature"
   → Test suite created
   → Manual testing complete

7. "Use code-reviewer to review weigh-in implementation"
   → 2 issues found and fixed
```

### **Day 5: Deployment (2-3 hours)**
```
8. Create PR and get approval
9. "Use devops-agent to deploy to production"
10. Monitor and verify
```

**Total Time:** 3-5 days for complete feature

---

## ✅ Feature Completion Checklist

- [ ] User stories defined
- [ ] Technical design complete
- [ ] Database changes implemented
- [ ] Backend API working
- [ ] Frontend UI complete
- [ ] Tests created (80%+ coverage)
- [ ] Code reviewed
- [ ] Security validated
- [ ] Mobile tested
- [ ] Deployed to staging
- [ ] Deployed to production
- [ ] Monitoring active
- [ ] Documentation updated

---

## 🔄 Iterative Improvements

After deployment:
1. Monitor user feedback
2. Track error rates
3. Measure performance
4. Iterate on design
5. Plan improvements

---

## 💡 Pro Tips

1. **Work in parallel** - Database, backend, and frontend can often be developed simultaneously
2. **Test early** - Don't wait until the end to start testing
3. **Review often** - Code review catches issues early
4. **Deploy frequently** - Small, frequent deployments reduce risk
5. **Monitor closely** - Watch for issues after deployment

---

**Workflow Status:** ✅ Ready for Use
**Last Updated:** 2025-11-14
