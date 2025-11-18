'use client';

/**
 * ExportModal Component
 * Configuration dialog for project export
 * Allows users to customize export options
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  FileCode,
  FileText,
  TestTube,
  Database,
  Loader2,
} from 'lucide-react';
import { ExportOptions, ExportProgress } from '@/lib/export/types';
import { formatFileSize } from '@/lib/utils/download';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  progress?: ExportProgress | null;
  defaultProjectName?: string;
  estimatedSize?: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  progress = null,
  defaultProjectName = 'my-next-app',
  estimatedSize = 0,
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    projectName: defaultProjectName,
    includeMockData: true,
    includeDocs: true,
    includeTests: false,
    typescript: true,
    format: 'zip',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset options when modal opens
  useEffect(() => {
    if (isOpen) {
      setOptions({
        projectName: defaultProjectName,
        includeMockData: true,
        includeDocs: true,
        includeTests: false,
        typescript: true,
        format: 'zip',
      });
      setErrors({});
    }
  }, [isOpen, defaultProjectName]);

  // Validate project name
  const validateProjectName = (name: string): boolean => {
    if (!name || name.trim().length === 0) {
      setErrors((prev) => ({ ...prev, projectName: 'Project name is required' }));
      return false;
    }

    if (!/^[a-zA-Z0-9-_ ]+$/.test(name)) {
      setErrors((prev) => ({
        ...prev,
        projectName: 'Project name can only contain letters, numbers, hyphens, and underscores',
      }));
      return false;
    }

    setErrors((prev) => {
      const { projectName, ...rest } = prev;
      return rest;
    });
    return true;
  };

  // Handle export
  const handleExport = () => {
    if (!validateProjectName(options.projectName)) {
      return;
    }

    onExport(options);
  };

  // Don't render if not open
  if (!isOpen) return null;

  const isExporting = !!(progress && progress.stage !== 'complete' && progress.stage !== 'error');
  const isComplete = progress?.stage === 'complete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
                   max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Export Project
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure your export settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400
                     dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
                     rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Progress State */}
          {isExporting && progress && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {progress.message}
                </span>
              </div>
              {progress.currentFile && (
                <p className="text-sm text-blue-700 dark:text-blue-300 ml-8">
                  {progress.currentFile}
                </p>
              )}
              <div className="mt-3 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Complete State */}
          {isComplete && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">
                  Export complete! Your download should start automatically.
                </span>
              </div>
            </div>
          )}

          {/* Project Name */}
          <div className="mb-6">
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={options.projectName}
              onChange={(e) => {
                setOptions({ ...options, projectName: e.target.value });
                validateProjectName(e.target.value);
              }}
              disabled={isExporting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                       rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="my-awesome-app"
            />
            {errors.projectName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.projectName}
              </p>
            )}
          </div>

          {/* Export Options */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Export Options
            </h3>

            {/* TypeScript */}
            <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={options.typescript}
                onChange={(e) =>
                  setOptions({ ...options, typescript: e.target.checked })
                }
                disabled={isExporting}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded
                         focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    TypeScript
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Use TypeScript for type-safe development
                </p>
              </div>
            </label>

            {/* Mock Data */}
            <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeMockData}
                onChange={(e) =>
                  setOptions({ ...options, includeMockData: e.target.checked })
                }
                disabled={isExporting}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded
                         focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Include Mock Data
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Include mock data for development and testing
                </p>
              </div>
            </label>

            {/* Documentation */}
            <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeDocs}
                onChange={(e) =>
                  setOptions({ ...options, includeDocs: e.target.checked })
                }
                disabled={isExporting}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded
                         focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Include Documentation
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Include README and setup instructions
                </p>
              </div>
            </label>

            {/* Tests */}
            <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeTests}
                onChange={(e) =>
                  setOptions({ ...options, includeTests: e.target.checked })
                }
                disabled={isExporting}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded
                         focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Include Tests
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Include Jest configuration and example tests
                </p>
              </div>
            </label>
          </div>

          {/* Export Format */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Format
            </h3>
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Format:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ZIP Archive
              </span>
              {estimatedSize > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ~{formatFileSize(estimatedSize)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200
                     dark:hover:bg-gray-700 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComplete ? 'Close' : 'Cancel'}
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting || isComplete}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600
                     to-purple-600 text-white font-medium rounded-lg hover:from-blue-700
                     hover:to-purple-700 transition-all active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : isComplete ? (
              <>
                <CheckCircle2 size={20} />
                <span>Exported</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span>Export Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
