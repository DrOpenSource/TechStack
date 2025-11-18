/**
 * Mock Chat Data
 * Sample conversations and AI provider configurations for demo/testing
 */

import { AIProviderConfig, Message, ChatSession } from '@/types/chat';

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'claude',
    name: 'Claude (Sonnet 4.5)',
    description: 'Anthropic Claude - Best for coding and analysis',
    costPerToken: 0.000003,
    available: true,
    maxTokens: 200000,
    icon: '🤖',
  },
  {
    id: 'gemini',
    name: 'Gemini Pro',
    description: 'Google Gemini - Fast and cost-effective',
    costPerToken: 0.0000015,
    available: true,
    maxTokens: 32000,
    icon: '✨',
  },
  {
    id: 'mock',
    name: 'Mock AI',
    description: 'Demo AI for testing (no real API calls)',
    costPerToken: 0,
    available: true,
    maxTokens: 100000,
    icon: '🎭',
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Can you help me create a mobile-responsive button component in React?',
      },
    ],
    timestamp: new Date('2025-11-18T10:00:00'),
  },
  {
    id: '2',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: "I'll help you create a mobile-responsive button component with TypeScript and TailwindCSS. Here's a reusable component with proper touch targets:",
      },
      {
        type: 'code',
        code: {
          language: 'typescript',
          filename: 'Button.tsx',
          code: `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles - mobile-first (min 44px touch target)
  'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] px-4',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
      },
      size: {
        sm: 'text-sm px-3 min-h-[36px]',
        md: 'text-base px-4 min-h-[44px]',
        lg: 'text-lg px-6 min-h-[52px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';`,
        },
      },
      {
        type: 'text',
        text: 'This component includes:\n• Touch-friendly minimum height (44px)\n• Active state scaling for tactile feedback\n• Loading state with spinner\n• Variant system for different styles\n• Full TypeScript support\n• Mobile-first responsive design',
      },
    ],
    timestamp: new Date('2025-11-18T10:00:30'),
    provider: 'claude',
    tokens: 850,
    cost: 0.00255,
  },
  {
    id: '3',
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Great! Can you show me an example of how to use it?',
      },
    ],
    timestamp: new Date('2025-11-18T10:01:00'),
  },
  {
    id: '4',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: "Here's how to use the Button component in your application:",
      },
      {
        type: 'code',
        code: {
          language: 'tsx',
          filename: 'App.tsx',
          code: `import { Button } from './components/Button';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await fakeApiCall();
    setIsLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Primary button */}
      <Button onClick={handleSubmit} isLoading={isLoading}>
        Submit Form
      </Button>

      {/* Secondary button */}
      <Button variant="secondary" size="lg">
        Cancel
      </Button>

      {/* Full width button (great for mobile) */}
      <Button fullWidth variant="primary">
        Continue
      </Button>

      {/* Outline button */}
      <Button variant="outline" size="sm">
        Learn More
      </Button>
    </div>
  );
}`,
        },
      },
      {
        type: 'component',
        component: {
          componentName: 'ButtonDemo',
          props: {
            variant: 'primary',
            size: 'md',
          },
        },
      },
    ],
    timestamp: new Date('2025-11-18T10:01:15'),
    provider: 'claude',
    tokens: 420,
    cost: 0.00126,
  },
  {
    id: '5',
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Perfect! Now can you help me add dark mode support?',
      },
    ],
    timestamp: new Date('2025-11-18T10:02:00'),
  },
  {
    id: '6',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: "I'll update the button to support dark mode using Tailwind's dark mode classes:",
      },
      {
        type: 'code',
        code: {
          language: 'typescript',
          filename: 'Button.tsx',
          code: `const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] px-4',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950',
        ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'text-sm px-3 min-h-[36px]',
        md: 'text-base px-4 min-h-[44px]',
        lg: 'text-lg px-6 min-h-[52px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);`,
        },
      },
      {
        type: 'text',
        text: 'Now add this to your `tailwind.config.js`:\n\n```js\nmodule.exports = {\n  darkMode: "class",\n  // ... rest of config\n}\n```\n\nAnd toggle dark mode with a class on your html element:\n```js\ndocument.documentElement.classList.toggle("dark")\n```',
      },
    ],
    timestamp: new Date('2025-11-18T10:02:30'),
    provider: 'claude',
    tokens: 380,
    cost: 0.00114,
  },
];

export const MOCK_CHAT_SESSION: ChatSession = {
  id: 'session-001',
  title: 'Building a Button Component',
  messages: MOCK_MESSAGES,
  createdAt: new Date('2025-11-18T10:00:00'),
  updatedAt: new Date('2025-11-18T10:02:30'),
  provider: 'claude',
  totalTokens: 1650,
  totalCost: 0.00495,
};

export const MOCK_RESPONSES: Record<string, string> = {
  'hello': 'Hello! I\'m your AI coding assistant. I can help you build React components, debug code, explain concepts, and more. What would you like to work on?',
  'button': 'I can help you create a button component! Would you like a basic button, or one with variants, icons, and animations?',
  'help': 'I can assist with:\n• Creating React/Next.js components\n• Writing TypeScript code\n• Styling with TailwindCSS\n• Debugging issues\n• Explaining programming concepts\n• Reviewing code\n\nWhat do you need help with?',
  'dark mode': 'I\'ll help you implement dark mode using Tailwind CSS. We can use the `dark:` variant for styling...',
  'default': 'I understand you\'re asking about that. Let me help you with a solution...',
};
