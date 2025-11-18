/**
 * useExport Hook
 * Client-side hook for managing project export
 */

import { useState, useCallback } from 'react';
import { Project } from '@/lib/stores/project-store';
import { ExportOptions, ExportProgress } from '@/lib/export/types';
import { downloadFile } from '@/lib/utils/download';

interface UseExportReturn {
  exportProject: (project: Project, options: ExportOptions) => Promise<void>;
  progress: ExportProgress | null;
  isExporting: boolean;
  error: string | null;
  reset: () => void;
}

export function useExport(): UseExportReturn {
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportProject = useCallback(async (project: Project, options: ExportOptions) => {
    try {
      setIsExporting(true);
      setError(null);

      // Stage 1: Preparing
      setProgress({
        stage: 'preparing',
        progress: 0,
        message: 'Preparing export...',
      });

      await sleep(300);

      // Stage 2: Generating
      setProgress({
        stage: 'generating',
        progress: 20,
        message: 'Generating project files...',
      });

      await sleep(300);

      // Stage 3: Bundling
      setProgress({
        stage: 'bundling',
        progress: 60,
        message: 'Creating ZIP archive...',
      });

      // Call API to generate ZIP
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            id: project.id,
            name: project.name,
            description: project.description,
            files: project.files,
          },
          options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Stage 4: Downloading
      setProgress({
        stage: 'downloading',
        progress: 90,
        message: 'Downloading...',
      });

      // Get the blob from response
      const blob = await response.blob();

      // Download the file
      const filename = `${options.projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      downloadFile(blob, filename);

      // Stage 5: Complete
      setProgress({
        stage: 'complete',
        progress: 100,
        message: 'Export complete!',
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setProgress(null);
        setIsExporting(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      setProgress({
        stage: 'error',
        progress: 0,
        message: errorMessage,
      });
      setIsExporting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProgress(null);
    setIsExporting(false);
    setError(null);
  }, []);

  return {
    exportProject,
    progress,
    isExporting,
    error,
    reset,
  };
}

// Helper function
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
