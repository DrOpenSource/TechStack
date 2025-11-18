# Quick Start: PWA & Theme System

## 30-Second Setup

The PWA and theme system are **already configured** and working! Here's what you can do immediately:

### 1. Add Theme Toggle to Any Page

```tsx
import { ThemeToggle } from '@/components/theme';

export default function MyPage() {
  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
      {/* your content */}
    </div>
  );
}
```

### 2. Use Theme in Your Components

```tsx
import { useTheme } from '@/components/theme';

export default function MyComponent() {
  const { theme, effectiveTheme, setTheme } = useTheme();

  return (
    <div className="bg-background text-foreground">
      <p>Current theme: {effectiveTheme}</p>
    </div>
  );
}
```

### 3. Test PWA Features

```bash
# Build and run in production mode
npm run build
npm start

# Open http://localhost:3000
# Check for install prompt
# Test offline mode in DevTools
```

---

## What's Already Working

### PWA Features (Auto-Enabled)

- ✅ Install prompt appears automatically
- ✅ Offline indicator shows when disconnected
- ✅ Update prompt appears when new version available
- ✅ Service worker caches pages for offline use
- ✅ Offline page shows when completely offline

### Theme Features (Auto-Enabled)

- ✅ ThemeProvider wraps your entire app
- ✅ Theme persists in localStorage
- ✅ Syncs with system preferences
- ✅ Smooth transitions between themes
- ✅ Dynamic meta theme-color tag

---

## File Locations

### Components You Can Import

```tsx
// PWA Components
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import UpdatePrompt from '@/components/pwa/UpdatePrompt';
import PWAManager from '@/components/pwa/PWAManager';

// Theme Components
import { ThemeProvider, useTheme } from '@/components/theme';
import ThemeToggle from '@/components/theme/ThemeToggle';

// PWA Utilities
import {
  registerServiceWorker,
  isPWAInstalled,
  isIOS,
  isAndroid,
  getOnlineStatus,
} from '@/lib/pwa-utils';
```

### Configuration Files

- `/public/manifest.json` - PWA manifest
- `/public/sw.js` - Service worker
- `/app/globals.css` - Theme CSS variables
- `/app/layout.tsx` - Root layout with PWA & theme
- `/next.config.js` - Next.js config

---

## Common Use Cases

### Use Case 1: Add Theme Toggle to Header

```tsx
// components/Header.tsx
import { ThemeToggle } from '@/components/theme';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-card">
      <h1 className="text-xl font-bold">VibeCode</h1>
      <ThemeToggle />
    </header>
  );
}
```

### Use Case 2: Check if User is Offline

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getOnlineStatus, addOnlineListener } from '@/lib/pwa-utils';

export default function MyComponent() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(getOnlineStatus());

    const cleanup = addOnlineListener(
      () => setIsOnline(true),
      () => setIsOnline(false)
    );

    return cleanup;
  }, []);

  return (
    <div>
      {!isOnline && <p>You are offline!</p>}
    </div>
  );
}
```

### Use Case 3: Style Based on Theme

```tsx
import { useTheme } from '@/components/theme';

export default function ThemedCard() {
  const { effectiveTheme } = useTheme();

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h2 className="text-foreground">Card Title</h2>
      <p className="text-muted-foreground">
        Currently in {effectiveTheme} mode
      </p>
    </div>
  );
}
```

### Use Case 4: Custom Install Button

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
      console.log('Installed!');
    }
    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <button onClick={handleInstall} className="btn-primary">
      <Download className="w-4 h-4 mr-2" />
      Install App
    </button>
  );
}
```

---

## CSS Classes Available

### Theme-Aware Classes

All Tailwind classes work with dark mode automatically:

```tsx
<div className="bg-background text-foreground">
  Light/dark aware background and text
</div>

<div className="bg-card border-border">
  Card with theme-aware border
</div>

<button className="bg-primary text-primary-foreground">
  Primary button
</button>

<p className="text-muted-foreground">
  Muted text color
</p>
```

### Custom CSS Variables

Available in your CSS:

```css
/* Use these anywhere */
background-color: hsl(var(--background));
color: hsl(var(--foreground));
border-color: hsl(var(--border));

/* Primary colors */
background-color: hsl(var(--primary));
color: hsl(var(--primary-foreground));

/* Muted colors */
background-color: hsl(var(--muted));
color: hsl(var(--muted-foreground));
```

---

## Testing Checklist

### PWA Testing

- [ ] Run `npm run build && npm start`
- [ ] Open in Chrome/Edge
- [ ] See install prompt appear
- [ ] Click install and verify it works
- [ ] Go offline in DevTools Network tab
- [ ] Navigate between pages (should work)
- [ ] Visit new page (should show offline page)
- [ ] Go back online (should see indicator)

### Theme Testing

- [ ] Add ThemeToggle to a page
- [ ] Switch to dark mode (should animate)
- [ ] Switch to light mode (should animate)
- [ ] Switch to system mode
- [ ] Close and reopen browser (theme should persist)
- [ ] Change OS theme (app should follow in system mode)

### Mobile Testing

- [ ] Deploy to production (Vercel/Netlify/etc)
- [ ] Open on mobile device
- [ ] Try to install (Android: prompt, iOS: share menu)
- [ ] Test offline mode
- [ ] Test theme switching
- [ ] Check safe area insets

---

## Customization

### Change Theme Colors

Edit `/app/globals.css`:

```css
:root {
  --primary: 238.7 83.5% 66.7%; /* Your light mode primary color */
}

.dark {
  --primary: 238.7 83.5% 66.7%; /* Your dark mode primary color */
}
```

### Change App Name/Colors

Edit `/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "YourApp",
  "theme_color": "#yourcolor",
  "background_color": "#yourcolor"
}
```

### Add More Routes to Cache

Edit `/public/sw.js`:

```js
const urlsToCache = [
  '/',
  '/login',
  '/dashboard',
  '/your-route', // Add your routes
];
```

---

## Optional: Advanced Features

### Install next-pwa (Optional)

```bash
npm install next-pwa
```

Then uncomment in `/next.config.js`.

### Install Zustand for Theme (Optional)

```bash
npm install zustand
```

Then uncomment in `/lib/stores/themeStore.ts`.

---

## Need More Help?

- 📚 **Full Documentation**: `/lib/PWA_THEME_README.md`
- 📋 **Implementation Details**: `/PWA_THEME_IMPLEMENTATION.md`
- 🛠️ **Component Source**: `/components/pwa/` and `/components/theme/`
- 🔧 **Utilities**: `/lib/pwa-utils.ts`

---

## That's It!

The PWA and theme system are ready to use. Just import the components and start building!

```tsx
// Example: Complete page with theme toggle
import { ThemeToggle } from '@/components/theme';

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b border-border">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">
            VibeCode
          </h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="p-4">
        <h2 className="text-xl text-foreground">Welcome!</h2>
        <p className="text-muted-foreground">
          PWA and theme system ready to use.
        </p>
      </main>
    </div>
  );
}
```

Happy coding! 🚀
