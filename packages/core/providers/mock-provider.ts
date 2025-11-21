/**
 * Mock Provider - Default AI provider with pattern-based responses
 */

import type {
  AIProvider,
  EnrichedContext,
  GeneratedCode,
  IntentAnalysis,
  UserRequest,
  Question,
} from '../types';

// ============================================================================
// Component Templates
// ============================================================================

const COMPONENT_TEMPLATES: Record<string, string> = {
  login_form: `import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Login:', { email, password });
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Sign In
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="#" className="text-blue-600 hover:underline font-medium">
          Sign up
        </a>
      </p>
    </motion.div>
  );
}`,

  button: `import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={\`\${variants[variant]} \${sizes[size]} rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2\`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}`,

  card: `import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description: string;
  image?: string;
  action?: () => void;
  className?: string;
}

export default function Card({
  title,
  description,
  image,
  action,
  className = '',
}: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={\`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer \${className}\`}
      onClick={action}
    >
      {image && (
        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>
    </motion.div>
  );
}`,

  dashboard: `import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$12,426', icon: DollarSign, change: '+12.5%', up: true },
    { label: 'Active Users', value: '2,543', icon: Users, change: '+8.2%', up: true },
    { label: 'Conversion Rate', value: '3.24%', icon: TrendingUp, change: '-2.1%', up: false },
    { label: 'Engagement', value: '89.2%', icon: Activity, change: '+5.4%', up: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className={\`text-sm font-medium \${stat.up ? 'text-green-600' : 'text-red-600'}\`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}`,
};

// ============================================================================
// Mock Provider Class
// ============================================================================

export class MockProvider implements AIProvider {
  name = 'mock';

  async generate(prompt: string, context: EnrichedContext): Promise<GeneratedCode> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const intent = context.intent.intent;
    const lowerPrompt = prompt.toLowerCase();

    // Select appropriate template
    let code: string;
    let componentName: string;

    if (intent === 'create_auth_form' || lowerPrompt.includes('login')) {
      code = COMPONENT_TEMPLATES.login_form;
      componentName = 'LoginForm';
    } else if (lowerPrompt.includes('dashboard')) {
      code = COMPONENT_TEMPLATES.dashboard;
      componentName = 'Dashboard';
    } else if (lowerPrompt.includes('card')) {
      code = COMPONENT_TEMPLATES.card;
      componentName = 'Card';
    } else if (lowerPrompt.includes('button')) {
      code = COMPONENT_TEMPLATES.button;
      componentName = 'Button';
    } else {
      // Default to button for demo
      code = COMPONENT_TEMPLATES.button;
      componentName = 'CustomComponent';
    }

    // Apply generation hints from context
    code = this.applyGenerationHints(code, context);

    return {
      component: componentName,
      code,
      language: 'typescript',
      framework: 'react',
      dependencies: ['framer-motion', 'lucide-react'],
      preview: true,
    };
  }

  async analyzeIntent(message: string, context: UserRequest): Promise<IntentAnalysis> {
    // Mock provider doesn't need to analyze - the ContextAnalyzer handles this
    throw new Error('Mock provider uses ContextAnalyzer for intent analysis');
  }

  async askQuestions(intent: IntentAnalysis): Promise<Question[]> {
    // Mock provider doesn't need to generate questions - the QuestionEngine handles this
    throw new Error('Mock provider uses QuestionEngine for question generation');
  }

  /**
   * Apply generation hints to code
   */
  private applyGenerationHints(code: string, context: EnrichedContext): string {
    let modifiedCode = code;

    for (const hint of context.generationHints) {
      const lowerHint = hint.toLowerCase();

      // Apply style hints
      if (lowerHint.includes('dark')) {
        modifiedCode = modifiedCode.replace(/bg-white/g, 'bg-gray-900');
        modifiedCode = modifiedCode.replace(/text-gray-900/g, 'text-white');
      }

      // Apply color hints
      if (lowerHint.includes('green')) {
        modifiedCode = modifiedCode.replace(/blue-600/g, 'green-600');
        modifiedCode = modifiedCode.replace(/blue-700/g, 'green-700');
      } else if (lowerHint.includes('purple')) {
        modifiedCode = modifiedCode.replace(/blue-600/g, 'purple-600');
        modifiedCode = modifiedCode.replace(/blue-700/g, 'purple-700');
      }
    }

    return modifiedCode;
  }
}

// ============================================================================
// Export
// ============================================================================

export const mockProvider = new MockProvider();
