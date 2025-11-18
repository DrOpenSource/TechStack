'use client';

/**
 * ExportPreview Component
 * Tree view of files to be exported with size indicators
 */

import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Eye,
  EyeOff,
} from 'lucide-react';
import { FileTreeNode } from '@/lib/export/types';
import { formatFileSize } from '@/lib/utils/download';

interface ExportPreviewProps {
  files: FileTreeNode[];
  onToggleFile?: (path: string, included: boolean) => void;
  className?: string;
}

export const ExportPreview: React.FC<ExportPreviewProps> = ({
  files,
  onToggleFile,
  className = '',
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['root'])
  );

  // Calculate total size and count
  const { totalSize, totalFiles, includedFiles } = useMemo(() => {
    let size = 0;
    let count = 0;
    let included = 0;

    const traverse = (nodes: FileTreeNode[]) => {
      nodes.forEach((node) => {
        if (node.type === 'file') {
          count++;
          if (node.included) {
            included++;
            size += node.size || 0;
          }
        } else if (node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(files);

    return { totalSize: size, totalFiles: count, includedFiles: included };
  }, [files]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderNode = (node: FileTreeNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const paddingLeft = depth * 20;

    if (node.type === 'directory') {
      return (
        <div key={node.path}>
          {/* Directory Header */}
          <div
            onClick={() => toggleFolder(node.path)}
            className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-lg transition-colors group"
            style={{ paddingLeft: `${paddingLeft + 12}px` }}
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen size={16} className="text-blue-500 flex-shrink-0" />
            ) : (
              <Folder size={16} className="text-blue-500 flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
              {node.name}
            </span>
          </div>

          {/* Directory Children */}
          {isExpanded && node.children && (
            <div className="ml-2">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File node
    return (
      <div
        key={node.path}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
          node.included
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'opacity-50 hover:bg-gray-50 dark:hover:bg-gray-900'
        }`}
        style={{ paddingLeft: `${paddingLeft + 28}px` }}
      >
        <File
          size={16}
          className={`flex-shrink-0 ${
            node.included ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
        <span
          className={`text-sm flex-1 ${
            node.included
              ? 'text-gray-700 dark:text-gray-300'
              : 'text-gray-400 line-through'
          }`}
        >
          {node.name}
        </span>
        {node.size !== undefined && (
          <span className="text-xs text-gray-500">
            {formatFileSize(node.size)}
          </span>
        )}
        {onToggleFile && (
          <button
            onClick={() => onToggleFile(node.path, !node.included)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label={node.included ? 'Exclude file' : 'Include file'}
          >
            {node.included ? (
              <Eye size={14} className="text-gray-600" />
            ) : (
              <EyeOff size={14} className="text-gray-400" />
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            File Structure Preview
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {includedFiles} of {totalFiles} files • {formatFileSize(totalSize)}
          </p>
        </div>
      </div>

      {/* File Tree */}
      <div className="max-h-96 overflow-y-auto p-2">
        {files.length > 0 ? (
          files.map((node) => renderNode(node, 0))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Folder size={48} className="mb-2 opacity-50" />
            <p className="text-sm">No files to preview</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Total Project Size
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {formatFileSize(totalSize)}
        </span>
      </div>
    </div>
  );
};

/**
 * Build file tree from flat file list
 */
export function buildFileTree(files: Array<{ path: string; content: string }>): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const map = new Map<string, FileTreeNode>();

  files.forEach((file) => {
    const parts = file.path.split('/');
    let currentPath = '';

    parts.forEach((part, index) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!map.has(currentPath)) {
        const isFile = index === parts.length - 1;
        const node: FileTreeNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'directory',
          size: isFile ? new Blob([file.content]).size : undefined,
          children: isFile ? undefined : [],
          included: true,
        };

        map.set(currentPath, node);

        if (parentPath) {
          const parent = map.get(parentPath);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        } else {
          root.push(node);
        }
      }
    });
  });

  return root;
}

export default ExportPreview;
