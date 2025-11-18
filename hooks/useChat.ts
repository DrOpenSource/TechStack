/**
 * useChat Hook
 * Custom hook for managing chat state and interactions
 */

import { useState, useCallback } from 'react';
import { Message, AIProvider, ChatSession } from '@/types/chat';
import { MOCK_RESPONSES } from '@/lib/mock/chatData';

interface UseChatOptions {
  initialMessages?: Message[];
  provider?: AIProvider;
  onError?: (error: Error) => void;
}

export const useChat = (options: UseChatOptions = {}) => {
  const {
    initialMessages = [],
    provider = 'claude',
    onError,
  } = options;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(provider);
  const [error, setError] = useState<string | null>(null);

  // Generate mock AI response
  const generateMockResponse = useCallback((userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();

    for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
      if (lowercaseMessage.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    return MOCK_RESPONSES.default;
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (text: string, attachments?: File[]) => {
      if (!text.trim() && (!attachments || attachments.length === 0)) {
        return;
      }

      try {
        setError(null);

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

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate AI response
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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        if (onError && err instanceof Error) {
          onError(err);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProvider, generateMockResponse, onError]
  );

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Retry last message
  const retryLastMessage = useCallback(() => {
    if (messages.length === 0) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === 'user');

    if (lastUserMessage) {
      const textContent = lastUserMessage.content.find((c) => c.type === 'text');
      if (textContent?.text) {
        // Remove last AI response if exists
        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          if (prev[lastIndex]?.role === 'assistant') {
            return prev.slice(0, -1);
          }
          return prev;
        });

        sendMessage(textContent.text);
      }
    }
  }, [messages, sendMessage]);

  // Calculate total tokens and cost
  const totalTokens = messages.reduce((sum, msg) => sum + (msg.tokens || 0), 0);
  const totalCost = messages.reduce((sum, msg) => sum + (msg.cost || 0), 0);

  return {
    messages,
    isLoading,
    error,
    selectedProvider,
    setSelectedProvider,
    sendMessage,
    clearChat,
    retryLastMessage,
    totalTokens,
    totalCost,
  };
};
