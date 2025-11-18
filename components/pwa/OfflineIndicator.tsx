'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // Hide indicator after 3 seconds when back online
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (!showIndicator) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-4">
      <div
        className={`max-w-md mx-auto rounded-lg shadow-lg p-3 ${
          isOnline
            ? 'bg-green-500/90 text-white'
            : 'bg-yellow-500/90 text-yellow-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {isOnline ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {isOnline ? 'Back Online' : "You're Offline"}
            </p>
            <p className="text-xs opacity-90">
              {isOnline
                ? 'Your connection has been restored'
                : 'Some features may be limited'}
            </p>
          </div>

          {!isOnline && (
            <button
              onClick={handleRetry}
              className="flex-shrink-0 p-1.5 rounded-md hover:bg-yellow-600/20 transition-colors"
              aria-label="Retry connection"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
