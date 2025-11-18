import { faker } from "@faker-js/faker";

const responseTemplates = [
  "I'll help you build that! Let me start by creating the basic structure...",
  "Great idea! I can definitely implement that feature. Here's my approach...",
  "I understand what you're looking for. Let me break this down into components...",
  "That's an interesting requirement. I'll create a solution that handles...",
  "Perfect! I'll implement this using modern best practices. Here's the plan...",
];

const technicalResponses = [
  "I'll create a React component with TypeScript for type safety...",
  "I'm setting up the state management using Zustand for better performance...",
  "I'll implement this with Tailwind CSS for responsive mobile-first design...",
  "I'm adding Framer Motion animations to make the UI feel smooth...",
  "I'll use Next.js API routes to handle the backend logic...",
];

const codeExamples = [
  `\`\`\`typescript
// Component implementation
export default function NewFeature() {
  const [state, setState] = useState(false);

  return (
    <div className="p-4">
      {/* Your feature here */}
    </div>
  );
}
\`\`\``,
  `\`\`\`typescript
// API route
export async function POST(request: Request) {
  const data = await request.json();
  // Process data
  return Response.json({ success: true });
}
\`\`\``,
  `\`\`\`typescript
// Store setup
export const useFeatureStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
\`\`\``,
];

export function generateMockAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Context-aware responses
  if (lowerMessage.includes("login") || lowerMessage.includes("auth")) {
    return `I'll create an authentication flow for you! Here's what I'll implement:

1. **Login Screen** with email/password fields
2. **Session Management** using Zustand
3. **Protected Routes** with automatic redirects
4. **Token Storage** in secure local storage

${codeExamples[0]}

This will provide a secure and user-friendly authentication experience. The login state will persist across sessions.`;
  }

  if (lowerMessage.includes("dashboard") || lowerMessage.includes("home")) {
    return `I'll build a mobile-first dashboard with these features:

- **Quick Stats** cards showing key metrics
- **Recent Activity** timeline
- **Action Buttons** for common tasks
- **Responsive Grid** layout

${codeExamples[0]}

The dashboard will be optimized for mobile with smooth animations and intuitive navigation.`;
  }

  if (lowerMessage.includes("button") || lowerMessage.includes("component")) {
    return `I'll create a reusable component for you:

${codeExamples[0]}

This component includes:
- Mobile-optimized touch targets (44px minimum)
- Loading states with animations
- Accessibility features (ARIA labels)
- Multiple variants (primary, secondary, destructive)`;
  }

  if (lowerMessage.includes("api") || lowerMessage.includes("backend")) {
    return `I'll set up the API endpoint:

${codeExamples[1]}

This includes:
- Request validation
- Error handling
- Type-safe responses
- Mock data support for development`;
  }

  // Generic response
  const template =
    responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
  const technical =
    technicalResponses[Math.floor(Math.random() * technicalResponses.length)];
  const code =
    codeExamples[Math.floor(Math.random() * codeExamples.length)];

  return `${template}

${technical}

${code}

I've implemented this with mobile-first responsive design and smooth animations. The code follows Next.js 14 best practices with TypeScript for type safety.

Would you like me to add any additional features or modifications?`;
}

export function generateMockError(): string {
  const errors = [
    "I encountered an issue with that request. Could you try rephrasing?",
    "I'm having trouble processing that. Can you provide more details?",
    "That feature isn't available yet. Would you like to try something else?",
  ];

  return errors[Math.floor(Math.random() * errors.length)];
}
