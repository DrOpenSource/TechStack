# VibeCoding Chat Interface - Setup Guide

## Overview

A complete mobile-first chat interface for AI coding assistance built with Next.js, React, TypeScript, and TailwindCSS.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
vibecoding-chat/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   └── chat/
│       ├── ChatContainer.tsx        # Main chat layout
│       ├── MessageList.tsx          # Message display
│       ├── ChatInput.tsx            # Input area
│       ├── CodeBlock.tsx            # Code highlighting
│       ├── AIProviderSelector.tsx   # Provider selection
│       ├── VoiceInput.tsx           # Voice recording
│       ├── index.ts                 # Exports
│       └── README.md                # Component docs
├── hooks/
│   ├── useChat.ts                   # Chat state management
│   ├── useVoiceRecognition.ts       # Voice input
│   └── useLocalStorage.ts           # Persist state
├── lib/
│   ├── mock/
│   │   └── chatData.ts              # Mock data
│   └── utils/
│       ├── cn.ts                    # Class utilities
│       └── formatters.ts            # Format helpers
├── types/
│   └── chat.ts                      # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Features

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Touch-friendly buttons (minimum 44px)
- Auto-expanding textarea
- Bottom sheet patterns
- Safe area insets for iOS

### Chat Features
- Real-time message display
- Code syntax highlighting
- File attachments (images)
- Voice input (Web Speech API)
- Auto-scroll to latest message
- Loading states
- Error handling

### AI Provider Selection
- Multiple providers (Claude, Gemini, Mock)
- Cost tracking per message
- Token usage display
- Provider status indicators

### Dark Mode
- Full dark mode support
- System preference detection
- Smooth transitions
- CSS variable theming

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus indicators
- Semantic HTML

## Configuration

### AI Providers

Edit `/lib/mock/chatData.ts` to customize providers:

```typescript
export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'claude',
    name: 'Claude (Sonnet 4.5)',
    description: 'Anthropic Claude',
    costPerToken: 0.000003,
    available: true,
    maxTokens: 200000,
  },
  // Add more providers...
];
```

### Mock Responses

Customize mock AI responses in `/lib/mock/chatData.ts`:

```typescript
export const MOCK_RESPONSES: Record<string, string> = {
  'hello': 'Hello! How can I help you?',
  // Add more responses...
};
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Create `.env.local` for API keys:

```env
NEXT_PUBLIC_CLAUDE_API_KEY=your_key
NEXT_PUBLIC_GEMINI_API_KEY=your_key
```

## Customization

### Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',
      // Add custom colors
    },
  },
}
```

### Brand Assets

Replace logo in `ChatContainer.tsx`:

```tsx
<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600">
  {/* Your logo here */}
</div>
```

## Integration with Real AI APIs

### Claude API

```typescript
// In ChatContainer.tsx or useChat hook
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5-20250929',
    messages: [{ role: 'user', content: text }],
  }),
});
```

### Gemini API

```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
  }
);
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load components
const VoiceInput = dynamic(() => import('./VoiceInput'), {
  loading: () => <LoadingSpinner />,
});
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image src={imageUrl} alt="..." width={500} height={300} />
```

### Caching

```typescript
// Cache chat sessions in localStorage
const [sessions, setSessions] = useLocalStorage('chat-sessions', []);
```

## Browser Support

- Chrome/Edge 90+ (full support)
- Safari 14+ (partial voice support)
- Firefox 88+ (no voice support)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Voice Input Not Working

Voice input requires HTTPS in production. Use `localhost` for development or deploy to HTTPS.

### Build Errors

Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors

Regenerate TypeScript types:
```bash
npm run type-check
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

- Documentation: `/components/chat/README.md`
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## Credits

Built with:
- [Next.js 14](https://nextjs.org/)
- [React 18](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-18  
**Status:** Production Ready
