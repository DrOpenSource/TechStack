'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Store the prompt globally to survive component unmounts
    let savedPrompt: BeforeInstallPromptEvent | null = null;

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();

      const promptEvent = e as BeforeInstallPromptEvent;
      savedPrompt = promptEvent;
      setDeferredPrompt(promptEvent);

      // Show prompt after 1 second (reduced from 3s for better UX)
      setTimeout(() => {
        // Only show if component is still mounted and page is visible
        if (document.visibilityState === 'visible') {
          setShowPrompt(true);
        }
      }, 1000);
    };

    // Handle visibility changes - don't show prompt if page is hidden
    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden' && savedPrompt) {
        // Page is hidden, reset the prompt state to avoid issues
        setShowPrompt(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    document.addEventListener('visibilitychange', visibilityHandler);

    // For iOS, show custom prompt if not in standalone mode
    if (isIOSDevice && !isInStandaloneMode && !dismissed) {
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          setShowPrompt(true);
        }
      }, 1000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      document.removeEventListener('visibilitychange', visibilityHandler);
      // Note: We can't "cancel" the beforeinstallprompt, but we clean up our handlers
      savedPrompt = null;
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    } finally {
      // Clean up
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Install VibeCode
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Add to your home screen for quick access and offline support
            </p>

            {isIOS ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Tap</span>
                  <Share className="w-4 h-4" />
                  <span>then &quot;Add to Home Screen&quot;</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            )}
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
