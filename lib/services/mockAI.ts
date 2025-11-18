/**
 * Mock AI Service
 * Simulates AI responses for development and testing
 */

import { MOCK_CONFIG } from '../mock/config';
import {
  delay,
  randomDelay,
  randomError,
  logMockRequest,
  streamText,
  createMockResponse,
  type MockResponse,
} from '../mock/utils';
import { matchPattern, type AIResponse } from '../mock/mockAIResponses';

/**
 * Message in conversation
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  components?: string[];
  codeSnippets?: Array<{
    language: string;
    code: string;
    filename?: string;
  }>;
}

/**
 * Conversation/Thread
 */
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mock AI Service Class
 */
export class MockAIService {
  private conversations: Map<string, Conversation> = new Map();
  private messageIdCounter = 0;

  constructor() {
    logMockRequest('MockAIService', 'constructor', { enabled: MOCK_CONFIG.enabled });
  }

  /**
   * Send a message and get response
   */
  async sendMessage(
    prompt: string,
    conversationId?: string,
    options?: {
      simulateError?: boolean;
      customDelay?: number;
    }
  ): Promise<MockResponse<Message>> {
    logMockRequest('MockAIService', 'sendMessage', { prompt, conversationId });

    try {
      // Simulate network delay
      await (options?.customDelay ? delay(options.customDelay) : randomDelay());

      // Simulate occasional errors (unless disabled)
      if (!options?.simulateError && MOCK_CONFIG.errorRate > 0) {
        randomError();
      }

      // Get or create conversation
      let conversation: Conversation;
      if (conversationId && this.conversations.has(conversationId)) {
        conversation = this.conversations.get(conversationId)!;
      } else {
        conversation = this.createConversation();
      }

      // Add user message
      const userMessage = this.createMessage('user', prompt);
      conversation.messages.push(userMessage);

      // Match pattern and generate response
      const aiResponse = matchPattern(prompt);
      const assistantMessage = this.createMessage(
        'assistant',
        aiResponse.response,
        {
          components: aiResponse.components,
          codeSnippets: aiResponse.codeSnippets,
        }
      );

      // Add assistant message
      conversation.messages.push(assistantMessage);
      conversation.updatedAt = new Date();

      // Update conversation title if it's the first message
      if (conversation.messages.length === 2) {
        conversation.title = this.generateTitle(prompt);
      }

      // Save conversation
      this.conversations.set(conversation.id, conversation);

      return createMockResponse(assistantMessage);
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'MOCK_AI_ERROR',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Stream a message response
   */
  async *streamMessage(
    prompt: string,
    conversationId?: string,
    options?: {
      customDelay?: number;
    }
  ): AsyncGenerator<string, void, unknown> {
    logMockRequest('MockAIService', 'streamMessage', { prompt, conversationId });

    // Simulate initial delay
    await (options?.customDelay ? delay(options.customDelay) : delay(MOCK_CONFIG.networkDelay));

    // Get or create conversation
    let conversation: Conversation;
    if (conversationId && this.conversations.has(conversationId)) {
      conversation = this.conversations.get(conversationId)!;
    } else {
      conversation = this.createConversation();
    }

    // Add user message
    const userMessage = this.createMessage('user', prompt);
    conversation.messages.push(userMessage);

    // Match pattern and get response
    const aiResponse = matchPattern(prompt);

    // Stream the response
    let fullResponse = '';
    for await (const chunk of streamText(aiResponse.response)) {
      fullResponse += chunk;
      yield chunk;
    }

    // Add complete assistant message
    const assistantMessage = this.createMessage('assistant', fullResponse, {
      components: aiResponse.components,
      codeSnippets: aiResponse.codeSnippets,
    });

    conversation.messages.push(assistantMessage);
    conversation.updatedAt = new Date();

    // Update conversation title if it's the first message
    if (conversation.messages.length === 2) {
      conversation.title = this.generateTitle(prompt);
    }

    // Save conversation
    this.conversations.set(conversation.id, conversation);
  }

  /**
   * Get conversation by ID
   */
  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) || null;
  }

  /**
   * Get all conversations
   */
  getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /**
   * Delete conversation
   */
  deleteConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  /**
   * Clear all conversations
   */
  clearAllConversations(): void {
    this.conversations.clear();
  }

  /**
   * Create a new conversation
   */
  private createConversation(): Conversation {
    const id = this.generateId();
    const conversation: Conversation = {
      id,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  /**
   * Create a message
   */
  private createMessage(
    role: Message['role'],
    content: string,
    extra?: {
      components?: string[];
      codeSnippets?: Array<{
        language: string;
        code: string;
        filename?: string;
      }>;
    }
  ): Message {
    return {
      id: `msg-${++this.messageIdCounter}`,
      role,
      content,
      timestamp: new Date(),
      ...extra,
    };
  }

  /**
   * Generate conversation title from first prompt
   */
  private generateTitle(prompt: string): string {
    // Take first 50 characters or first sentence
    const shortPrompt = prompt.split('.')[0] || prompt;
    return shortPrompt.length > 50
      ? shortPrompt.substring(0, 47) + '...'
      : shortPrompt;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Singleton instance
 */
let mockAIServiceInstance: MockAIService | null = null;

/**
 * Get MockAIService instance
 */
export const getMockAIService = (): MockAIService => {
  if (!mockAIServiceInstance) {
    mockAIServiceInstance = new MockAIService();
  }
  return mockAIServiceInstance;
};

/**
 * Helper function to send a quick message
 */
export const sendMockMessage = async (prompt: string): Promise<string> => {
  const service = getMockAIService();
  const response = await service.sendMessage(prompt);

  if (response.success && response.data) {
    return response.data.content;
  }

  throw new Error(response.error?.message || 'Failed to send message');
};

/**
 * Helper function to stream a message
 */
export const streamMockMessage = async function* (
  prompt: string
): AsyncGenerator<string, void, unknown> {
  const service = getMockAIService();
  yield* service.streamMessage(prompt);
};

/**
 * Code Generation Service
 */
export class MockCodeGenerationService {
  /**
   * Generate component code
   */
  async generateComponent(
    description: string,
    options?: {
      framework?: 'react' | 'vue' | 'svelte';
      typescript?: boolean;
      styling?: 'tailwind' | 'css' | 'styled-components';
    }
  ): Promise<MockResponse<{ code: string; filename: string }>> {
    logMockRequest('MockCodeGenerationService', 'generateComponent', {
      description,
      options,
    });

    await randomDelay();

    const framework = options?.framework || 'react';
    const typescript = options?.typescript !== false;
    const styling = options?.styling || 'tailwind';

    const ext = typescript ? 'tsx' : 'jsx';
    const filename = `Component.${ext}`;

    // Simple template-based generation
    const code = `import React from 'react';

${styling === 'styled-components' ? "import styled from 'styled-components';" : ''}

${typescript ? 'interface Props {\n  // Add props here\n}\n\n' : ''}export default function Component(${typescript ? 'props: Props' : 'props'}) {
  return (
    <div${styling === 'tailwind' ? ' className="container mx-auto p-4"' : ''}>
      <h1${styling === 'tailwind' ? ' className="text-2xl font-bold"' : ''}>
        ${description}
      </h1>
      {/* Component implementation */}
    </div>
  );
}`;

    return createMockResponse({ code, filename });
  }

  /**
   * Generate API route code
   */
  async generateAPIRoute(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    description: string
  ): Promise<MockResponse<{ code: string; filename: string }>> {
    logMockRequest('MockCodeGenerationService', 'generateAPIRoute', {
      endpoint,
      method,
      description,
    });

    await randomDelay();

    const filename = `route.ts`;
    const code = `import { NextRequest, NextResponse } from 'next/server';

/**
 * ${description}
 */
export async function ${method}(request: NextRequest) {
  try {
    // TODO: Implement ${method} ${endpoint}

    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}`;

    return createMockResponse({ code, filename });
  }
}

/**
 * Export singleton instance
 */
export const mockCodeGenService = new MockCodeGenerationService();
