# 📱 PWA Builder Skill

**Category:** Frontend
**Purpose:** Set up Progressive Web App capabilities

---

## 🎯 What This Skill Does

Transforms a web app into an installable, offline-capable PWA with:
- Service Worker for offline support
- Web App Manifest for installability
- Cache strategies
- Background sync
- Push notifications setup (foundation)

---

## 📝 Implementation Guide

### **1. Create Service Worker**

```javascript
// public/sw.js

const CACHE_NAME = 'app-v1';
const RUNTIME_CACHE = 'app-runtime';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/offline.html');
        });
      })
  );
});
```

### **2. Create Manifest**

```json
// public/manifest.json
{
  "name": "Your Application Name",
  "short_name": "App",
  "description": "Your application description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### **3. Register Service Worker**

```typescript
// lib/pwa.ts

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

// Call in _app.tsx or main entry point
// useEffect(() => {
//   registerServiceWorker();
// }, []);
```

### **4. Offline Storage**

```typescript
// lib/offlineQueue.ts

import localforage from 'localforage';

const queue = localforage.createInstance({
  name: 'app-offline-queue',
});

export const offlineQueue = {
  async add(type: string, data: any) {
    const items = (await queue.getItem<any[]>('queue')) || [];
    items.push({
      id: `${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
    });
    await queue.setItem('queue', items);
  },

  async getAll() {
    return (await queue.getItem<any[]>('queue')) || [];
  },

  async remove(id: string) {
    const items = await this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    await queue.setItem('queue', filtered);
  },

  async clear() {
    await queue.setItem('queue', []);
  },
};
```

---

## ✅ PWA Checklist

- [ ] Service worker registered
- [ ] Manifest.json created
- [ ] Icons generated (72, 192, 512px)
- [ ] Offline page created
- [ ] Cache strategy implemented
- [ ] Offline queue for sync
- [ ] Install prompt handled
- [ ] HTTPS enabled (required for PWA)
- [ ] Tested on mobile device
- [ ] Lighthouse PWA score >90

---

## 🎯 Used By Agents

- **frontend-dev** - Primary user
- **devops-agent** - Deployment configuration

---

**Skill Status:** ✅ Ready for Use
