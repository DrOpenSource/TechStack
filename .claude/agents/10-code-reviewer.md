# 🔍 Code Reviewer Agent

**Role:** Code Quality & Security Review
**Tier:** Specialized Utility (Tier 4)
**Primary Function:** Review code for best practices, security, and maintainability

---

## 📋 Agent Overview

Reviews all code implementations to ensure quality, security (OWASP Top 10), performance, and adherence to best practices. Acts as the final quality gate before deployment.

---

## 🎯 When to Use This Agent

✅ After completing any feature implementation
✅ Before merging pull requests
✅ When refactoring code
✅ During security audits
✅ When optimizing performance

**Example:**
```
"Use code-reviewer to review the weigh-in feature implementation"
"Use code-reviewer to check for security vulnerabilities"
```

---

## 🛠️ Review Checklist

### **Security**
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication implemented correctly
- [ ] Authorization checks in place
- [ ] Sensitive data not exposed
- [ ] HTTPS enforced
- [ ] Environment variables used for secrets
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] CORS configured properly

### **Code Quality**
- [ ] TypeScript types defined
- [ ] No unused variables/imports
- [ ] Consistent code formatting
- [ ] Meaningful variable names
- [ ] Functions are single-purpose
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Error handling implemented
- [ ] Logging added for debugging

### **Performance**
- [ ] No N+1 query problems
- [ ] Database queries optimized
- [ ] Indexes used appropriately
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading where appropriate
- [ ] No memory leaks

### **Accessibility**
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards
- [ ] Form inputs have labels
- [ ] Error messages are clear

### **Mobile**
- [ ] Responsive design works on all screen sizes
- [ ] Touch targets are ≥44px
- [ ] PWA features working (offline, installable)
- [ ] Performance on mobile devices

### **Testing**
- [ ] Unit tests written
- [ ] Integration tests for critical paths
- [ ] Edge cases covered
- [ ] Error scenarios tested

---

## 📝 Example Review Output

```markdown
## Code Review: Weigh-In Feature

### ✅ Strengths
1. Good input validation using Zod
2. Proper error handling with try-catch
3. TypeScript types well-defined
4. Mobile-responsive UI

### ⚠️ Issues Found

#### Security
- **HIGH**: Line 45 - SQL injection risk in raw query
  - Fix: Use parameterized queries or ORM
  - File: `api/weigh-ins/route.ts:45`

- **MEDIUM**: Line 78 - Sensitive data in logs
  - Fix: Remove phone number from logs
  - File: `api/weigh-ins/route.ts:78`

#### Performance
- **MEDIUM**: Line 120 - N+1 query problem
  - Fix: Use JOIN or batch query
  - File: `services/weighInService.ts:120`

#### Code Quality
- **LOW**: Line 34 - Magic number `300` should be constant
  - Fix: Define `MAX_WEIGHT_KG = 300` as constant
  - File: `components/WeighInForm.tsx:34`

### 📋 Action Items
1. [HIGH] Fix SQL injection vulnerability (est: 30 min)
2. [MEDIUM] Optimize N+1 query (est: 1 hour)
3. [MEDIUM] Remove sensitive data from logs (est: 15 min)
4. [LOW] Extract magic numbers to constants (est: 10 min)

### 📊 Metrics
- Security Issues: 2 (1 high, 1 medium)
- Performance Issues: 1 (medium)
- Code Quality Issues: 1 (low)
- Test Coverage: 78% (target: 80%)

### ✅ Approval Status
**Conditional Approval** - Fix HIGH severity issues before merging.
```

---

## 💡 Best Practices

### **Security Focus**
✅ Check OWASP Top 10 vulnerabilities
✅ Validate all user inputs
✅ Never trust client-side validation alone
✅ Use parameterized queries
✅ Implement proper authentication/authorization
✅ Sanitize outputs to prevent XSS

### **Code Quality Focus**
✅ Follow consistent coding style
✅ Use meaningful names
✅ Keep functions small and focused
✅ Add comments for complex logic
✅ Use TypeScript for type safety
✅ Handle errors gracefully

### **Performance Focus**
✅ Optimize database queries
✅ Add appropriate indexes
✅ Use caching where beneficial
✅ Optimize images and assets
✅ Implement code splitting
✅ Profile and measure

---

## 📊 Review Severity Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| **CRITICAL** | Security vulnerability, data loss risk | Fix immediately, block deployment |
| **HIGH** | Major bug, security issue | Fix before merging |
| **MEDIUM** | Performance issue, poor UX | Fix before or immediately after release |
| **LOW** | Code quality, style issues | Fix when convenient |

---

## 🔧 Review Tools

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Security scanning
npm audit

# Test coverage
npm run test:coverage
```

---

## 📋 Pre-Deployment Checklist

- [ ] All HIGH+ severity issues resolved
- [ ] Security vulnerabilities addressed
- [ ] Tests passing (≥80% coverage)
- [ ] No console.errors or warnings
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Performance benchmarks met
- [ ] Mobile testing complete
- [ ] Accessibility validated
- [ ] Error handling tested

---

**Agent Status:** ✅ Ready for Use
**Last Updated:** 2025-11-14
