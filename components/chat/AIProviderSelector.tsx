'use client';

/**
 * AIProviderSelector Component
 * Dropdown for selecting AI provider (Claude, Gemini, Mock)
 * Shows provider status, cost, and availability
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Circle, DollarSign, Zap } from 'lucide-react';
import { AIProvider, AIProviderConfig } from '@/types/chat';
import { AI_PROVIDERS } from '@/lib/mock/chatData';
import { motion, AnimatePresence } from 'framer-motion';

interface AIProviderSelectorProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  className?: string;
}

export const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = AI_PROVIDERS.find((p) => p.id === selectedProvider) || AI_PROVIDERS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatCost = (costPerToken: number) => {
    if (costPerToken === 0) return 'Free';
    const per1kTokens = (costPerToken * 1000).toFixed(4);
    return `$${per1kTokens}/1k`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 w-full min-h-[44px] px-4 py-2
                   bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                   rounded-lg hover:border-blue-500 dark:hover:border-blue-400
                   transition-all active:scale-[0.98]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        aria-label="Select AI provider"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-1">
          {/* Provider Icon */}
          <span className="text-lg flex-shrink-0">{selected.icon}</span>

          {/* Provider Name */}
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate w-full">
              {selected.name}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {/* Status Indicator */}
              <Circle
                className={`w-2 h-2 ${
                  selected.available
                    ? 'fill-green-500 text-green-500'
                    : 'fill-red-500 text-red-500'
                }`}
              />
              {/* Cost */}
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {formatCost(selected.costPerToken)}
              </span>
            </div>
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50
                       bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                       rounded-lg shadow-lg overflow-hidden"
          >
            {AI_PROVIDERS.map((provider) => {
              const isSelected = provider.id === selectedProvider;

              return (
                <button
                  key={provider.id}
                  onClick={() => {
                    onProviderChange(provider.id);
                    setIsOpen(false);
                  }}
                  disabled={!provider.available}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left
                             transition-colors min-h-[56px]
                             ${
                               isSelected
                                 ? 'bg-blue-50 dark:bg-blue-900/20'
                                 : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                             }
                             ${
                               !provider.available
                                 ? 'opacity-50 cursor-not-allowed'
                                 : 'cursor-pointer'
                             }
                             border-b border-gray-200 dark:border-gray-700 last:border-b-0`}
                >
                  {/* Check Icon (for selected) */}
                  <div className="flex-shrink-0 w-5 pt-0.5">
                    {isSelected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </div>

                  {/* Provider Icon */}
                  <span className="text-xl flex-shrink-0">{provider.icon}</span>

                  {/* Provider Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {provider.name}
                      </span>
                      {!provider.available && (
                        <span className="text-xs text-red-600 dark:text-red-400">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {provider.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {/* Cost */}
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatCost(provider.costPerToken)}
                      </span>
                      {/* Max Tokens */}
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {(provider.maxTokens / 1000).toFixed(0)}k tokens
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIProviderSelector;
