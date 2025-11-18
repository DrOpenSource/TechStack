/**
 * PWA Utility Functions
 * Helper functions for Progressive Web App features
 */

/**
 * Register service worker
 * Call this in your app initialization (e.g., in a useEffect hook)
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 * Useful for testing or cleanup
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log('Service Worker unregistered:', success);
    return success;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Check if app is running in standalone mode (installed as PWA)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if the device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Check if the device is Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return /Android/.test(navigator.userAgent);
}

/**
 * Check if the browser supports PWA installation
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // iOS requires manual installation via Safari share menu
  if (isIOS()) {
    return !isPWAInstalled();
  }

  // Other browsers use beforeinstallprompt event
  return 'BeforeInstallPromptEvent' in window || isAndroid();
}

/**
 * Get online/offline status
 */
export function getOnlineStatus(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return navigator.onLine;
}

/**
 * Listen to online/offline events
 */
export function addOnlineListener(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Clear all caches
 * Useful for development or troubleshooting
 */
export async function clearAllCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

/**
 * Get app version from service worker
 */
export async function getAppVersion(): Promise<string> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return 'unknown';
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      // You can add version info to your service worker
      // For now, return a placeholder
      return '1.0.0';
    }
    return 'unknown';
  } catch (error) {
    console.error('Failed to get app version:', error);
    return 'unknown';
  }
}
