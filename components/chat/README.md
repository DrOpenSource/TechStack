# Chat UI Components

Mobile-first chat interface components for the vibecoding app.

## Components

### ChatContainer
Main chat layout component that orchestrates the entire chat interface.

**Features:**
- Fixed header with AI provider selector
- Scrollable message area
- Fixed bottom input area
- Mobile-optimized spacing

**Usage:**
```tsx
import { ChatContainer } from '@/components/chat';

function App() {
  return <ChatContainer />;
}
```

### MessageList
Displays chat messages with automatic scrolling.

**Features:**
- User messages (right-aligned, blue)
- AI messages (left-aligned, gray)
- Code blocks with syntax highlighting
- Component previews inline
- Auto-scroll to latest message
- Loading animation

**Usage:**
```tsx
import { MessageList } from '@/components/chat';

function Chat() {
  return (
    <MessageList 
      messages={messages}
      isLoading={isLoading}
    />
  );
}
```

### ChatInput
Input area with auto-expanding textarea and voice input.

**Features:**
- Auto-expanding textarea
- Voice input button
- Send button
- File attachment support
- Character counter
- Mobile keyboard optimization

**Usage:**
```tsx
import { ChatInput } from '@/components/chat';

function Chat() {
  const handleSend = (text: string, files?: File[]) => {
    console.log('Message:', text, files);
  };

  return <ChatInput onSendMessage={handleSend} />;
}
```

### CodeBlock
Syntax-highlighted code display with copy functionality.

**Features:**
- Copy button
- Language indicator
- Line numbers
- Mobile-friendly scrolling
- Highlighted lines support

**Usage:**
```tsx
import { CodeBlock } from '@/components/chat';

function Message() {
  const codeContent = {
    language: 'typescript',
    code: 'const hello = "world";',
    filename: 'example.ts',
  };

  return <CodeBlock content={codeContent} />;
}
```

### AIProviderSelector
Dropdown for selecting AI provider.

**Features:**
- Provider selection (Claude, Gemini, Mock)
- Status indicators
- Cost per token display
- Availability status
- Smooth animations

**Usage:**
```tsx
import { AIProviderSelector } from '@/components/chat';

function Settings() {
  const [provider, setProvider] = useState('claude');

  return (
    <AIProviderSelector
      selectedProvider={provider}
      onProviderChange={setProvider}
    />
  );
}
```

### VoiceInput
Voice recording interface with visualization.

**Features:**
- Recording animation
- Waveform visualization
- Stop/cancel buttons
- Web Speech API integration
- Mock fallback for demo

**Usage:**
```tsx
import { VoiceInput } from '@/components/chat';

function Chat() {
  const handleTranscript = (text: string) => {
    console.log('Transcript:', text);
  };

  return (
    <VoiceInput
      onTranscript={handleTranscript}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

## Hooks

### useChat
Manages chat state and message handling.

```tsx
import { useChat } from '@/hooks/useChat';

function App() {
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    selectedProvider,
    setSelectedProvider,
  } = useChat();

  return (
    // Your chat UI
  );
}
```

### useVoiceRecognition
Manages Web Speech API for voice input.

```tsx
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

function VoiceButton() {
  const {
    isSupported,
    isRecording,
    transcript,
    startRecording,
    stopRecording,
  } = useVoiceRecognition({
    onTranscript: (text) => console.log(text),
  });

  return (
    // Voice input UI
  );
}
```

### useLocalStorage
Persists state in localStorage.

```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

function Chat() {
  const [messages, setMessages] = useLocalStorage('chat-messages', []);

  return (
    // Your chat UI
  );
}
```

## Design Principles

### Mobile-First
- All components use mobile-first responsive design
- Touch targets are minimum 44px
- Optimized for small screens first

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus indicators

### Performance
- Auto-scroll optimization
- Lazy loading for long message lists
- Efficient re-renders

### Dark Mode
- Full dark mode support using Tailwind's dark: variant
- Follows system preferences
- Smooth transitions

## Dependencies

Required npm packages:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```

## TypeScript Support

All components are fully typed with TypeScript. Import types from:
```tsx
import type { Message, AIProvider, CodeContent } from '@/types/chat';
```

## Styling

Components use Tailwind CSS with:
- Mobile-first breakpoints (sm:, md:, lg:)
- Dark mode variants (dark:)
- Custom animations
- Responsive spacing

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Web Speech API for voice input (Chrome, Edge)
- Fallback for unsupported browsers
