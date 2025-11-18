'use client';

import React from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface ViewportSize {
  width: number;
  height: number;
}

interface DeviceConfig {
  name: string;
  icon: string;
  sizes: {
    portrait: ViewportSize;
    landscape: ViewportSize;
  };
}

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  mobile: {
    name: 'Mobile',
    icon: '📱',
    sizes: {
      portrait: { width: 375, height: 667 },
      landscape: { width: 667, height: 375 },
    },
  },
  tablet: {
    name: 'Tablet',
    icon: '📲',
    sizes: {
      portrait: { width: 768, height: 1024 },
      landscape: { width: 1024, height: 768 },
    },
  },
  desktop: {
    name: 'Desktop',
    icon: '🖥️',
    sizes: {
      portrait: { width: 1440, height: 900 },
      landscape: { width: 1440, height: 900 },
    },
  },
};

interface ViewportToggleProps {
  device: DeviceType;
  orientation: Orientation;
  onDeviceChange: (device: DeviceType) => void;
  onOrientationChange: (orientation: Orientation) => void;
  className?: string;
}

export default function ViewportToggle({
  device,
  orientation,
  onDeviceChange,
  onOrientationChange,
  className = '',
}: ViewportToggleProps) {
  const currentConfig = DEVICE_CONFIGS[device];
  const currentSize = currentConfig.sizes[orientation];

  const toggleOrientation = () => {
    onOrientationChange(orientation === 'portrait' ? 'landscape' : 'portrait');
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Device Selector */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(Object.keys(DEVICE_CONFIGS) as DeviceType[]).map((deviceType) => {
          const config = DEVICE_CONFIGS[deviceType];
          const isActive = device === deviceType;

          return (
            <button
              key={deviceType}
              onClick={() => onDeviceChange(deviceType)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md transition-all
                ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
              title={config.name}
            >
              <span className="text-lg">{config.icon}</span>
              <span className="font-medium">{config.name}</span>
            </button>
          );
        })}
      </div>

      {/* Orientation Toggle (Hidden for Desktop) */}
      {device !== 'desktop' && (
        <button
          onClick={toggleOrientation}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title={`Switch to ${orientation === 'portrait' ? 'landscape' : 'portrait'}`}
        >
          <svg
            className={`w-5 h-5 text-gray-700 transition-transform ${
              orientation === 'landscape' ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Rotate</span>
        </button>
      )}

      {/* Current Dimensions Display */}
      <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
        <svg
          className="w-4 h-4 text-gray-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
        <span className="text-sm font-mono text-gray-700">
          {currentSize.width} × {currentSize.height}
        </span>
      </div>

      {/* Orientation Indicator */}
      <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {orientation}
        </span>
      </div>
    </div>
  );
}
