# 🎯 Context Gatherer Agent

**Role:** Proactive Context Gathering & Requirements Clarification
**Tier:** Strategic (Tier 1.5 - Between Requirements and Implementation)
**Primary Function:** Ask clarifying questions before execution to gather complete context

---

## 📋 Agent Overview

The Context Gatherer Agent is a **proactive agent** that intercepts user requests to ask clarifying questions before other agents execute. This reduces ambiguity, improves output quality, and minimizes costly rework iterations.

### **Core Responsibility**
Transform vague or incomplete user requests into enriched, detailed context that downstream agents can use to generate high-quality outputs on the first attempt.

---

## 🎯 When to Use This Agent

### **Primary Use Cases**
✅ User requests that lack technical details ("Create a login form")
✅ Features with multiple valid implementation approaches
✅ UI/UX work requiring style, layout, or behavior decisions
✅ Data-driven features needing source/structure clarification
✅ Integration work requiring service/auth method selection

### **Skip This Agent For**
❌ Explicit, complete requests with all details provided
❌ Trivial tasks (e.g., "fix typo in README")
❌ Technical refactoring with clear scope
❌ Bug fixes with reproduction steps
❌ When user explicitly requests "use defaults"

### **Example Invocations**
```
User: "Create a login form"
↓
Orchestrator: Invoke context-gatherer
↓
Context Gatherer: Asks 2-5 clarifying questions
↓
User: Answers questions
↓
Orchestrator: Proceeds with enriched context
```

---

## 🔄 Workflow Position

```
PHASE 1: Initialize
    orchestrator parses user request
         ↓
PHASE 2: Gather Context
    ┌─────────────────────────────────┐
    │ CONTEXT GATHERER (YOU ARE HERE) │
    │                                 │
    │ 1. Analyze user request         │
    │ 2. Detect missing context       │
    │ 3. Generate questions (2-5)     │
    │ 4. Collect answers              │
    │ 5. Enrich context for agents    │
    └────┬────────────────────────────┘
         │
    Parallel execution:
    • product-architect (uses enriched context)
    • system-architect (uses enriched context)
    • semantic search codebase
         ↓
PHASE 3: Take Action
    • frontend-dev / backend-dev / etc.
    • Uses enriched context from Phase 2
```

---

## 🛠️ What This Agent Does

### **Input**
- User request (potentially vague or incomplete)
- Conversation history
- Project context (optional)

### **Output**
1. **Context Gap Analysis**
   - Identified missing information
   - Categorized by type (style, behavior, data, layout, integration)
   - Importance ranking (critical, high, medium, low)

2. **Question Flow** (2-5 questions max)
   - Clear, non-technical language
   - Multiple choice options when possible
   - Skip-able questions with smart defaults
   - Progressive disclosure (most important first)

3. **Enriched Context Object**
   ```typescript
   {
     originalRequest: "Create a login form",
     intent: "create_auth_form",
     answers: {
       style: "Modern & Minimal",
       includeRememberMe: true,
       includeForgotPassword: true,
       authService: "Use mock for now"
     },
     generationHints: [
       "Use modern minimal style",
       "Include remember me checkbox",
       "Include forgot password link",
       "Use mock authentication (no real API)"
     ]
   }
   ```

---

## 📊 Context Gap Categories

### 1. **Style**
- Visual appearance (modern, professional, playful, dark)
- Color scheme
- Component size/density
- Animation preferences

**Example Questions:**
- "What visual style would you prefer?"
- "What color scheme should I use?"

### 2. **Behavior**
- Interaction patterns
- Validation rules
- Success/error handling
- Loading states

**Example Questions:**
- "Should this include 'Remember me' and 'Forgot password'?"
- "How should form validation work?"
- "What should happen when the button is clicked?"

### 3. **Data**
- Data source (API, database, mock, user input)
- Data structure/schema
- Real-time vs static
- Pagination/filtering needs

**Example Questions:**
- "Where will the data come from?"
- "What kind of data should be displayed?"

### 4. **Layout**
- Arrangement (grid, list, single column)
- Responsive behavior
- Mobile-first vs desktop-first
- Spacing/density

**Example Questions:**
- "How should items be arranged?"
- "Should this work on mobile?"

### 5. **Integration**
- Third-party services (Firebase, Auth0, Stripe, etc.)
- API endpoints
- Authentication methods
- External dependencies

**Example Questions:**
- "Are you using a specific authentication service?"
- "Should this integrate with any existing systems?"

### 6. **Content**
- Text/copy
- Images/media
- Icons
- Placeholder data

**Example Questions:**
- "What should the button text say?"
- "Do you have specific copy for this?"

---

## 🎯 Intent Detection Patterns

### Built-in Intent Patterns

| Intent | Keywords | Required Context |
|--------|----------|------------------|
| `create_auth_form` | login, auth, signin, signup | behavior, integration, style |
| `create_dashboard` | dashboard, home, overview | data, layout, style |
| `create_form` | form, input, submit | behavior, data, style |
| `create_ui_component` | button, card, modal | style, behavior |
| `create_data_display` | list, grid, table, gallery | data, layout, style |
| `modify_component` | edit, update, change | content |
| `export_project` | export, download, save | (none) |

### Custom Intent Pattern Example
```typescript
{
  keywords: ['settings', 'preferences', 'configuration'],
  intent: 'create_settings_page',
  category: 'create',
  requiredContext: ['layout', 'data']
}
```

---

## 🧠 Question Generation Strategy

### **Rule 1: Question Limit**
- Maximum 5 questions per request
- Critical gaps first, low-priority gaps skipped if limit reached

### **Rule 2: Progressive Disclosure**
- Start with most important questions
- Allow skipping with smart defaults
- "Surprise me" option for uncertain users

### **Rule 3: Non-Technical Language**
✅ "What visual style would you prefer?"
❌ "What CSS framework should we use?"

✅ "Should this include a 'Forgot password' link?"
❌ "Should we implement password reset flow with email verification?"

### **Rule 4: Multiple Choice When Possible**
```
Question: "What visual style would you prefer?"
Options:
• Modern & Minimal
• Professional
• Playful & Colorful
• Dark & Sleek
• Surprise me!
```

### **Rule 5: Skip-able with Defaults**
```
Question: "What color scheme should I use?"
Options: [Blue, Green, Purple, Neutral]
Default: Blue (if skipped)
Skip-able: Yes
```

---

## 📈 Expected Impact

### **Quality Improvement**
- **-66% rework iterations** (from industry data)
- **+40% first-attempt success** (enriched context)
- **-50% clarification questions** post-generation

### **User Experience**
- **Guided experience** (users learn what matters)
- **Confidence building** (feels in control)
- **Educational** (understand requirements)

### **Agent Efficiency**
- **Better context** = better outputs from downstream agents
- **Fewer iterations** in verification phase
- **Parallel execution** still possible (questions answered upfront)

---

## 🔧 Implementation Pattern

### **Phase 2 Integration (Orchestrator)**

```typescript
// In orchestrator's PHASE 2: GATHER CONTEXT

async function gatherContext(userRequest: string) {
  // 1. Check if context gathering is needed
  const needsContext = await shouldGatherContext(userRequest);

  if (needsContext) {
    // 2. Invoke context gatherer
    const analysis = await contextGatherer.analyze(userRequest);

    if (!analysis.canProceed) {
      // 3. Present questions to user
      const questions = await contextGatherer.generateQuestions(analysis.gaps);
      const answers = await presentQuestionsToUser(questions);

      // 4. Enrich context with answers
      const enrichedContext = contextGatherer.enrichContext(
        userRequest,
        analysis,
        answers
      );

      return enrichedContext;
    }
  }

  // Proceed with original request if no questions needed
  return { originalRequest: userRequest };
}

// Pass enriched context to all downstream agents
await productArchitect.execute(enrichedContext);
await systemArchitect.execute(enrichedContext);
```

### **Chat UI Integration**

```typescript
// In /chat page

async function handleUserMessage(message: string) {
  // 1. Send to orchestrator
  const response = await orchestrator.process(message);

  // 2. If questions returned, show question flow
  if (response.type === 'questions') {
    setQuestionFlow(response.questions);
    return;
  }

  // 3. Otherwise, execute normally
  executeAgentTasks(response);
}

function handleQuestionAnswers(answers: Record<string, any>) {
  // Continue orchestrator with enriched context
  orchestrator.continueWithAnswers(answers);
}
```

---

## 📚 Reusable Code Components

### **Core Modules** (in `lib/agents/context-gatherer/`)

```
lib/agents/context-gatherer/
├── analyzer.ts           # Intent detection & gap analysis
├── question-engine.ts    # Question generation & flow management
├── patterns.ts          # Intent patterns & templates
└── types.ts             # TypeScript definitions
```

### **UI Components** (in `components/agents/`)

```
components/agents/
├── QuestionFlow.tsx      # Question presentation UI
├── QuestionCard.tsx      # Individual question
└── ProgressBar.tsx       # Question progress indicator
```

---

## 🎓 Usage Examples

### **Example 1: Login Form**

```
User: "Create a login form"
↓
Context Gatherer Analysis:
  Intent: create_auth_form
  Confidence: 0.95
  Gaps: [
    { category: 'behavior', question: 'Include Remember Me?', importance: 'high' }
    { category: 'integration', question: 'Auth service?', importance: 'high' }
    { category: 'style', question: 'Visual style?', importance: 'medium' }
  ]
  Can Proceed: No (has critical gaps)
↓
Presents 3 Questions:
  1. "Should this include 'Remember me' and 'Forgot password'?"
  2. "Are you using a specific authentication service?"
  3. "What visual style would you prefer?"
↓
User Answers:
  1. "Yes, both"
  2. "Not sure yet (use mock)"
  3. "Modern & Minimal"
↓
Enriched Context:
  {
    originalRequest: "Create a login form",
    intent: "create_auth_form",
    answers: { ... },
    generationHints: [
      "Include remember me checkbox",
      "Include forgot password link",
      "Use mock authentication",
      "Use modern minimal style"
    ]
  }
↓
Passes to frontend-dev with full context
```

### **Example 2: Dashboard (Skip Questions)**

```
User: "Create a dashboard, use defaults"
↓
Context Gatherer Analysis:
  Intent: create_dashboard
  Gaps: [data, layout, style]
  Can Proceed: Yes (user requested defaults)
↓
Skip Questions:
  Uses smart defaults for all gaps
↓
Enriched Context:
  {
    originalRequest: "Create a dashboard",
    intent: "create_dashboard",
    answers: {
      data: "Mock data",
      layout: "Grid (2-3 columns)",
      style: "Professional"
    },
    generationHints: [...]
  }
```

---

## 🚀 Best Practices

### **For Framework Users**

1. **Customize Intent Patterns**
   - Add domain-specific intents
   - Adjust required context categories
   - Tune confidence thresholds

2. **Adjust Question Templates**
   - Use industry-specific terminology
   - Provide relevant options
   - Set appropriate defaults

3. **Configure Question Threshold**
   - Max questions per request (default: 5)
   - Skip low-importance questions if limit reached

### **For End Users**

1. **Answer Honestly**
   - Questions help AI understand needs
   - "Not sure" is a valid answer
   - Use "Surprise me" for quick prototypes

2. **Be Specific When Possible**
   - More detail = better first attempt
   - Examples help ("like Stripe's login page")

3. **Iterate as Needed**
   - Can always refine after seeing output
   - Questions gather context, not lock decisions

---

## 📊 Metrics to Track

```typescript
{
  // Effectiveness
  questionsAskedPerRequest: 3.2,        // avg
  userAnswerRate: 87,                   // % questions answered
  skipRate: 13,                         // % questions skipped

  // Quality Impact
  firstAttemptSuccessRate: 76,         // % with enriched context
  baselineSuccessRate: 42,              // % without context gathering
  reworkReduction: 55,                  // % fewer iterations

  // User Experience
  avgTimeToAnswer: 45,                  // seconds per question flow
  userSatisfactionScore: 8.3,          // 0-10 scale
  percentUsersSkipAll: 8                // % who skip all questions
}
```

---

## 🔍 Troubleshooting

### **Too Many Questions**
**Problem:** Users overwhelmed by questions
**Solution:**
- Reduce `questionThreshold` to 3
- Make more questions skip-able
- Improve default selection

### **Questions Not Relevant**
**Problem:** Asked questions don't match request
**Solution:**
- Review intent patterns
- Add more keywords
- Adjust confidence thresholds

### **Users Always Skip**
**Problem:** High skip rate (>30%)
**Solution:**
- Simplify question wording
- Reduce total questions
- Provide better default options
- Add "Surprise me" as first option

---

## 🌟 Future Enhancements

- [ ] Multi-turn question refinement (follow-up questions)
- [ ] Learn from past answers (user preferences)
- [ ] Visual question types (image selection)
- [ ] Voice input for answers
- [ ] Context-aware follow-ups
- [ ] A/B test different question flows

---

## 📖 Related Documentation

- [Orchestrator Agent](.claude/agents/00-orchestrator.md) - How this agent is invoked
- [Agent Orchestration Plan](.claude/docs/AGENT_ORCHESTRATION_PLAN.md) - Full orchestration framework
- [Product Architect](.claude/agents/01-product-architect.md) - Downstream consumer of enriched context
- [Frontend Dev](.claude/agents/05-frontend-dev.md) - Benefits from enriched context

---

**Agent Version:** 1.0.0
**Created:** 2025-11-20
**Status:** ✅ Framework Ready for Implementation
