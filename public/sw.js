// public/sw.js - AssetDoctor PWA Service Worker
const CACHE_NAME = 'assetdoctor-v2';
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

// 1. Service Worker Install - Pre-cache Static Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching App Shell & PWA Assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => console.warn('PWA Cache Add Error:', err));
    })
  );
  self.skipWaiting();
});

// 2. Activate Event - Clean Up Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing Old Cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event - Cache First, Network Fallback Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.log('[ServiceWorker] Offline fetch failed');
        return cachedResponse;
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
