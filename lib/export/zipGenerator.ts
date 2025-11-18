/**
 * ZIP Archive Generator
 * Creates ZIP files from project files using JSZip
 */

import JSZip from 'jszip';
import { ExportFile } from './types';

/**
 * Create a ZIP archive from file records
 */
export async function createZipArchive(
  files: Record<string, string | null>
): Promise<Blob> {
  const zip = new JSZip();

  // Add all files to the ZIP
  for (const [path, content] of Object.entries(files)) {
    if (content !== null && content !== undefined) {
      zip.file(path, content);
    }
  }

  // Generate the ZIP blob with compression
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9, // Maximum compression
    },
  });

  return blob;
}

/**
 * Create a ZIP archive from ExportFile array
 */
export async function createZipFromFiles(files: ExportFile[]): Promise<Blob> {
  const zip = new JSZip();

  // Add all files to the ZIP
  for (const file of files) {
    if (file.content) {
      zip.file(file.path, file.content);
    }
  }

  // Generate the ZIP blob with compression
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9,
    },
  });

  return blob;
}

/**
 * Calculate total size of files
 */
export function calculateTotalSize(files: ExportFile[]): number {
  return files.reduce((total, file) => total + file.size, 0);
}

/**
 * Estimate ZIP size (roughly 60-70% of original due to compression)
 */
export function estimateZipSize(totalSize: number): number {
  return Math.floor(totalSize * 0.65);
}

/**
 * Validate file path (prevent directory traversal)
 */
export function validateFilePath(path: string): boolean {
  // Prevent absolute paths and directory traversal
  if (path.startsWith('/') || path.startsWith('\\')) {
    return false;
  }

  if (path.includes('..')) {
    return false;
  }

  return true;
}

/**
 * Sanitize filename for safe ZIP creation
 */
export function sanitizeFilePath(path: string): string {
  // Remove leading/trailing slashes
  let sanitized = path.replace(/^[/\\]+/, '').replace(/[/\\]+$/, '');

  // Replace backslashes with forward slashes
  sanitized = sanitized.replace(/\\/g, '/');

  // Remove any .. patterns
  sanitized = sanitized.replace(/\.\./g, '');

  return sanitized;
}
