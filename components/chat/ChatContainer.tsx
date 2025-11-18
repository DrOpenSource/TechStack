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
import { useExport } from '@/hooks/useExport';
import AIProviderSelector from './AIProviderSelector';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { ExportButton, ExportModal } from '@/components/export';

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

  // Generate mock AI response
  const generateMockResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();

    // Check for keywords
    for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
      if (lowercaseMessage.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // Default response
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
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: generateMockResponse(text),
          },
        ],
        timestamp: new Date(),
        provider: selectedProvider,
        tokens: Math.floor(Math.random() * 500) + 100,
        cost: Math.random() * 0.005,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
      </header>

      {/* Scrollable Messages Area */}
      <MessageList messages={messages} isLoading={isLoading} className="flex-1" />

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
