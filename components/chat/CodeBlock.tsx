'use client';

/**
 * CodeBlock Component
 * Displays syntax-highlighted code with copy functionality
 * Mobile-optimized with horizontal scrolling and line numbers
 */

import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import { CodeContent } from '@/types/chat';

interface CodeBlockProps {
  content: CodeContent;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ content, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const { language, code, filename, highlightLines = [] } = content;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={`relative group ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-gray-400" />
          {filename && (
            <span className="text-sm font-mono text-gray-300">{filename}</span>
          )}
          {!filename && language && (
            <span className="text-sm font-mono text-gray-400">{language}</span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-sm font-medium transition-all
                     bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white
                     active:scale-95 min-h-[32px]"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto bg-gray-900 dark:bg-black rounded-b-lg">
        <pre className="p-4 text-sm sm:text-base">
          <code className="font-mono text-gray-100">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);

              return (
                <div
                  key={index}
                  className={`flex ${
                    isHighlighted
                      ? 'bg-blue-900/30 border-l-2 border-blue-500 -ml-4 pl-4'
                      : ''
                  }`}
                >
                  {/* Line Number */}
                  <span className="inline-block w-8 select-none text-gray-500 text-right mr-4 flex-shrink-0">
                    {lineNumber}
                  </span>

                  {/* Line Content */}
                  <span className="flex-1 whitespace-pre-wrap break-all sm:break-normal">
                    {line || '\n'}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Mobile-friendly scroll indicator */}
      <div className="absolute bottom-2 right-2 pointer-events-none sm:hidden">
        <div className="bg-gray-800/80 px-2 py-1 rounded text-xs text-gray-400">
          ← Scroll →
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
