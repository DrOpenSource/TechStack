'use client';

import { useEffect, useState, useRef } from 'react';
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

  // Track if we've called prompt() to satisfy Chrome's requirement
  const promptCalledRef = useRef(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

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

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();

      const promptEvent = e as BeforeInstallPromptEvent;
      deferredPromptRef.current = promptEvent;
      promptCalledRef.current = false; // Reset the flag
      setDeferredPrompt(promptEvent);

      // Show our custom banner immediately to ensure prompt() can be called
      // If we delay and user navigates, we violate Chrome's requirement
      setShowPrompt(true);
    };

    // Handle visibility changes - don't show prompt if page is hidden
    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') {
        // Page is hidden, hide the prompt UI
        setShowPrompt(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    document.addEventListener('visibilitychange', visibilityHandler);

    // For iOS, show custom prompt if not in standalone mode
    if (isIOSDevice && !isInStandaloneMode && !dismissed) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      document.removeEventListener('visibilitychange', visibilityHandler);

      // CRITICAL: If we called preventDefault() but never called prompt(),
      // we must call prompt() now to satisfy Chrome's requirement
      if (deferredPromptRef.current && !promptCalledRef.current) {
        console.log('Calling prompt() on cleanup to satisfy Chrome requirement');
        deferredPromptRef.current.prompt().catch((err) => {
          console.log('Prompt call in cleanup failed (expected):', err);
        });
        promptCalledRef.current = true;
      }

      deferredPromptRef.current = null;
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // Mark that we're calling prompt() to satisfy Chrome's requirement
      promptCalledRef.current = true;

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
      deferredPromptRef.current = null;
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');

    // We must call prompt() to satisfy Chrome's requirement even if user dismissed
    // This call may do nothing or fail, which is fine
    if (deferredPromptRef.current && !promptCalledRef.current) {
      promptCalledRef.current = true;
      deferredPromptRef.current.prompt().catch(() => {
        // Silently ignore - user dismissed our banner anyway
      });
    }

    // Clean up
    setDeferredPrompt(null);
    deferredPromptRef.current = null;
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
