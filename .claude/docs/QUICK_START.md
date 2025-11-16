# 🚀 Quick Start Guide
## Using Your AI Agent Team

**Welcome to your AI-powered development team!**

This guide will help you start building your project using specialized AI agents.

---

## 📚 First Steps

### **1. Read the Documentation**
```bash
# Start here
cat .claude/README.md

# Understand the tech stack
cat .claude/docs/TECH_STACK.md

# Review agents
ls .claude/agents/

# Review skills
ls .claude/skills/
```

---

## 🎯 Your First Feature

Let's build your first feature using the agent team!

### **Example: Implement User Profile**

#### **Step 1: Planning**
```
"Use product-architect to break down user profile feature into user stories"
```

**Expected Output:**
- User can create profile
- User can view profile
- User can edit profile
- Profile includes: name, email, phone, preferences

---

#### **Step 2: Design**
```
"Use system-architect to design user profile API and schema"
```

**Expected Output:**
- Database schema for users table
- API endpoints: GET /api/users/:id, PATCH /api/users/:id
- Frontend component structure

---

#### **Step 3: Implement Database**
```
"Use database-engineer to create users table with profile fields"
```

**Expected Output:**
- Migration file created
- RLS policies added
- Indexes created

---

#### **Step 4: Implement Backend**
```
"Use backend-dev to build user profile API endpoints"
```

**Expected Output:**
- GET /api/users/:id endpoint
- PATCH /api/users/:id endpoint
- Input validation
- Error handling

---

#### **Step 5: Implement Frontend**
```
"Use frontend-dev to build user profile components"
```

**Expected Output:**
- ProfileView component
- ProfileEditForm component
- API integration
- Mobile-responsive

---

#### **Step 6: Test**
```
"Use qa-engineer to create tests for user profile feature"
```

**Expected Output:**
- Unit tests for API
- Component tests
- Integration tests

---

#### **Step 7: Review**
```
"Use code-reviewer to review user profile implementation"
```

**Expected Output:**
- Security check
- Performance review
- Code quality feedback

---

#### **Step 8: Deploy**
```
"Use devops-agent to deploy user profile feature to staging"
```

**Expected Output:**
- Deployed to staging
- Tests passing
- Ready for production

---

## 🔄 Common Workflows

### **Starting Phase 1**
```
1. "Use product-architect to analyze Phase 1 from Product PRD"
2. "Use system-architect to design Phase 1 architecture"
3. "Use database-engineer to implement Phase 1 schema"
4. Then proceed with feature-by-feature implementation
```

### **Adding a New Feature**
```
1. "Use product-architect to create user stories for [feature]"
2. "Use system-architect to design [feature] technical approach"
3. Implement: database → backend → frontend (can be parallel)
4. "Use qa-engineer to test [feature]"
5. "Use code-reviewer to review [feature]"
6. "Use devops-agent to deploy [feature]"
```

### **Fixing a Bug**
```
1. Identify the issue
2. "Use code-reviewer to analyze [bug description]"
3. Fix the issue
4. "Use qa-engineer to test the fix"
5. Deploy
```

### **Optimizing Performance**
```
1. Identify slow operation
2. "Use system-architect to suggest optimization for [operation]"
3. "Use backend-dev to implement optimization"
4. "Use qa-engineer with performance-tester to validate improvement"
```

---

## 🎨 Agent Cheat Sheet

### **When to Use Which Agent**

| I want to... | Use this agent |
|--------------|----------------|
| Break down PRD into tasks | `product-architect` |
| Design database schema | `system-architect` + `database-engineer` |
| Create API endpoints | `backend-dev` |
| Build UI components | `frontend-dev` |
| Set up authentication | `backend-dev` + `auth-setup` skill |
| Set up PWA/offline | `frontend-dev` + `pwa-builder` skill |
| Add charts/graphs | `frontend-dev` + `chart-builder` skill |
| Integrate third-party APIs | `integration-specialist` |
| Create tests | `qa-engineer` |
| Review code | `code-reviewer` |
| Deploy | `devops-agent` |
| Generate reports | `report-generator` |

---

## 💡 Pro Tips

### **Tip 1: Work in Parallel**
Agents can work simultaneously:
```
"Use database-engineer to create data_entries table"
"Use backend-dev to build data entry API"
"Use frontend-dev to build data entry form"

All can work in parallel, then integrate!
```

### **Tip 2: Be Specific**
```
❌ "Build user tracking"
✅ "Use frontend-dev with chart-builder skill to create progress graph showing weekly data for the last 12 weeks"
```

### **Tip 3: Iterate**
```
Build → Test → Review → Fix → Deploy → Monitor → Improve
```

### **Tip 4: Use Skills Explicitly**
```
"Use backend-dev with auth-setup skill to implement OTP authentication"
Better than: "Build authentication"
```

### **Tip 5: Check Dependencies**
Some features need others first:
```
✅ Authentication → Profile → Data Entry → Dashboard
❌ Dashboard → Data Entry → Profile → Authentication
```

---

## 📋 Phase 1 Recommended Order

### **Week 1-2: Foundation**
```
1. "Use database-engineer to implement complete Phase 1 schema"
2. "Use backend-dev with auth-setup to implement OTP authentication"
3. "Use frontend-dev with pwa-builder to set up PWA structure"
4. "Use integration-specialist to set up third-party integrations"
```

### **Week 3-4: User Features**
```
5. "Use backend-dev to build user profile API"
6. "Use frontend-dev to build user profile UI"
7. "Use backend-dev to build data entry API"
8. "Use frontend-dev with chart-builder to build data visualization UI"
9. "Use backend-dev to implement notification system"
```

### **Week 4-5: User Dashboard**
```
10. "Use backend-dev to build user dashboard API"
11. "Use frontend-dev to build user dashboard UI"
12. "Use frontend-dev with chart-builder to add progress charts"
```

### **Week 5-6: Admin Dashboard**
```
13. "Use backend-dev to build admin dashboard API"
14. "Use frontend-dev to build admin dashboard UI"
15. "Use report-generator to implement PDF reports"
```

### **Week 6: Testing & Deployment**
```
16. "Use qa-engineer to create comprehensive test suite for Phase 1"
17. "Use code-reviewer to review all Phase 1 code"
18. "Use devops-agent with deployment-pipeline to set up CI/CD"
19. "Use devops-agent to deploy Phase 1 to production"
```

---

## 🆘 Troubleshooting

### **"I don't know which agent to use"**
→ Check `.claude/README.md` agent table
→ Review workflows in `.claude/workflows/`

### **"Feature is too complex"**
→ Use `product-architect` to break it down into smaller stories

### **"Not sure about technical approach"**
→ Use `system-architect` to design solution first

### **"Code isn't working"**
→ Use `code-reviewer` to identify issues
→ Use `qa-engineer` to create tests

### **"Need to deploy"**
→ Check `.claude/workflows/feature-development.md`
→ Use `devops-agent`

---

## 📊 Measuring Success

Track these metrics:

**Development Speed**
- Features completed per week
- Time from planning to deployment

**Code Quality**
- Test coverage (target: 80%+)
- Code review issues
- Bug count

**Team Efficiency**
- Agent utilization
- Parallel work completion
- Deployment frequency

---

## 🎓 Next Steps

1. **Read all agent documents** in `.claude/agents/`
2. **Review tech stack** in `.claude/docs/TECH_STACK.md`
3. **Follow phase kickoff workflow** to start Phase 1
4. **Build your first feature** using feature-development workflow
5. **Iterate and improve** based on learnings

---

## 📞 Quick Reference

```bash
# View all agents
ls .claude/agents/

# View all skills
ls .claude/skills/

# View workflows
ls .claude/workflows/

# Start Phase 1
"Use product-architect to analyze Phase 1 from Product PRD"

# Build a feature
"Use [agent] with [skill] to [task]"

# Deploy
"Use devops-agent to deploy to [staging/production]"
```

---

## 🚀 You're Ready!

You now have a complete AI development team at your disposal. Start building!

**Remember:**
1. Plan first (product-architect, system-architect)
2. Build in parallel when possible
3. Test everything (qa-engineer)
4. Review for quality (code-reviewer)
5. Deploy confidently (devops-agent)
6. Monitor and iterate

**Good luck building your project! 🎯**

---

**Need Help?**
- Review agent documentation: `.claude/agents/[agent-name].md`
- Check workflows: `.claude/workflows/`
- Review tech decisions: `.claude/docs/TECH_STACK.md`

---

**Last Updated:** 2025-11-14
