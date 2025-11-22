'use client';

/**
 * ChatContainer Component
 * Main chat layout with fixed header, scrollable messages, and fixed input
 * Mobile-first responsive design
 */

import React, { useState } from 'react';
import { MessageSquare, Settings } from 'lucide-react';
import { AIProvider, Message } from '@/types/chat';
import { MOCK_MESSAGES, MOCK_RESPONSES } from '@/lib/mock/chatData';
import { useProjectStore } from '@/lib/stores/project-store';
import { useAuthStore } from '@/lib/stores/authStore';
import { useExport } from '@/hooks/useExport';
import { AI_AGENTS } from '@/lib/data/agents';
import AIProviderSelector from './AIProviderSelector';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { ExportButton, ExportModal } from '@/components/export';
import { SelectedAgentsDisplay } from '@/components/agents/SelectedAgentsDisplay';

interface ChatContainerProps {
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ className = '' }) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('claude');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Get active project and export functionality
  const { activeProject } = useProjectStore();
  const { exportProject, progress, isExporting } = useExport();

  // Get selected agents from auth store
  const { selectedAgents } = useAuthStore();

  // Check if message requests a component build
  const shouldGenerateComponent = (message: string): boolean => {
    const buildKeywords = ['create', 'build', 'make', 'generate', 'design'];
    const componentKeywords = ['button', 'form', 'card', 'component', 'modal', 'navbar', 'footer', 'login', 'signup', 'dashboard'];

    const lowerMessage = message.toLowerCase();
    return buildKeywords.some(k => lowerMessage.includes(k)) &&
           componentKeywords.some(k => lowerMessage.includes(k));
  };

  // Generate component code based on request
  const generateComponentCode = (request: string): { name: string; code: string } => {
    const lowerRequest = request.toLowerCase();

    if (lowerRequest.includes('button')) {
      return {
        name: 'ButtonComponent',
        code: `function ButtonComponent({ mockData = {} }) {
  return (
    <div className="p-8 space-y-4">
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
        Primary Button
      </button>
      <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
        Secondary Button
      </button>
      <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
        Outline Button
      </button>
    </div>
  );
}`
      };
    }

    if (lowerRequest.includes('login') || lowerRequest.includes('form')) {
      return {
        name: 'LoginForm',
        code: `function LoginForm({ mockData = {} }) {
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
}`
      };
    }

    if (lowerRequest.includes('card')) {
      return {
        name: 'CardComponent',
        code: `function CardComponent({ mockData = {} }) {
  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500" />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Product Title</h3>
          <p className="text-gray-600 mb-4">This is a beautiful card component with gradient header.</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">$99.99</span>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`
      };
    }

    // Default component
    return {
      name: 'CustomComponent',
      code: `function CustomComponent({ mockData = {} }) {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Component</h2>
        <p className="text-gray-600">Your custom component is ready to be customized!</p>
      </div>
    </div>
  );
}`
    };
  };

  // Generate mock AI response with agent context
  const generateMockResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();

    // Get selected agent objects
    const selectedAgentObjects = AI_AGENTS.filter(a => selectedAgents.includes(a.id));

    // Build agent context
    let agentContext = '';
    if (selectedAgentObjects.length > 0) {
      agentContext = `**Team working on this:**\n${selectedAgentObjects.map(a => `- ${a.name} (${a.role})`).join('\n')}\n\n`;
    }

    // Check for keywords
    for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
      if (lowercaseMessage.includes(keyword.toLowerCase())) {
        return agentContext + response;
      }
    }

    // Default response with agent context
    if (selectedAgentObjects.length > 0) {
      return agentContext + `Great! Our team is ready to help you build that. ${MOCK_RESPONSES.default}`;
    }

    return MOCK_RESPONSES.default;
  };

  // Handle sending a message
  const handleSendMessage = async (text: string, attachments?: File[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: [
        {
          type: 'text',
          text,
        },
        ...(attachments || []).map((file) => ({
          type: 'image' as const,
          imageUrl: URL.createObjectURL(file),
        })),
      ],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const shouldCreateComponent = shouldGenerateComponent(text);
      let artifact = undefined;
      let responseText = generateMockResponse(text);

      if (shouldCreateComponent) {
        const { name, code } = generateComponentCode(text);
        artifact = {
          type: 'component' as const,
          code,
          name,
          language: 'tsx' as const,
          version: 1,
        };
        responseText = `I've created a ${name} component for you:`;
      }

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: responseText,
          },
        ],
        timestamp: new Date(),
        provider: selectedProvider,
        tokens: Math.floor(Math.random() * 500) + 100,
        cost: Math.random() * 0.005,
        artifact,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle artifact edit requests
  const handleArtifactEdit = (messageId: string, editPrompt: string) => {
    // Find the message with the artifact
    const messageWithArtifact = messages.find(m => m.id === messageId);
    if (!messageWithArtifact?.artifact) return;

    // Add user edit message
    const userEditMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: [
        {
          type: 'text',
          text: editPrompt,
        },
      ],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userEditMessage]);
    setIsLoading(true);

    // Simulate AI processing edit
    setTimeout(() => {
      // Create updated artifact (in real implementation, this would actually modify the code)
      const updatedArtifact = {
        ...messageWithArtifact.artifact!,
        version: (messageWithArtifact.artifact!.version || 1) + 1,
      };

      const aiEditResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: `I've updated the ${messageWithArtifact.artifact!.name} based on your request:`,
          },
        ],
        timestamp: new Date(),
        provider: selectedProvider,
        tokens: Math.floor(Math.random() * 300) + 50,
        cost: Math.random() * 0.003,
        artifact: updatedArtifact,
      };

      setMessages((prev) => [...prev, aiEditResponse]);
      setIsLoading(false);
    }, 1200);
  };

  // Handle export
  const handleExport = async (options: any) => {
    if (!activeProject) {
      console.warn('No active project to export');
      return;
    }

    await exportProject(activeProject, options);
  };

  return (
    <div
      className={`flex flex-col h-screen max-h-screen bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Fixed Header */}
      <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                VibeCoding
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI Coding Assistant
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Export Button - Desktop */}
            <div className="hidden sm:block">
              <ExportButton
                onClick={() => setIsExportModalOpen(true)}
                disabled={!activeProject || isExporting}
                progress={progress}
                variant="outline"
                size="sm"
              />
            </div>

            {/* Settings Button */}
            <button
              className="flex items-center justify-center min-w-[40px] min-h-[40px] p-2
                       text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
                       hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                       transition-all active:scale-95"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Provider Selector */}
        <div className="px-4 pb-3 sm:px-6">
          <AIProviderSelector
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
          />
        </div>

        {/* Selected Agents Display */}
        <div className="px-4 pb-3 sm:px-6">
          <SelectedAgentsDisplay />
        </div>
      </header>

      {/* Scrollable Messages Area */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        className="flex-1"
        onArtifactEdit={handleArtifactEdit}
      />

      {/* Fixed Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        isLoading={isLoading}
        className="flex-shrink-0"
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        progress={progress}
        defaultProjectName={activeProject?.name || 'my-next-app'}
      />
    </div>
  );
};

export default ChatContainer;
