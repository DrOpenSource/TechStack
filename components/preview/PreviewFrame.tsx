'use client';

import React, { useEffect, useRef, useState } from 'react';
import { renderPreview } from '@/lib/preview/previewRenderer';

interface PreviewFrameProps {
  code: string;
  mockData?: any;
  viewport: {
    width: number;
    height: number;
  };
  orientation: 'portrait' | 'landscape';
  onError?: (error: Error) => void;
  className?: string;
}

export default function PreviewFrame({
  code,
  mockData = {},
  viewport,
  orientation,
  onError,
  className = '',
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate HTML content with sandboxed environment
      const html = renderPreview(code, mockData);

      // Create blob URL for iframe
      const blob = new Blob([html], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);

      const iframe = iframeRef.current;
      iframe.src = blobUrl;

      // Clean up blob URL after loading
      iframe.onload = () => {
        setIsLoading(false);
        URL.revokeObjectURL(blobUrl);
      };

      // Listen for errors from iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'error') {
          const errorObj = new Error(event.data.message);
          setError(event.data.message);
          onError?.(errorObj);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
        URL.revokeObjectURL(blobUrl);
      };
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
      setIsLoading(false);
    }
  }, [code, mockData, onError]);

  // Calculate dimensions based on orientation
  const dimensions = orientation === 'portrait'
    ? { width: viewport.width, height: viewport.height }
    : { width: viewport.height, height: viewport.width };

  return (
    <div className={`relative flex items-center justify-center bg-gray-100 p-8 ${className}`}>
      {/* Device Frame */}
      <div
        className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {/* Device Bezel */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex items-center justify-center z-10">
          <div className="w-16 h-1 bg-gray-700 rounded-full" />
          <div className="w-2 h-2 bg-gray-700 rounded-full ml-2" />
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-20">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Loading preview...</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-20 p-6">
            <div className="bg-white border-2 border-red-500 rounded-lg p-6 max-w-md">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-red-800 font-semibold mb-2">Preview Error</h3>
                  <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                    {error}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Iframe */}
        <iframe
          ref={iframeRef}
          title="Component Preview"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
          style={{
            marginTop: '1.5rem',
            height: 'calc(100% - 1.5rem)',
          }}
        />
      </div>

      {/* Viewport Info Badge */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono">
        {dimensions.width} × {dimensions.height}
      </div>
    </div>
  );
}
