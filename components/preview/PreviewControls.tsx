'use client';

import React, { useState } from 'react';
import ViewportToggle, {
  DeviceType,
  Orientation,
  DEVICE_CONFIGS,
} from './ViewportToggle';

interface PreviewControlsProps {
  device: DeviceType;
  orientation: Orientation;
  onDeviceChange: (device: DeviceType) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onRefresh: () => void;
  onOpenInNewTab: () => void;
  onCopyUrl: () => void;
  mockDataEnabled: boolean;
  onMockDataToggle: (enabled: boolean) => void;
  previewUrl?: string;
  className?: string;
}

export default function PreviewControls({
  device,
  orientation,
  onDeviceChange,
  onOrientationChange,
  onRefresh,
  onOpenInNewTab,
  onCopyUrl,
  mockDataEnabled,
  onMockDataToggle,
  previewUrl,
  className = '',
}: PreviewControlsProps) {
  const [urlCopied, setUrlCopied] = useState(false);

  const handleCopyUrl = async () => {
    await onCopyUrl();
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between ${className}`}
    >
      {/* Left Section: Viewport Controls */}
      <div className="flex items-center space-x-4">
        <ViewportToggle
          device={device}
          orientation={orientation}
          onDeviceChange={onDeviceChange}
          onOrientationChange={onOrientationChange}
        />
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Mock Data Toggle */}
        <button
          onClick={() => onMockDataToggle(!mockDataEnabled)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
            ${
              mockDataEnabled
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title="Toggle mock data"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span className="text-sm font-medium">
            {mockDataEnabled ? 'Mock Data: ON' : 'Mock Data: OFF'}
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        {/* Open in New Tab Button */}
        <button
          onClick={onOpenInNewTab}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Open in new tab"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>

        {/* Copy URL Button */}
        {previewUrl && (
          <button
            onClick={handleCopyUrl}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
              ${
                urlCopied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            title="Copy preview URL"
          >
            {urlCopied ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium">Copy URL</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
