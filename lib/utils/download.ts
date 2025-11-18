/**
 * Download Utilities
 * Helper functions for file downloads
 */

/**
 * Trigger a file download in the browser
 */
export function downloadFile(blob: Blob, filename: string): void {
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append to body (required for Firefox)
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Calculate download speed
 */
export function calculateDownloadSpeed(
  bytesDownloaded: number,
  timeElapsedMs: number
): string {
  const bytesPerSecond = (bytesDownloaded / timeElapsedMs) * 1000;
  return `${formatFileSize(bytesPerSecond)}/s`;
}

/**
 * Estimate time remaining
 */
export function estimateTimeRemaining(
  bytesRemaining: number,
  bytesPerSecond: number
): string {
  if (bytesPerSecond === 0) return 'Unknown';

  const secondsRemaining = bytesRemaining / bytesPerSecond;

  if (secondsRemaining < 60) {
    return `${Math.ceil(secondsRemaining)}s`;
  } else if (secondsRemaining < 3600) {
    return `${Math.ceil(secondsRemaining / 60)}m`;
  } else {
    return `${Math.ceil(secondsRemaining / 3600)}h`;
  }
}

/**
 * Check if browser supports downloads
 */
export function supportsDownload(): boolean {
  try {
    return (
      typeof document !== 'undefined' &&
      'createElement' in document &&
      'click' in HTMLAnchorElement.prototype
    );
  } catch {
    return false;
  }
}

/**
 * Download text as file
 */
export function downloadText(text: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([text], { type: mimeType });
  downloadFile(blob, filename);
}

/**
 * Download JSON as file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadText(json, filename, 'application/json');
}
