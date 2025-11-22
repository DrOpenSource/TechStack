'use client';

/**
 * MessageList Component
 * Scrollable chat message display with auto-scroll
 * Renders user/AI messages, code blocks, and component previews
 */

import React, { useRef, useEffect } from 'react';
import { User, Bot, AlertCircle } from 'lucide-react';
import { Message } from '@/types/chat';
import CodeBlock from './CodeBlock';
import { motion } from 'framer-motion';
import { ComponentArtifact } from '@/components/artifacts/ComponentArtifact';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
  onArtifactEdit?: (messageId: string, prompt: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  className = '',
  onArtifactEdit,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 space-y-6 ${className}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.map((message, messageIndex) => {
        const isUser = message.role === 'user';
        const isSystem = message.role === 'system';

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: messageIndex * 0.05 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            {!isSystem && (
              <div
                className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {isUser ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
            )}

            {/* Message Content */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 max-w-[85%] sm:max-w-[75%]`}>
              {/* Message Bubble(s) */}
              <div className="space-y-3 w-full">
                {message.content.map((content, contentIndex) => {
                  // Text Content
                  if (content.type === 'text' && content.text) {
                    return (
                      <div
                        key={contentIndex}
                        className={`px-4 py-3 rounded-2xl whitespace-pre-wrap break-words ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                        }`}
                      >
                        {content.text}
                      </div>
                    );
                  }

                  // Code Block
                  if (content.type === 'code' && content.code) {
                    return (
                      <CodeBlock
                        key={contentIndex}
                        content={content.code}
                        className="w-full"
                      />
                    );
                  }

                  // Component Preview
                  if (content.type === 'component' && content.component) {
                    return (
                      <div
                        key={contentIndex}
                        className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Component Preview
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {content.component.componentName}
                        </div>
                        {content.component.previewUrl && (
                          <img
                            src={content.component.previewUrl}
                            alt={`Preview of ${content.component.componentName}`}
                            className="mt-2 rounded border border-gray-200 dark:border-gray-700"
                          />
                        )}
                      </div>
                    );
                  }

                  // Image
                  if (content.type === 'image' && content.imageUrl) {
                    return (
                      <div key={contentIndex} className="rounded-lg overflow-hidden">
                        <img
                          src={content.imageUrl}
                          alt="Attached image"
                          className="max-w-full h-auto"
                        />
                      </div>
                    );
                  }

                  // Error
                  if (content.type === 'error' && content.error) {
                    return (
                      <div
                        key={contentIndex}
                        className="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20
                                 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-900 dark:text-red-100">
                          {content.error}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Artifact Rendering */}
                {message.artifact && (
                  <ComponentArtifact
                    code={message.artifact.code}
                    componentName={message.artifact.name}
                    language={message.artifact.language}
                    version={message.artifact.version}
                    onEdit={onArtifactEdit ? (prompt) => onArtifactEdit(message.id, prompt) : undefined}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 mt-1 px-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(message.timestamp)}
                </span>
                {message.provider && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    • {message.provider}
                  </span>
                )}
                {message.tokens && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    • {message.tokens} tokens
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3"
        >
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>

          {/* Typing Animation */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll Anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
