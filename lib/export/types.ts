/**
 * Export System Types
 * TypeScript definitions for project export functionality
 */

import { Project } from '../stores/project-store';

export interface ExportOptions {
  projectName: string;
  includeMockData: boolean;
  includeDocs: boolean;
  includeTests: boolean;
  typescript: boolean;
  format: 'zip';
}

export interface ExportFile {
  path: string;
  content: string;
  size: number;
}

export interface ExportProgress {
  stage: 'preparing' | 'generating' | 'bundling' | 'downloading' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  currentFile?: string;
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  totalSize: number;
  fileCount: number;
  files: ExportFile[];
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeNode[];
  included: boolean;
}
