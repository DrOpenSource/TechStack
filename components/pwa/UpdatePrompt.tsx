'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Check for updates every 60 seconds
    const interval = setInterval(() => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.update();
      });
    }, 60000);

    // Listen for service worker updates
    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed and ready
              setRegistration(reg);
              setShowPrompt(true);
            }
          });
        }
      });
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setShowPrompt(true);
      }
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      // Fallback: just reload
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-4">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Update Available
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              A new version of VibeCode is available. Update now to get the latest features and improvements.
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Update Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
