'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we're online
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      router.back();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <WifiOff className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {isOnline ? 'Connection Restored' : "You're Offline"}
          </h1>
          <p className="text-muted-foreground">
            {isOnline
              ? 'Your internet connection has been restored. You can now continue using VibeCode.'
              : 'No internet connection found. Some features may be limited.'}
          </p>
        </div>

        {!isOnline && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Cached Content Available
            </p>
            <p className="text-xs text-muted-foreground">
              You can still access previously loaded pages and chats while offline.
            </p>
          </div>
        )}

        <button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {isOnline ? 'Go Back' : 'Retry Connection'}
        </button>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Tips for offline usage:
          </p>
          <ul className="mt-2 text-xs text-muted-foreground space-y-1 text-left">
            <li>• Previously loaded chats are available</li>
            <li>• New messages require internet connection</li>
            <li>• Your drafts are saved locally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
