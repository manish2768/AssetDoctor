// public/sw.js - AssetDoctor PWA Service Worker
const CACHE_NAME = 'v4-assetdoctor-vercel';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sitemap.xml',
  '/robots.txt',
  '/icon-192.png',
  '/icon-512.png',
  '/icon.svg',
  '/icons/assetdoctor-512.svg'
];

// 1. Service Worker Install - Immediate Cache Invalidation & Pre-cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker v3] Caching App Shell & PWA Assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => console.warn('PWA Cache Add Error:', err));
    })
  );
});

// 2. Activate Event - Force Discard Old Caches & Claim Clients Immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker v3] Discarding Stale Cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event - Network First with Cache Fallback for Fresh Deployments
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          console.log('[ServiceWorker v3] Offline fetch failed');
          return caches.match('/index.html');
        });
      })
  );
});

// 4. Push Notification Event Listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Warranty Expiry Alert ⚠️', body: 'One of your assets is expiring soon!' };
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
