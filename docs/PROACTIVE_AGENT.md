# Proactive Agent System

## Overview

The **Proactive Agent** is an intelligent AI system that asks clarifying questions before generating code. This ensures that the generated components match user expectations and reduces the need for manual corrections.

## Architecture

```
┌─────────────────────────────────────────────┐
│         User Request                        │
│  "Create a login form"                      │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      Context Analyzer                       │
│  • Detect intent (create_auth_form)         │
│  • Extract existing context (style, etc.)   │
│  • Identify missing context gaps            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
        ┌────────┴────────┐
        │                 │
   Can Proceed?      Need More Info?
        │                 │
        ▼                 ▼
┌──────────────┐  ┌─────────────────┐
│   Generate   │  │ QuestionEngine  │
│     Code     │  │  • Create flow  │
└──────────────┘  │  • Ask Q's 1-5  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Collect Answers │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Enrich Context  │
                  │ Generate Code   │
                  └─────────────────┘
```

## Core Components

### 1. Context Analyzer

**Location:** `packages/core/context/analyzer.ts`

**Purpose:** Analyzes user requests to identify intent and missing context

**Key Features:**
- Pattern-based intent detection
- Context gap identification
- Confidence scoring
- Support for 6 context categories:
  - `style` - Visual appearance
  - `behavior` - Interactions and functionality
  - `data` - Data sources and structure
  - `layout` - Component arrangement
  - `integration` - Third-party services
  - `content` - Text and media

**Example:**

```typescript
import { ContextAnalyzer } from '@vibecode/core/context';

const analyzer = new ContextAnalyzer();

const analysis = analyzer.analyze({
  message: "Create a login form",
  conversationHistory: []
});

// Result:
{
  intent: "create_auth_form",
  confidence: 0.9,
  gaps: [
    {
      category: "behavior",
      question: "Should this include 'Remember me' and 'Forgot password'?",
      importance: "high",
      suggestedAnswers: ["Yes, both", "Just forgot password", "Neither"],
      canProceedWithout: false
    }
  ],
  canProceed: false
}
```

### 2. Question Engine

**Location:** `packages/core/agent/question-engine.ts`

**Purpose:** Generates and manages question flows

**Key Features:**
- Converts context gaps to questions
- Manages question flow state
- Supports multiple question types:
  - `single_choice` - Pick one option
  - `multiple_choice` - Pick many options
  - `text` - Free text input
  - `boolean` - Yes/No
  - `optional` - Can be skipped
- Smart defaults for low-priority questions
- Progress tracking

**Example:**

```typescript
import { QuestionEngine } from '@vibecode/core/agent';

const engine = new QuestionEngine();

const flow = engine.createFlow(analysis.gaps, 'request-123');

// Process answer
const updatedFlow = engine.processAnswer(flow, 'q-0-behavior', 'Yes, both');

// Skip remaining
const completedFlow = engine.skipAll(updatedFlow);

// Get enriched context
const context = engine.getFinalContext(completedFlow, request, analysis);
```

### 3. Proactive Agent

**Location:** `packages/core/agent/proactive-agent.ts`

**Purpose:** Main orchestrator that coordinates analysis, questions, and generation

**Key Features:**
- Two modes: `proactive` (asks questions) and `passive` (generates immediately)
- Mock-first approach for development
- Configurable question threshold
- Provider-agnostic (works with mock, Claude, Gemini)

**Example:**

```typescript
import { ProactiveAgent } from '@vibecode/core/agent';
import { mockProvider } from '@vibecode/core/providers';

const agent = new ProactiveAgent(mockProvider, {
  mode: 'proactive',
  mockFirst: true,
  questionThreshold: 5,
  autoPreview: true
});

// Process request
const response = await agent.process({
  message: "Create a login form",
  conversationHistory: []
});

if (response.type === 'questions') {
  // Display questions to user
  displayQuestionFlow(response.questionFlow);

  // After collecting answers
  const finalResponse = await agent.continueWithAnswers(
    response.questionFlow,
    request,
    analysis
  );
}
```

## UI Components

### QuestionFlow Component

**Location:** `app/components/agent/QuestionFlow.tsx`

**Purpose:** Beautiful UI for presenting questions to users

**Features:**
- Progress bar showing completion
- Animated transitions between questions
- Support for all question types
- "Skip all" functionality
- Back navigation
- Mobile-responsive

**Usage:**

```tsx
import { QuestionFlow } from '@/app/components/agent/QuestionFlow';

<QuestionFlow
  flow={questionFlow}
  onAnswer={(questionId, answer) => {
    // Handle individual answer
  }}
  onComplete={(answers) => {
    // All questions answered
  }}
  onSkipAll={() => {
    // User wants to proceed with defaults
  }}
/>
```

### ProactiveChatContainer

**Location:** `app/(workspace)/agent-demo/page.tsx`

**Purpose:** Complete chat interface with proactive agent integration

**Features:**
- Chat message history
- Inline question flows
- Code display with syntax highlighting
- Preview button integration
- AI suggestions
- Loading states

## Intent Patterns

The system recognizes these intents out of the box:

| Intent | Keywords | Required Context |
|--------|----------|------------------|
| `create_auth_form` | login, auth, signin | behavior, integration, style |
| `create_dashboard` | dashboard, home | data, layout, style |
| `create_form` | form, input | behavior, data, style |
| `create_ui_component` | button, card, modal | style, behavior |
| `create_data_display` | list, grid, table | data, layout, style |
| `modify_component` | edit, update, change | content |
| `export_project` | export, download | (none) |

## Question Templates

Pre-defined question templates for common scenarios:

### Style Questions
- "What visual style would you prefer?"
- "What color scheme should I use?"

### Behavior Questions
- "Should this include 'Remember me' and 'Forgot password'?"
- "How should the form validation work?"
- "What should happen when the button is clicked?"

### Data Questions
- "Where will the data come from?"
- "What kind of data should be displayed?"

### Layout Questions
- "How should items be arranged?"

### Integration Questions
- "Are you using a specific authentication service?"

## Configuration

```typescript
interface AgentConfig {
  mode: 'proactive' | 'passive';
  mockFirst: boolean;              // Always try mock provider first
  questionThreshold: number;       // Max questions to ask (default: 5)
  autoPreview: boolean;           // Auto-open preview after generation
  provider: 'mock' | 'claude' | 'gemini';
}
```

## Mock Provider

**Location:** `packages/core/providers/mock-provider.ts`

**Purpose:** Default provider that works without API keys

**Features:**
- Pattern-based code generation
- 4 pre-built component templates:
  - Login Form
  - Dashboard
  - Button Component
  - Card Component
- Applies generation hints from context
- Realistic timing delays
- No external dependencies

## Extending the System

### Add New Intent Pattern

```typescript
// packages/core/context/analyzer.ts

const INTENT_PATTERNS: IntentPattern[] = [
  // ... existing patterns
  {
    keywords: ['settings', 'preferences', 'configuration'],
    intent: 'create_settings_page',
    category: 'create',
    requiredContext: ['layout', 'data'],
  },
];
```

### Add New Question Template

```typescript
// packages/core/context/analyzer.ts

const GAP_TEMPLATES: GapTemplate[] = [
  // ... existing templates
  {
    category: 'integration',
    question: 'Should this sync with cloud storage?',
    importance: 'medium',
    suggestedAnswers: ['Yes, Google Drive', 'Yes, Dropbox', 'No'],
    canProceedWithout: true,
    applicableIntents: ['create_settings_page'],
  },
];
```

### Add New Provider

```typescript
// packages/core/providers/custom-provider.ts

import type { AIProvider, EnrichedContext, GeneratedCode } from '@vibecode/core/types';

export class CustomProvider implements AIProvider {
  name = 'custom';

  async generate(prompt: string, context: EnrichedContext): Promise<GeneratedCode> {
    // Your generation logic
    return {
      component: 'MyComponent',
      code: '...',
      language: 'typescript',
      framework: 'react',
    };
  }

  async analyzeIntent(message: string): Promise<IntentAnalysis> {
    // Use the built-in ContextAnalyzer
    throw new Error('Use ContextAnalyzer');
  }

  async askQuestions(intent: IntentAnalysis): Promise<Question[]> {
    // Use the built-in QuestionEngine
    throw new Error('Use QuestionEngine');
  }
}
```

## Demo Pages

### Proactive Agent Demo

**URL:** `/agent-demo`

**What it demonstrates:**
- AI asking clarifying questions
- Question flow UI
- Answer collection
- Code generation with context
- Suggestions display

**Try it:**
1. Navigate to `/agent-demo`
2. Type: "Create a login form"
3. Answer the questions (or skip)
4. See the generated code

### Interactive Canvas Demo

**URL:** `/canvas-demo`

**What it demonstrates:**
- Element selection in preview
- Property inspector panel
- Live property editing
- AI suggestions per element
- Multi-viewport preview

**Try it:**
1. Navigate to `/canvas-demo`
2. Click any element in the preview
3. Edit properties in the inspector
4. See changes reflect immediately

## Best Practices

### For Developers

1. **Always use mock mode during development**
   ```typescript
   const agent = new ProactiveAgent(mockProvider, {
     mockFirst: true  // ✅ Good
   });
   ```

2. **Limit questions to avoid overwhelming users**
   ```typescript
   questionThreshold: 5  // Max 5 questions
   ```

3. **Make low-priority questions skipable**
   ```typescript
   {
     importance: 'low',
     canProceedWithout: true  // ✅ Allow skipping
   }
   ```

4. **Provide sensible defaults**
   ```typescript
   {
     suggestedAnswers: ['Option 1', 'Option 2', 'Surprise me!'],
     default: 'Surprise me!'  // ✅ Smart default
   }
   ```

### For Users

1. **Be specific in your requests**
   - ❌ "Make a form"
   - ✅ "Create a login form with email and password"

2. **Answer questions for best results**
   - Questions help AI understand your needs
   - You can always skip if uncertain

3. **Use "Surprise me" for quick prototyping**
   - AI will use sensible defaults
   - You can always refine later

## API Reference

See [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation.

## Examples

See [examples/](../examples/) directory for:
- Headless usage
- Custom UI integration
- Custom provider implementation
- Advanced question flows

## Troubleshooting

### Questions not appearing

**Issue:** Agent generates code without asking questions

**Solution:**
```typescript
// Ensure mode is set to 'proactive'
const agent = new ProactiveAgent(provider, {
  mode: 'proactive'  // Not 'passive'
});
```

### Too many questions

**Issue:** Agent asks too many questions

**Solution:**
```typescript
// Lower the question threshold
const agent = new ProactiveAgent(provider, {
  questionThreshold: 3  // Default is 5
});
```

### Questions are not relevant

**Issue:** Questions don't match the request

**Solution:**
- Check intent patterns in `context/analyzer.ts`
- Add new patterns for your use case
- Adjust keyword matching

## Future Enhancements

- [ ] Multi-turn question refinement
- [ ] Learn from past answers
- [ ] Context-aware follow-up questions
- [ ] Visual question types (image selection)
- [ ] Voice input for questions
- [ ] Collaborative question answering
- [ ] A/B testing different question flows

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on extending the proactive agent system.

---

**Next:** Check out the [Interactive Canvas documentation](./INTERACTIVE_CANVAS.md) to learn about visual component editing.
