# Agent Framework Corrections

**Date:** 2025-11-20
**Issue:** Proactive Agent built as standalone system instead of integrating with existing agent framework

---

## ❌ What Was Wrong

### Mistake 1: Standalone System
Built the proactive agent as a **separate system** in `packages/core/` with isolated demo pages (`/agent-demo`, `/canvas-demo`) instead of integrating it into the existing `.claude/agents/` framework.

### Mistake 2: Missed Existing Architecture
Failed to recognize that:
- Agents are **frameworks** (markdown documentation in `.claude/agents/`)
- Orchestrator invokes agents in a 5-phase loop
- Agents should integrate into `/chat`, not create new UI routes
- There were already 13 agents (00-12) following a specific pattern

### Mistake 3: Wrong Documentation Pattern
Created separate docs (`PROACTIVE_AGENT.md`, `INTERACTIVE_CANVAS.md`) instead of following the agent framework pattern used by other agents.

---

## ✅ What Was Corrected

### 1. Created Agent Framework

**File:** `.claude/agents/13-context-gatherer.md`

Proper agent framework documentation that follows the pattern:
- Role & tier definition
- When to use / when to skip
- Workflow position
- Input/output specification
- Integration patterns
- Metrics tracking
- Best practices

### 2. Updated Orchestrator

**File:** `.claude/agents/00-orchestrator.md`

Updated Phase 2 (GATHER CONTEXT) to invoke context gatherer:
```
PHASE 2: GATHER CONTEXT
  • Invoke context-gatherer (if needed)    ← NEW
  • Ask clarifying questions (2-5 max)     ← NEW
  • Invoke sub-agents (parallel)
  • Semantic search codebase
  • Load relevant skills
  • Compact previous context
```

### 3. Moved Code to Framework Location

**From:** `packages/core/` (wrong - standalone system)
**To:** `lib/agents/context-gatherer/` (correct - framework implementation)

Structure:
```
lib/agents/context-gatherer/
├── types/           # Type definitions
├── context/         # Intent analysis
├── agent/           # Question engine
├── providers/       # Mock/Claude/Gemini
└── README.md        # Implementation guide
```

### 4. Updated Main README

Added Context Gatherer as Agent #13:
- Updated agent count: 13 → 14
- Added to agent table
- Updated framework status

---

## 🎯 How It Should Work Now

### Agent Invocation Flow

```
User: "Create a login form"
   ↓
/chat → Orchestrator
   ↓
PHASE 1: Initialize
  Parse request, identify agents
   ↓
PHASE 2: Gather Context
  ↓
  Context Gatherer Agent (Agent #13)
  ├─ Analyze intent: create_auth_form
  ├─ Detect gaps: [behavior, integration, style]
  ├─ Generate questions (2-5)
  ├─ Present to user in chat UI
  ├─ Collect answers
  └─ Enrich context
  ↓
  Product Architect (Agent #01)
    Uses enriched context
  ↓
  System Architect (Agent #02)
    Uses enriched context
   ↓
PHASE 3: Take Action
  Frontend Dev (Agent #05)
    Uses enriched context to generate better code
```

### Integration Points

1. **Orchestrator** (`.claude/agents/00-orchestrator.md`)
   - Invokes context gatherer in Phase 2
   - Passes enriched context to downstream agents

2. **Chat UI** (`/chat` page)
   - When orchestrator returns questions, show QuestionFlow UI
   - Collect answers and continue orchestrator
   - No separate demo pages needed

3. **Agent Framework** (`.claude/agents/13-context-gatherer.md`)
   - Documentation of how the agent works
   - Reusable across projects
   - Can be customized per domain

---

## 📁 File Organization

### ✅ Correct (Framework Pattern)

```
.claude/
└── agents/
    └── 13-context-gatherer.md     # Framework documentation

lib/
└── agents/
    └── context-gatherer/           # Implementation modules
        ├── types/
        ├── context/
        ├── agent/
        └── providers/

app/(workspace)/
└── chat/
    └── page.tsx                    # Integration point (uses framework)

components/agents/
└── QuestionFlow.tsx                # Reusable UI component
```

### ❌ Wrong (Standalone System)

```
packages/core/                       # Wrong location
└── [agent code]

app/(workspace)/
├── agent-demo/                      # Separate demo (not needed)
└── canvas-demo/                     # Separate demo (not needed)

docs/
├── PROACTIVE_AGENT.md              # Separate docs (not framework pattern)
└── INTERACTIVE_CANVAS.md           # Separate docs (not framework pattern)
```

---

## 🔄 What Remains to Do

### 1. Integrate into /chat Page ⏳

Update `/chat` to use the context gatherer:

```typescript
// In app/(workspace)/chat/page.tsx

import { ProactiveAgent } from '@/lib/agents/context-gatherer/agent';
import { QuestionFlow } from '@/components/agents/QuestionFlow';

async function handleUserMessage(message: string) {
  // Orchestrator invokes context gatherer
  const response = await orchestrator.process(message);

  if (response.type === 'questions') {
    // Show question flow inline in chat
    setQuestionFlow(response.questionFlow);
  } else {
    // Execute agents with enriched context
    executeAgents(response);
  }
}
```

### 2. Clean Up Demo Pages (Optional) ⏳

Options:
- **Option A:** Keep as examples in `examples/` directory
- **Option B:** Remove entirely (code is in `lib/agents/`)
- **Option C:** Keep but mark as "Reference Only" in navigation

### 3. Update Canvas Documentation ⏳

The Interactive Canvas should be integrated similarly:
- Create `.claude/skills/interactive-canvas.md` (or agent if needed)
- Move code to `lib/canvas/`
- Integrate into `/preview` or `/chat`

---

## 📊 Benefits of Correction

### Before (Wrong)
- ❌ Standalone system, not reusable
- ❌ Separate demo pages, fragmented UX
- ❌ Not integrated with orchestrator
- ❌ Hard to customize per project
- ❌ Separate documentation pattern

### After (Correct)
- ✅ Framework pattern, reusable across projects
- ✅ Integrated into `/chat`, unified UX
- ✅ Orchestrator invokes in Phase 2
- ✅ Easy to customize (edit markdown doc)
- ✅ Consistent documentation with other agents

---

## 🎓 Lessons Learned

### 1. **Read Existing Structure First**
Before building, explore:
- Existing agent patterns (`.claude/agents/`)
- Existing workflows (orchestrator)
- Existing integration points

### 2. **Follow Established Patterns**
All agents follow the same pattern:
- Markdown documentation in `.claude/agents/`
- Implementation code in `lib/` or `components/`
- Integration through orchestrator, not new routes

### 3. **Framework vs Implementation**
- **Framework** = Pattern/documentation (`.claude/agents/*.md`)
- **Implementation** = Actual code (`lib/agents/*/`)
- Users copy **framework**, implement **their own code**

### 4. **Reusability Over Features**
Goal is a **reusable framework** that works for any project, not a feature-complete app.

---

## 📚 See Also

- [Context Gatherer Agent Framework](.claude/agents/13-context-gatherer.md)
- [Orchestrator Documentation](.claude/agents/00-orchestrator.md)
- [Agent Orchestration Plan](.claude/docs/AGENT_ORCHESTRATION_PLAN.md)
- [Implementation Modules](../lib/agents/context-gatherer/README.md)

---

**Status:** ✅ Framework Corrected
**Next:** Integrate into `/chat` page and test with orchestrator
