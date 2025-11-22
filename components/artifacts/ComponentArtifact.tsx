/**
 * ComponentArtifact
 * Inline artifact for displaying components in chat with code/canvas toggle
 */

'use client';

import { useState } from 'react';
import { Code, Eye, Smartphone, Tablet, Monitor, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewFrame from '@/components/preview/PreviewFrame';
import { cn } from '@/lib/utils/cn';

interface ComponentArtifactProps {
  code: string;
  componentName: string;
  language?: 'tsx' | 'jsx';
  version?: number;
  onEdit?: (prompt: string) => void;
  className?: string;
}

type ViewMode = 'canvas' | 'code';
type DeviceType = 'mobile' | 'tablet' | 'desktop';

const deviceDimensions = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
};

export function ComponentArtifact({
  code,
  componentName,
  language = 'tsx',
  version = 1,
  onEdit,
  className = '',
}: ComponentArtifactProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const handleEdit = () => {
    if (editPrompt.trim() && onEdit) {
      onEdit(editPrompt);
      setEditPrompt('');
      setIsEditMode(false);
    }
  };

  return (
    <div
      className={cn(
        'my-4 rounded-lg border border-border bg-card overflow-hidden shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-border bg-muted/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded">
            <Code className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {componentName}
            {version > 1 && (
              <span className="ml-2 text-xs text-muted-foreground">v{version}</span>
            )}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('canvas')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
              viewMode === 'canvas'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Canvas
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
              viewMode === 'code'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            <Code className="w-3.5 h-3.5" />
            Code
          </button>
          {onEdit && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                'ml-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
                isEditMode
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-primary/10'
              )}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'canvas' ? (
          <motion.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Device Controls */}
            <div className="border-b border-border bg-background/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDevice('mobile')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    device === 'mobile'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    device === 'tablet'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice('desktop')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    device === 'desktop'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  title="Desktop (1200px)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {deviceDimensions[device].width} × {deviceDimensions[device].height}
              </span>
            </div>

            {/* Preview */}
            <div className="bg-muted/30 p-4 overflow-x-auto">
              <div className="flex items-center justify-center min-h-[400px]">
                <PreviewFrame
                  code={code}
                  mockData={{}}
                  viewport={deviceDimensions[device]}
                  orientation="portrait"
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-gray-950 p-4 overflow-x-auto"
          >
            <pre className="text-sm">
              <code className="text-gray-100 font-mono">
                {code}
              </code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Mode */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-background overflow-hidden"
          >
            <div className="p-3 space-y-2">
              <label className="text-xs font-medium text-foreground">
                How should I modify this component?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEdit();
                    }
                  }}
                  placeholder="e.g., Make the buttons larger and blue"
                  className="flex-1 px-3 py-2 text-sm bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button
                  onClick={handleEdit}
                  disabled={!editPrompt.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
