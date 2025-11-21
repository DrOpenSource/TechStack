# Context Gatherer - Implementation Modules

This directory contains the **implementation modules** for the Context Gatherer Agent framework defined in `.claude/agents/13-context-gatherer.md`.

## Structure

```
lib/agents/context-gatherer/
├── types/           # TypeScript type definitions
├── context/         # Intent analysis & gap detection
├── agent/           # Question engine & orchestration
├── providers/       # Mock/Claude/Gemini providers
└── README.md        # This file
```

## Usage

### In Chat Integration

```typescript
import { ProactiveAgent } from '@/lib/agents/context-gatherer/agent';
import { mockProvider } from '@/lib/agents/context-gatherer/providers';

const agent = new ProactiveAgent(mockProvider, {
  mode: 'proactive',
  questionThreshold: 5
});

const response = await agent.process({
  message: userMessage,
  conversationHistory: messages
});

if (response.type === 'questions') {
  // Show question flow UI
  displayQuestions(response.questionFlow);
} else {
  // Proceed with generation
  executeAgents(response);
}
```

### In Orchestrator Phase 2

```typescript
// PHASE 2: GATHER CONTEXT
async function gatherContext(userRequest) {
  const contextGatherer = new ProactiveAgent(provider);
  const analysis = await contextGatherer.analyze(userRequest);

  if (!analysis.canProceed) {
    const questions = await contextGatherer.generateQuestions(analysis.gaps);
    const answers = await presentToUser(questions);
    return contextGatherer.enrichContext(answers);
  }

  return { originalRequest: userRequest };
}
```

## Key Modules

### 1. Context Analyzer
**File:** `context/analyzer.ts`

Detects user intent and identifies missing context gaps using pattern matching.

### 2. Question Engine
**File:** `agent/question-engine.ts`

Generates question flows with priorities, defaults, and skip logic.

### 3. Proactive Agent
**File:** `agent/proactive-agent.ts`

Orchestrates the entire flow: analyze → question → enrich → generate.

### 4. Mock Provider
**File:** `providers/mock-provider.ts`

Default provider that works without API keys, includes 4 component templates.

## See Also

- **Framework Documentation:** `.claude/agents/13-context-gatherer.md`
- **UI Components:** `components/agents/QuestionFlow.tsx`
- **Demo Pages:** `app/(workspace)/agent-demo/` (reference only)
