'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa-utils';

/**
 * PWAManager - Initializes PWA features
 * Add this component to your root layout to enable PWA functionality
 */
export default function PWAManager() {
  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();

    // Log PWA status
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      console.log('PWA Status:', {
        installed: isStandalone,
        serviceWorkerSupported: 'serviceWorker' in navigator,
        online: navigator.onLine,
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
}
