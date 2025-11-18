# PWA & Theme System Documentation

This document explains how to use the Progressive Web App (PWA) features and theme system in VibeCode.

## Table of Contents

1. [PWA Features](#pwa-features)
2. [Theme System](#theme-system)
3. [Installation](#installation)
4. [Usage Examples](#usage-examples)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)

---

## PWA Features

### What's Included

The PWA implementation includes:

- **Installability**: Users can install VibeCode on their device
- **Offline Support**: App works without internet connection
- **Service Worker**: Caches assets for faster loading
- **Update Notifications**: Users are notified when a new version is available
- **Install Prompt**: Smart banner prompts users to install the app
- **Offline Indicator**: Shows connection status

### Components

#### 1. InstallPrompt

Displays a banner prompting users to install the app on their home screen.

```tsx
import { InstallPrompt } from '@/components/pwa';

// Already included in root layout
// Shows automatically when app is installable
```

Features:
- Auto-detects if app is installable
- Platform-specific instructions (iOS vs Android)
- Dismissible with localStorage persistence
- Shows app icon and branding

#### 2. OfflineIndicator

Shows banner when the user goes offline or comes back online.

```tsx
import { OfflineIndicator } from '@/components/pwa';

// Already included in root layout
// Automatically detects online/offline status
```

Features:
- Network status detection
- Retry connection button
- Auto-hides when back online
- Visual feedback for offline state

#### 3. UpdatePrompt

Notifies users when a new version of the app is available.

```tsx
import { UpdatePrompt } from '@/components/pwa';

// Already included in root layout
// Checks for updates every 60 seconds
```

Features:
- Automatic update detection
- One-click update
- Service worker skip waiting
- Graceful reload

### Service Worker

The service worker (`public/sw.js`) provides:

- **Cache Strategy**: Network-first with cache fallback
- **Offline Page**: Shows `/offline` when completely offline
- **Runtime Caching**: Caches pages as you navigate
- **Cache Cleanup**: Removes old caches on update

Cache names:
- `vibecode-v1`: Static assets
- `vibecode-runtime`: Dynamic pages

### Offline Page

Located at `/offline`, this page:
- Shows friendly offline message
- Provides retry button
- Lists cached content
- Works without network

### PWA Utilities

Use helper functions from `lib/pwa-utils.ts`:

```tsx
import {
  registerServiceWorker,
  isPWAInstalled,
  isIOS,
  isAndroid,
  canInstallPWA,
  getOnlineStatus,
  addOnlineListener,
  clearAllCaches,
} from '@/lib/pwa-utils';

// Register service worker
registerServiceWorker();

// Check if installed
if (isPWAInstalled()) {
  console.log('Running as installed PWA');
}

// Listen to network changes
const cleanup = addOnlineListener(
  () => console.log('Online'),
  () => console.log('Offline')
);
```

---

## Theme System

### What's Included

The theme system provides:

- **Three Modes**: Light, Dark, and System (auto)
- **Smooth Transitions**: Animated theme switching
- **Persistence**: Saves user preference to localStorage
- **System Sync**: Follows OS theme preference when set to "System"
- **Meta Tag Updates**: Dynamic theme-color meta tag

### Components

#### 1. ThemeProvider

Wraps your app and provides theme context.

```tsx
import { ThemeProvider } from '@/components/theme';

// Already included in root layout
<ThemeProvider defaultTheme="system">
  {children}
</ThemeProvider>
```

#### 2. ThemeToggle

A dropdown button to switch between themes.

```tsx
import { ThemeToggle } from '@/components/theme';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

Features:
- Light mode (Sun icon)
- Dark mode (Moon icon)
- System mode (Monitor icon)
- Shows current effective theme
- Dropdown menu

#### 3. useTheme Hook

Access theme state in any component.

```tsx
import { useTheme } from '@/components/theme';

function MyComponent() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Effective theme: {effectiveTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### CSS Variables

The theme system uses CSS custom properties defined in `app/globals.css`:

Light mode:
```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 238.7 83.5% 66.7%;
/* ... more variables */
```

Dark mode:
```css
--background: 224 71% 4%;
--foreground: 213 31% 91%;
--primary: 238.7 83.5% 66.7%;
/* ... more variables */
```

### Alternative: Zustand Store

If you prefer Zustand over Context API:

1. Install Zustand:
   ```bash
   npm install zustand
   ```

2. Uncomment code in `lib/stores/themeStore.ts`

3. Use the hook:
   ```tsx
   import { useTheme } from '@/lib/stores/themeStore';

   function MyComponent() {
     const { theme, setTheme, effectiveTheme } = useTheme();
     // ... same API as context
   }
   ```

---

## Installation

### Prerequisites

The PWA and theme features work out of the box. Optional enhancements:

#### Optional: next-pwa Plugin

For advanced PWA features, install next-pwa:

```bash
npm install next-pwa
```

Then uncomment the configuration in `next.config.js`:

```js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
```

#### Optional: Zustand for Theme Store

If you prefer Zustand for theme management:

```bash
npm install zustand
```

Then uncomment code in `lib/stores/themeStore.ts`.

---

## Usage Examples

### Example 1: Custom Install Button

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function CustomInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('App installed');
    }

    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <button onClick={handleInstall}>
      <Download className="w-4 h-4" />
      Install App
    </button>
  );
}
```

### Example 2: Theme-Aware Component

```tsx
'use client';

import { useTheme } from '@/components/theme';
import { Sun, Moon } from 'lucide-react';

export default function ThemedComponent() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <div className="p-4 bg-card rounded-lg">
      <h2 className="text-foreground">Current Theme</h2>
      <p className="text-muted-foreground">
        Theme setting: {theme}
      </p>
      <p className="text-muted-foreground">
        Active theme: {effectiveTheme}
      </p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setTheme('light')}
          className="p-2 bg-background rounded"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="p-2 bg-background rounded"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```

### Example 3: Offline-First Data Loading

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getOnlineStatus } from '@/lib/pwa-utils';

export default function DataComponent() {
  const [data, setData] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const loadData = async () => {
      try {
        // Try network first
        const response = await fetch('/api/data');
        const json = await response.json();
        setData(json);

        // Cache for offline use
        localStorage.setItem('cached-data', JSON.stringify(json));
      } catch (error) {
        // Fallback to cached data
        const cached = localStorage.getItem('cached-data');
        if (cached) {
          setData(JSON.parse(cached));
        }
      }
    };

    loadData();

    // Listen for network changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      {!isOnline && (
        <p className="text-yellow-600">Showing cached data (offline)</p>
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

---

## Configuration

### Manifest Configuration

Edit `public/manifest.json` to customize:

```json
{
  "name": "Your App Name",
  "short_name": "YourApp",
  "description": "Your app description",
  "theme_color": "#your-color",
  "background_color": "#your-color",
  "icons": [...]
}
```

### Service Worker Configuration

Edit `public/sw.js` to customize caching:

```js
const CACHE_NAME = 'your-app-v1';
const urlsToCache = [
  '/',
  '/your-route',
  '/another-route',
];
```

### Theme Colors

Edit `app/globals.css` to customize theme colors:

```css
:root {
  --primary: your-color;
  --background: your-color;
  /* ... more variables */
}

.dark {
  --primary: your-dark-color;
  --background: your-dark-color;
  /* ... more variables */
}
```

---

## Troubleshooting

### PWA Not Installing

1. **Check HTTPS**: PWAs require HTTPS (except localhost)
2. **Check manifest**: Ensure `manifest.json` is valid
3. **Check service worker**: Open DevTools > Application > Service Workers
4. **Clear cache**: Try clearing browser cache and service workers

### Service Worker Not Updating

1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Unregister**: Use `unregisterServiceWorker()` from pwa-utils
3. **Clear cache**: Use `clearAllCaches()` from pwa-utils
4. **Check console**: Look for errors in DevTools console

### Theme Not Persisting

1. **Check localStorage**: Open DevTools > Application > Local Storage
2. **Check for errors**: Look for errors in console
3. **Clear storage**: Clear localStorage and try again

### Offline Page Not Showing

1. **Check service worker**: Ensure SW is registered
2. **Check cache**: Verify `/offline` is in cache
3. **Test offline**: Use DevTools > Network > Offline checkbox

### iOS Installation Issues

iOS requires manual installation:
1. Open in Safari (not Chrome or other browsers)
2. Tap Share button
3. Tap "Add to Home Screen"

### Development Tips

- **Disable PWA in dev**: The service worker is disabled in development mode (when using next-pwa)
- **Test offline**: Use Chrome DevTools Network tab to simulate offline
- **Clear caches**: Regularly clear caches during development
- **Check updates**: Service worker checks for updates every 60 seconds

---

## Testing

### Test PWA Features

1. **Lighthouse**: Run Lighthouse audit in Chrome DevTools
2. **PWA Builder**: Use https://www.pwabuilder.com/ to validate
3. **Mobile Testing**: Test on actual mobile devices

### Test Theme System

1. **All modes**: Test light, dark, and system modes
2. **System changes**: Change OS theme while app is open
3. **Persistence**: Close and reopen app to check saved preference
4. **Transitions**: Check smooth theme transitions

### Browser Support

- **Chrome/Edge**: Full PWA support
- **Safari (iOS)**: Requires manual installation, limited features
- **Firefox**: Full PWA support
- **Samsung Internet**: Full PWA support

---

## Resources

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - PWA](https://web.dev/progressive-web-apps/)
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## License

Part of the VibeCode project.
