'use client';

import React, { useState, useCallback } from 'react';
import PreviewFrame from './PreviewFrame';
import PreviewControls from './PreviewControls';
import ComponentGallery, { ComponentItem } from './ComponentGallery';
import { DeviceType, Orientation, DEVICE_CONFIGS } from './ViewportToggle';

type ViewMode = 'split' | 'preview' | 'code';

interface PreviewContainerProps {
  components?: ComponentItem[];
  initialComponent?: ComponentItem;
  showGallery?: boolean;
  className?: string;
}

export default function PreviewContainer({
  components = [],
  initialComponent,
  showGallery = true,
  className = '',
}: PreviewContainerProps) {
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(
    initialComponent || null
  );
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [mockDataEnabled, setMockDataEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [refreshKey, setRefreshKey] = useState(0);
  const [codeEditorContent, setCodeEditorContent] = useState(
    selectedComponent?.code || ''
  );

  // Update code editor when component changes
  React.useEffect(() => {
    if (selectedComponent) {
      setCodeEditorContent(selectedComponent.code);
    }
  }, [selectedComponent]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleOpenInNewTab = useCallback(() => {
    if (!selectedComponent) return;
    // In a real implementation, this would open a new tab with the component
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(selectedComponent.code);
    }
  }, [selectedComponent]);

  const handleCopyUrl = useCallback(async () => {
    if (!selectedComponent) return;
    // In a real implementation, this would generate a shareable URL
    const url = `${window.location.origin}/preview/${selectedComponent.id}`;
    await navigator.clipboard.writeText(url);
  }, [selectedComponent]);

  const handleComponentEdit = useCallback((componentId: string) => {
    // In a real implementation, this would open an editor
    console.log('Edit component:', componentId);
  }, []);

  const handleComponentDelete = useCallback((componentId: string) => {
    // In a real implementation, this would delete the component
    console.log('Delete component:', componentId);
  }, []);

  const handleComponentDownload = useCallback((componentId: string) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    // Create download
    const blob = new Blob([component.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  }, [components]);

  const currentViewport = DEVICE_CONFIGS[device].sizes[orientation];

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${className}`}>
      {/* Controls */}
      <PreviewControls
        device={device}
        orientation={orientation}
        onDeviceChange={setDevice}
        onOrientationChange={setOrientation}
        onRefresh={handleRefresh}
        onOpenInNewTab={handleOpenInNewTab}
        onCopyUrl={handleCopyUrl}
        mockDataEnabled={mockDataEnabled}
        onMockDataToggle={setMockDataEnabled}
        previewUrl={
          selectedComponent
            ? `/preview/${selectedComponent.id}`
            : undefined
        }
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Gallery Sidebar */}
        {showGallery && (
          <div className="w-80 border-r border-gray-200 overflow-hidden">
            <ComponentGallery
              components={components}
              selectedComponentId={selectedComponent?.id}
              onComponentSelect={setSelectedComponent}
              onComponentEdit={handleComponentEdit}
              onComponentDelete={handleComponentDelete}
              onComponentDownload={handleComponentDownload}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* View Mode Selector */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('split')}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors
                  ${
                    viewMode === 'split'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4M15 4h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M9 4v16M15 4v16"
                  />
                </svg>
                <span className="text-sm font-medium">Split View</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors
                  ${
                    viewMode === 'preview'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-sm font-medium">Preview Only</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors
                  ${
                    viewMode === 'code'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span className="text-sm font-medium">Code Only</span>
              </button>
            </div>

            {selectedComponent && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{selectedComponent.name}</span>
              </div>
            )}
          </div>

          {/* Content Panels */}
          {!selectedComponent ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <svg
                  className="mx-auto w-20 h-20 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Component Selected
                </h3>
                <p className="text-gray-500">
                  Select a component from the gallery to preview
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden">
              {/* Code Editor Panel */}
              {(viewMode === 'split' || viewMode === 'code') && (
                <div
                  className={`
                    bg-gray-900 overflow-auto
                    ${viewMode === 'split' ? 'w-1/2' : 'w-full'}
                  `}
                >
                  <div className="p-4">
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                      <code>{codeEditorContent}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Preview Panel */}
              {(viewMode === 'split' || viewMode === 'preview') && (
                <div
                  className={`
                    overflow-auto
                    ${viewMode === 'split' ? 'w-1/2 border-l border-gray-200' : 'w-full'}
                  `}
                >
                  <PreviewFrame
                    key={refreshKey}
                    code={codeEditorContent}
                    mockData={mockDataEnabled ? {} : undefined}
                    viewport={currentViewport}
                    orientation={orientation}
                    onError={(error) => console.error('Preview error:', error)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
