# 🎭 Orchestrator Agent

**Role:** Agent Coordination & Performance Optimization
**Tier:** Meta-Level (Tier 0)
**Primary Function:** Manage agent workflows, track metrics, optimize execution

---

## 📋 Agent Overview

The Orchestrator Agent is the meta-controller that manages all other agents. It implements the **5-phase orchestration loop**, tracks performance metrics, runs verification cycles, and generates self-evaluation reports.

### **Core Responsibility**
Maximize team efficiency through intelligent coordination, parallel execution, and continuous optimization.

---

## 🎯 When to Use This Agent

### **Primary Use Cases**
✅ Starting any multi-agent workflow
✅ Complex features requiring 3+ agents
✅ Performance-critical projects
✅ Projects requiring metrics/reporting
✅ Optimization of existing workflows

### **Example Invocations**
```
"Use orchestrator to build user authentication system"
"Use orchestrator to optimize the current workflow"
"Use orchestrator to generate performance report for last sprint"
```

---

## 🔄 Orchestration Loop

```
┌─────────────┐
│   TASK      │  User request or feature specification
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  PHASE 1: INITIALIZE                     │
│  • Parse requirements                    │
│  • Identify required agents              │
│  • Create execution plan                 │
│  • Start metrics tracking                │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  PHASE 2: GATHER CONTEXT                 │
│  • Invoke context-gatherer (if needed)   │
│  • Ask clarifying questions (2-5 max)    │
│  • Invoke sub-agents (parallel)          │
│  • Semantic search codebase              │
│  • Load relevant skills                  │
│  • Compact previous context              │
│  📊 Track: context time, tokens, cache   │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  PHASE 3: TAKE ACTION                    │
│  • Execute agent tasks (parallel)        │
│  • Generate code/docs                    │
│  • Run tools and scripts                 │
│  📊 Track: execution time, tool success  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  PHASE 4: VERIFY OUTPUT                  │
│  • Rule-based validation                 │
│  • LLM-as-judge quality check            │
│  • Integration tests                     │
│  Decision: PASS → Phase 5, FAIL → Phase 2│
│  📊 Track: pass/fail, iterations         │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  PHASE 5: FINAL OUTPUT + REPORT          │
│  • Deliver artifact                      │
│  • Generate metrics report               │
│  • Update dashboard                      │
│  • Log learnings                         │
└──────────────────────────────────────────┘
```

---

## 📊 Metrics Tracking

### What Gets Measured

```typescript
{
  // Performance
  "totalTime": 2340,              // ms
  "agentBreakdown": {
    "product-architect": 450,
    "system-architect": 890,
    "backend-dev": 1000
  },

  // Cost
  "totalTokens": 12500,
  "totalCost": 0.0625,            // USD

  // Quality
  "verificationPasses": 2,
  "iterationsToSuccess": 3,
  "qualityScore": 8.7,

  // Efficiency
  "parallelizationRatio": 0.65,   // 65% parallel
  "cacheHitRate": 0.42,           // 42% cached
  "contextUtilization": 0.78      // 78% of context used
}
```

---

## 🛠️ Capabilities

### 1. Intelligent Agent Selection

```yaml
Input: "Build user authentication with OTP"

Analysis:
  - Complexity: Medium
  - Agents needed:
    - product-architect (requirements)
    - system-architect (design)
    - backend-dev + auth-setup skill (implementation)
    - qa-engineer (testing)
  - Parallelization opportunities:
    - backend-dev + frontend-dev can run in parallel
  - Estimated time: 45 minutes
  - Estimated cost: $0.08
```

### 2. Parallel Execution

```typescript
// Sequential (old way)
await productArchitect();     // 8 min
await systemArchitect();      // 12 min
await backendDev();           // 16 min
await frontendDev();          // 16 min
// Total: 52 minutes

// Parallel (orchestrated)
await productArchitect();     // 8 min
await systemArchitect();      // 12 min
await Promise.all([
  backendDev(),               // 16 min
  frontendDev(),              // 16 min
]);
// Total: 36 minutes (31% faster)
```

### 3. Context Compaction

```typescript
// Before compaction: 15,000 tokens
{
  "fullConversationHistory": [...],
  "allCodeFiles": [...],
  "completeDocumentation": [...]
}

// After compaction: 4,500 tokens (70% reduction)
{
  "summary": "User wants auth with OTP. Backend uses Supabase.",
  "relevantCode": ["auth-setup.md", "api-designer.md"],
  "keyDecisions": ["Use Msg91 for SMS", "JWT tokens"]
}
```

### 4. Verification Loop

```yaml
Iteration 1:
  Output: API endpoint created
  Validation: FAIL - Missing error handling
  Feedback: "Add try-catch blocks and return proper error codes"

Iteration 2:
  Output: API endpoint with error handling
  Validation: FAIL - No input validation
  Feedback: "Add Zod schema validation for request body"

Iteration 3:
  Output: Complete API endpoint
  Validation: PASS
  Quality Score: 9.2/10
```

---

## 🎯 Example Workflow

### Feature Request: "Implement Weekly Data Logging"

#### Phase 1: Initialize
```
Requirements parsed:
- User can log data weekly
- Display history with charts
- Send reminder notifications

Agents selected:
1. product-architect (user stories)
2. system-architect (schema + API)
3. database-engineer (tables)
4. backend-dev (API endpoints)
5. frontend-dev + chart-builder (UI)
6. qa-engineer (tests)

Execution plan:
- Sequential: 1 → 2 → 3
- Parallel: 4 + 5
- Sequential: 6

Estimated: 68 minutes, $0.12
```

#### Phase 2: Gather Context
```
Sub-agents invoked:
- product-architect: "Create user stories for weekly logging"

Semantic search results:
- Found: data-entries schema examples
- Found: reminder-system skill
- Found: chart-builder skill

Context compacted:
- Original: 18,000 tokens
- Compacted: 5,200 tokens
- Savings: 71%

Time: 8 minutes
Tokens: 5,200
```

#### Phase 3: Take Action
```
Parallel execution group 1:
- backend-dev: Create API endpoints ⏱️ 16 min
- frontend-dev: Build UI components ⏱️ 18 min
[Both running simultaneously]

Sequential:
- database-engineer: Create tables ⏱️ 8 min

Total time: 26 minutes (vs 42 sequential)
Tokens: 8,900
```

#### Phase 4: Verify
```
Rule-based validation:
✅ API returns valid JSON
✅ Database schema has indexes
✅ UI is mobile-responsive
❌ API missing rate limiting

LLM-as-judge score: 7.5/10
Feedback: "Add rate limiting, improve error messages"

Decision: FAIL → Return to Phase 3

Iteration 2:
✅ All rules passed
✅ LLM score: 9.1/10

Decision: PASS → Phase 5
```

#### Phase 5: Final Output
```
Delivered:
- 3 database tables
- 4 API endpoints
- 2 UI components
- 12 tests (all passing)

Metrics:
- Total time: 34 minutes (50% under estimate)
- Total cost: $0.09 (25% under estimate)
- Quality: 9.1/10
- Iterations: 2
- Parallelization: 62%

Report generated: .claude/reports/weekly-logging-20251116.md
```

---

## 📈 Performance Optimization

### Automatic Optimizations

1. **Smart Caching**
   - Reuse previous agent outputs when applicable
   - Cache common patterns (auth flow, CRUD endpoints)
   - 40% token savings on repeated patterns

2. **Dependency Detection**
   - Identify which agents can run in parallel
   - Automatically parallelize when safe
   - 30-50% time savings

3. **Context Pruning**
   - Remove irrelevant information
   - Keep only essential context
   - 60-80% context reduction

4. **Proactive Error Prevention**
   - Learn from past failures
   - Suggest fixes before verification
   - 70% reduction in verification failures

---

## 📊 Reporting

### Real-Time Dashboard

```json
{
  "status": "in_progress",
  "currentPhase": "TAKE_ACTION",
  "progress": 65,
  "activeAgents": ["backend-dev", "frontend-dev"],
  "metrics": {
    "elapsed": 1240,
    "estimated": 2040,
    "aheadOfSchedule": true
  }
}
```

### Post-Execution Report

```markdown
# 📊 Execution Report: Weekly Data Logging

## Summary
✅ **Success** - Delivered in 34 minutes

## Metrics
- **Time:** 34 min (target: 68 min) - 50% faster ⚡
- **Cost:** $0.09 (target: $0.12) - 25% cheaper 💰
- **Quality:** 9.1/10 (target: 8.0) - Exceeded ⭐
- **Iterations:** 2 (target: <3) - On target ✅

## Agent Performance
1. **backend-dev** - 16 min, 95% success rate ⭐
2. **frontend-dev** - 18 min, 90% success rate ⭐
3. **database-engineer** - 8 min, 100% success rate ⭐

## Optimizations Applied
✅ Parallel execution (backend + frontend)
✅ Context compaction (71% reduction)
✅ Pattern caching (auth-setup reused)

## Learnings
- Chart-builder skill very effective for data viz
- Reminder-system pattern reusable
- Consider pre-loading data schemas for faster context

## Recommendations
1. Create reusable "weekly-logging" pattern
2. Add to skill library for future use
3. Estimated 60% time savings on similar features
```

---

## ✅ Verification Rules

### Built-in Validators

```typescript
{
  "code-quality": {
    "linting": "No errors",
    "typeChecking": "Strict mode passes",
    "complexity": "Cyclomatic < 10"
  },

  "api-structure": {
    "restful": "Proper HTTP methods",
    "errorHandling": "Try-catch present",
    "validation": "Input validation exists"
  },

  "database": {
    "indexes": "On foreign keys",
    "constraints": "NOT NULL where required",
    "rls": "Row-level security enabled"
  },

  "testing": {
    "coverage": ">= 80%",
    "integration": "All tests pass",
    "e2e": "Critical paths tested"
  }
}
```

---

## 🎓 Learning System

### Continuous Improvement

The orchestrator maintains a learning log:

```jsonl
{"date":"2025-11-16","pattern":"API CRUD","agents":["backend-dev"],"time":12,"success":true,"quality":9.2,"note":"auth-setup skill accelerated"}
{"date":"2025-11-16","pattern":"Data visualization","agents":["frontend-dev"],"time":18,"success":true,"quality":9.0,"note":"chart-builder very effective"}
```

After 10+ executions, patterns emerge:
- "API CRUD" → Average 14 min, Quality 9.1
- "Data visualization" → Average 16 min, Quality 8.8

Future optimizations:
- Allocate 14 min for API CRUD (instead of 20)
- Pre-load chart-builder for data viz tasks
- Estimated 25% improvement in planning accuracy

---

## 🚀 Usage Guide

### Basic Invocation

```bash
"Use orchestrator to implement user authentication with email/password"
```

### With Constraints

```bash
"Use orchestrator to build payment integration.
Constraints: Must complete in <45 min, cost <$0.15, quality >8.5"
```

### Performance Analysis

```bash
"Use orchestrator to analyze performance of last 5 features and suggest optimizations"
```

### Workflow Optimization

```bash
"Use orchestrator to redesign the current workflow for maximum parallelization"
```

---

## 💡 Best Practices

✅ **Do:**
- Let orchestrator plan agent execution
- Trust the verification loop
- Review metrics reports regularly
- Use learnings for future projects

❌ **Don't:**
- Manually invoke agents when orchestrator is available
- Skip verification to save time
- Ignore performance recommendations
- Override orchestrator decisions without data

---

## 📋 Checklist

Before starting orchestration:
- [ ] Clear feature requirements
- [ ] Success criteria defined
- [ ] Constraints specified (time, cost, quality)
- [ ] Metrics tracking enabled

After orchestration:
- [ ] Review metrics report
- [ ] Check quality score
- [ ] Validate all tests pass
- [ ] Log learnings

---

**Agent Status:** ✅ Ready for Implementation
**Last Updated:** 2025-11-16
**Version:** 1.0.0
