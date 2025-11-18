'use client';

/**
 * ChatInput Component
 * Auto-expanding textarea with voice input, file attachments, and send button
 * Mobile keyboard optimized with character counter
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceInput from './VoiceInput';

interface ChatInputProps {
  onSendMessage: (text: string, attachments?: File[]) => void;
  onVoiceInput?: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onVoiceInput,
  placeholder = 'Type a message...',
  maxLength = 4000,
  disabled = false,
  isLoading = false,
  className = '',
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (text.trim() || attachments.length > 0) {
      onSendMessage(text.trim(), attachments);
      setText('');
      setAttachments([]);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText(transcript);
    setShowVoiceInput(false);
    if (onVoiceInput) {
      onVoiceInput(transcript);
    }
  };

  const canSend = (text.trim().length > 0 || attachments.length > 0) && !disabled && !isLoading;
  const charCount = text.length;
  const isNearLimit = charCount > maxLength * 0.8;

  return (
    <>
      <div className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${className}`}>
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pt-3 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20
                             border border-blue-200 dark:border-blue-800 rounded-lg"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-900 dark:text-blue-100 max-w-[150px] truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="flex items-end gap-2 p-4">
          {/* File Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="flex-shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] p-2
                     text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
                     hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                     transition-all active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              maxLength={maxLength}
              rows={1}
              className="w-full px-4 py-3 pr-16 rounded-lg resize-none
                       bg-gray-50 dark:bg-gray-800
                       border border-gray-300 dark:border-gray-600
                       text-gray-900 dark:text-gray-100
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all"
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />

            {/* Character Counter */}
            {isNearLimit && (
              <div className={`absolute bottom-2 right-2 text-xs font-medium ${
                charCount >= maxLength ? 'text-red-600' : 'text-gray-500'
              }`}>
                {charCount}/{maxLength}
              </div>
            )}
          </div>

          {/* Voice Input Button */}
          {!text.trim() && attachments.length === 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setShowVoiceInput(true)}
              disabled={disabled || isLoading}
              className="flex-shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] p-2
                       bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white rounded-full
                       transition-all active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Voice input"
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}

          {/* Send Button */}
          {(text.trim() || attachments.length > 0) && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleSend}
              disabled={!canSend}
              className="flex-shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] p-2
                       bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white rounded-full
                       transition-all active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Send message"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
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
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </div>

        {/* Mobile Keyboard Hint */}
        <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400 sm:hidden">
          Shift + Enter for new line
        </div>
      </div>

      {/* Voice Input Modal */}
      {showVoiceInput && (
        <VoiceInput
          onTranscript={handleVoiceTranscript}
          onCancel={() => setShowVoiceInput(false)}
        />
      )}
    </>
  );
};

export default ChatInput;
