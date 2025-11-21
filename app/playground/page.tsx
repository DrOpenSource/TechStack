/**
 * Playground/Canvas Page
 * Interactive canvas for previewing and editing components with AI
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Eye,
  Sparkles,
  Send,
  Smartphone,
  Monitor,
  Tablet,
  RotateCw,
  X
} from 'lucide-react';
import PreviewFrame from '@/components/preview/PreviewFrame';
import { useAuthStore } from '@/lib/stores/authStore';
import { AI_AGENTS } from '@/lib/data/agents';

// Sample components for testing
const SAMPLE_COMPONENTS = [
  {
    id: 'button',
    name: 'Button Component',
    category: 'UI Elements',
    code: `function Component({ mockData = {} }) {
  return (
    <div className="p-8 space-y-4">
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Primary Button
      </button>
      <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
        Secondary Button
      </button>
      <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
        Outline Button
      </button>
    </div>
  );
}`,
  },
  {
    id: 'card',
    name: 'Card Component',
    category: 'UI Elements',
    code: `function Component({ mockData = {} }) {
  const { title = 'Product Title', price = '$99.99', description = 'This is a sample product description' } = mockData;

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500" />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">{price}</span>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'form',
    name: 'Login Form',
    category: 'Forms',
    code: `function Component({ mockData = {} }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600 mb-6">Sign in to your account</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'dashboard',
    name: 'Dashboard Stats',
    category: 'Data Display',
    code: `function Component({ mockData = {} }) {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+20%', color: 'text-green-600' },
    { label: 'Active Users', value: '2,345', change: '+12%', color: 'text-blue-600' },
    { label: 'New Orders', value: '182', change: '+8%', color: 'text-purple-600' },
    { label: 'Conversion Rate', value: '3.2%', change: '+5%', color: 'text-orange-600' },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className={\`text-sm font-semibold \${stat.color}\`}>{stat.change} from last month</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
];

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type ViewMode = 'preview' | 'split' | 'code';

export default function PlaygroundPage() {
  const { selectedAgents } = useAuthStore();
  const [selectedComponent, setSelectedComponent] = useState(SAMPLE_COMPONENTS[0]);
  const [code, setCode] = useState(SAMPLE_COMPONENTS[0].code);
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const selectedAgentObjects = AI_AGENTS.filter(a => selectedAgents.includes(a.id));

  const deviceDimensions = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
  };

  const handleComponentSelect = (component: typeof SAMPLE_COMPONENTS[0]) => {
    setSelectedComponent(component);
    setCode(component.code);
    setChatHistory([]);
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;

    const userPrompt = prompt.trim();
    setPrompt('');
    setIsProcessing(true);

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userPrompt }]);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate AI response
    const teamContext = selectedAgentObjects.length > 0
      ? `\n\n**Working on this with:**\n${selectedAgentObjects.map(a => `- ${a.name.split(' ')[0]} (${a.role})`).join('\n')}\n\n`
      : '';

    const aiResponse = `${teamContext}I'll help you modify this component. ${userPrompt.toLowerCase().includes('button') ? "I'll update the button styles to make them more modern." : "Let me enhance this component for you."}\n\n\`\`\`tsx\n${code}\n\`\`\`\n\nThe component has been updated! You can see the changes in the preview.`;

    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsProcessing(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Canvas Playground</h1>
            <p className="text-xs text-muted-foreground">
              Preview and edit components with AI
            </p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'code'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Component Selector Sidebar */}
        <div className="w-64 border-r border-border bg-card overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Sample Components
            </h2>
            <div className="space-y-1">
              {SAMPLE_COMPONENTS.map((component) => (
                <button
                  key={component.id}
                  onClick={() => handleComponentSelect(component)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedComponent.id === component.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="font-medium text-sm">{component.name}</div>
                  <div className="text-xs opacity-75">{component.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Area */}
          <div className={`${viewMode === 'code' ? 'hidden' : 'flex-1'} overflow-hidden bg-muted`}>
            <div className="h-full flex flex-col">
              {/* Device Controls */}
              <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDevice('mobile')}
                    className={`p-2 rounded ${device === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDevice('tablet')}
                    className={`p-2 rounded ${device === 'tablet' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDevice('desktop')}
                    className={`p-2 rounded ${device === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {deviceDimensions[device].width} × {deviceDimensions[device].height}
                </span>
              </div>

              {/* Preview Frame */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-8">
                <PreviewFrame
                  code={code}
                  mockData={{}}
                  viewport={deviceDimensions[device]}
                  orientation="portrait"
                />
              </div>
            </div>
          </div>

          {/* AI Chat Panel */}
          <div className={`${viewMode === 'preview' ? 'h-64' : viewMode === 'code' ? 'flex-1' : 'h-80'} border-t border-border bg-card flex flex-col`}>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Ask AI to modify the component</p>
                  <p className="text-xs mt-1">Try: &quot;Make the buttons larger&quot; or &quot;Change colors to purple&quot;</p>
                </div>
              ) : (
                <AnimatePresence>
                  {chatHistory.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-3 bg-background">
              <div className="flex items-end gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handlePromptSubmit();
                    }
                  }}
                  placeholder="Describe how you want to modify this component..."
                  rows={2}
                  className="flex-1 resize-none bg-card border border-input rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isProcessing}
                />
                <button
                  onClick={handlePromptSubmit}
                  disabled={!prompt.trim() || isProcessing}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {selectedAgentObjects.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Team:</span>
                  {selectedAgentObjects.slice(0, 3).map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-4 h-4 rounded-full"
                      />
                      <span>{agent.name.split(' ')[0]}</span>
                    </div>
                  ))}
                  {selectedAgentObjects.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{selectedAgentObjects.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
