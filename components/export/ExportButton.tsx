'use client';

/**
 * ExportButton Component
 * Trigger button for exporting projects
 * Shows export progress and download states
 */

import React, { useState } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ExportProgress } from '@/lib/export/types';

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  progress?: ExportProgress | null;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  disabled = false,
  progress = null,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine button state
  const isExporting = progress && progress.stage !== 'complete' && progress.stage !== 'error';
  const isComplete = progress?.stage === 'complete';
  const isError = progress?.stage === 'error';

  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Icon size
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Get button content based on state
  const getButtonContent = () => {
    if (isError) {
      return (
        <>
          <AlertCircle size={iconSize[size]} />
          <span>Export Failed</span>
        </>
      );
    }

    if (isComplete) {
      return (
        <>
          <CheckCircle size={iconSize[size]} />
          <span>Exported!</span>
        </>
      );
    }

    if (isExporting) {
      return (
        <>
          <Loader2 size={iconSize[size]} className="animate-spin" />
          <span>{progress.message}</span>
        </>
      );
    }

    return (
      <>
        <Download
          size={iconSize[size]}
          className={isHovered ? 'animate-bounce' : ''}
        />
        <span>Export Project</span>
      </>
    );
  };

  // Button background based on state
  const getButtonStyle = () => {
    if (isError) {
      return 'bg-red-600 text-white hover:bg-red-700';
    }

    if (isComplete) {
      return 'bg-green-600 text-white hover:bg-green-700';
    }

    if (isExporting) {
      return 'bg-gray-400 text-white cursor-wait';
    }

    return variantStyles[variant];
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={onClick}
        disabled={disabled || isExporting}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          flex items-center gap-2 rounded-lg font-medium
          transition-all duration-200 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeStyles[size]}
          ${getButtonStyle()}
        `}
      >
        {getButtonContent()}
      </button>

      {/* Progress bar */}
      {isExporting && progress && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Floating Action Button variant for mobile
 */
export const ExportFAB: React.FC<{
  onClick: () => void;
  progress?: ExportProgress | null;
}> = ({ onClick, progress }) => {
  const isExporting = progress && progress.stage !== 'complete' && progress.stage !== 'error';

  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className="
        fixed bottom-20 right-4 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-gradient-to-r from-blue-600 to-purple-600
        text-white shadow-lg
        hover:shadow-xl hover:scale-110
        active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        sm:hidden
      "
      aria-label="Export Project"
    >
      {isExporting ? (
        <Loader2 size={24} className="animate-spin" />
      ) : (
        <Download size={24} />
      )}

      {/* Progress ring */}
      {isExporting && progress && (
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 56 56"
        >
          <circle
            cx="28"
            cy="28"
            r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          <circle
            cx="28"
            cy="28"
            r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress.progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
      )}
    </button>
  );
};

export default ExportButton;
