# Chat UI Components - Quick Reference

## Import Statements

```typescript
// Components
import { ChatContainer } from '@/components/chat';
import { MessageList } from '@/components/chat';
import { ChatInput } from '@/components/chat';
import { CodeBlock } from '@/components/chat';
import { AIProviderSelector } from '@/components/chat';
import { VoiceInput } from '@/components/chat';

// Or import all at once
import {
  ChatContainer,
  MessageList,
  ChatInput,
  CodeBlock,
  AIProviderSelector,
  VoiceInput,
} from '@/components/chat';

// Hooks
import { useChat } from '@/hooks/useChat';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Types
import type {
  Message,
  AIProvider,
  MessageContent,
  CodeContent,
  ChatSession,
} from '@/types/chat';

// Mock Data
import { AI_PROVIDERS, MOCK_MESSAGES } from '@/lib/mock/chatData';

// Utils
import { cn } from '@/lib/utils/cn';
import { formatDate, formatCost, formatTokenCount } from '@/lib/utils/formatters';
```

---

## Component Usage Examples

### ChatContainer (Full App)
```tsx
export default function ChatPage() {
  return <ChatContainer />;
}
```

### Custom Chat with Hook
```tsx
function CustomChat() {
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    selectedProvider,
    setSelectedProvider,
  } = useChat({
    initialMessages: MOCK_MESSAGES,
    provider: 'claude',
  });

  return (
    <div className="flex flex-col h-screen">
      <header>
        <AIProviderSelector
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
        />
      </header>

      <MessageList messages={messages} isLoading={isLoading} />

      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
```

### Individual Components

#### AIProviderSelector
```tsx
const [provider, setProvider] = useState<AIProvider>('claude');

<AIProviderSelector
  selectedProvider={provider}
  onProviderChange={setProvider}
/>
```

#### MessageList
```tsx
<MessageList
  messages={messages}
  isLoading={isLoading}
  className="flex-1"
/>
```

#### ChatInput
```tsx
<ChatInput
  onSendMessage={(text, files) => {
    console.log('Message:', text);
    console.log('Files:', files);
  }}
  onVoiceInput={(text) => console.log('Voice:', text)}
  placeholder="Ask me anything..."
  maxLength={4000}
  disabled={false}
  isLoading={false}
/>
```

#### CodeBlock
```tsx
const codeContent: CodeContent = {
  language: 'typescript',
  code: `const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
};`,
  filename: 'greet.ts',
  highlightLines: [2],
};

<CodeBlock content={codeContent} />
```

#### VoiceInput
```tsx
const [showVoice, setShowVoice] = useState(false);

{showVoice && (
  <VoiceInput
    onTranscript={(text) => {
      console.log('Transcript:', text);
      setShowVoice(false);
    }}
    onCancel={() => setShowVoice(false)}
  />
)}
```

---

## Hook Usage Examples

### useChat
```tsx
const {
  messages,           // Message[]
  isLoading,          // boolean
  error,              // string | null
  selectedProvider,   // AIProvider
  setSelectedProvider,// (provider: AIProvider) => void
  sendMessage,        // (text: string, files?: File[]) => Promise<void>
  clearChat,          // () => void
  retryLastMessage,   // () => void
  totalTokens,        // number
  totalCost,          // number
} = useChat({
  initialMessages: [],
  provider: 'claude',
  onError: (error) => console.error(error),
});
```

### useVoiceRecognition
```tsx
const {
  isSupported,      // boolean
  isRecording,      // boolean
  transcript,       // string
  startRecording,   // () => void
  stopRecording,    // () => void
  cancelRecording,  // () => void
} = useVoiceRecognition({
  continuous: true,
  interimResults: true,
  language: 'en-US',
  onTranscript: (text) => console.log(text),
  onError: (error) => console.error(error),
});
```

### useLocalStorage
```tsx
const [messages, setMessages] = useLocalStorage<Message[]>('chat-messages', []);
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

---

## Type Definitions

### Message
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: MessageContent[];
  timestamp: Date;
  provider?: AIProvider;
  tokens?: number;
  cost?: number;
}
```

### MessageContent
```typescript
interface MessageContent {
  type: 'text' | 'code' | 'component' | 'image' | 'error';
  text?: string;
  code?: CodeContent;
  component?: ComponentPreview;
  imageUrl?: string;
  error?: string;
}
```

### CodeContent
```typescript
interface CodeContent {
  language: string;
  code: string;
  filename?: string;
  highlightLines?: number[];
}
```

---

## Creating Messages

### Text Message
```typescript
const message: Message = {
  id: `msg-${Date.now()}`,
  role: 'user',
  content: [{ type: 'text', text: 'Hello!' }],
  timestamp: new Date(),
};
```

### Code Message
```typescript
const message: Message = {
  id: `msg-${Date.now()}`,
  role: 'assistant',
  content: [
    { type: 'text', text: 'Here is the code:' },
    {
      type: 'code',
      code: {
        language: 'javascript',
        code: 'console.log("Hello");',
        filename: 'example.js',
      },
    },
  ],
  timestamp: new Date(),
  provider: 'claude',
};
```

### Multi-Content Message
```typescript
const message: Message = {
  id: `msg-${Date.now()}`,
  role: 'assistant',
  content: [
    { type: 'text', text: 'Here is a button component:' },
    {
      type: 'code',
      code: {
        language: 'tsx',
        code: 'export const Button = () => <button>Click</button>',
      },
    },
    {
      type: 'component',
      component: {
        componentName: 'Button',
        props: { variant: 'primary' },
      },
    },
  ],
  timestamp: new Date(),
};
```

---

## Styling with Tailwind

### Custom Classes
```tsx
// Using cn() utility
import { cn } from '@/lib/utils/cn';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)}>
  Content
</div>
```

### Responsive Breakpoints
```tsx
<div className="
  text-sm sm:text-base md:text-lg
  p-4 sm:p-6 md:p-8
  w-full sm:w-3/4 md:w-1/2
">
  Responsive content
</div>
```

### Dark Mode
```tsx
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
">
  Dark mode content
</div>
```

---

## Common Patterns

### Loading State
```tsx
{isLoading ? (
  <div className="flex items-center gap-2">
    <Loader className="animate-spin" />
    <span>Loading...</span>
  </div>
) : (
  <div>Content</div>
)}
```

### Error Handling
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
    <p className="text-red-900">{error}</p>
  </div>
)}
```

### Conditional Rendering
```tsx
{messages.length === 0 ? (
  <div className="text-center text-gray-500">
    No messages yet. Start a conversation!
  </div>
) : (
  <MessageList messages={messages} />
)}
```

### Touch-Friendly Button
```tsx
<button className="
  min-w-[44px] min-h-[44px]
  px-4 py-2
  bg-blue-600 hover:bg-blue-700
  active:scale-95
  transition-all
">
  Click me
</button>
```

---

## Integration with Real APIs

### Claude API
```typescript
async function sendToClaude(message: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_CLAUDE_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{ role: 'user', content: message }],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}
```

### Gemini API
```typescript
async function sendToGemini(message: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

---

## Keyboard Shortcuts

### ChatInput
- `Enter` - Send message
- `Shift + Enter` - New line
- `Ctrl/Cmd + K` - Clear chat (custom implementation needed)

---

## Mobile Optimization Tips

1. **Prevent zoom on input focus:**
   ```css
   input, textarea { font-size: 16px !important; }
   ```

2. **Safe area insets:**
   ```css
   padding-bottom: max(1rem, env(safe-area-inset-bottom));
   ```

3. **Touch targets:**
   ```tsx
   className="min-w-[44px] min-h-[44px]"
   ```

4. **Active states:**
   ```tsx
   className="active:scale-95 transition-transform"
   ```

---

## File Paths Reference

| Item | Path |
|------|------|
| Components | `/home/user/TechStack/components/chat/` |
| Hooks | `/home/user/TechStack/hooks/` |
| Types | `/home/user/TechStack/types/chat.ts` |
| Mock Data | `/home/user/TechStack/lib/mock/chatData.ts` |
| Utils | `/home/user/TechStack/lib/utils/` |
| Styles | `/home/user/TechStack/app/globals.css` |
| Config | `/home/user/TechStack/tailwind.config.ts` |

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Type check
npm run type-check

# Lint
npm run lint

# Install dependencies
npm install
```

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** 2025-11-18
