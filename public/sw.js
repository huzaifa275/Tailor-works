const CACHE_NAME = 'darzi-ledger-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

// Install Event - Pre-cache essential shells resiliently
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell');
      const cachePromises = ASSETS_TO_CACHE.map((asset) => {
        return cache.add(asset).catch((err) => {
          console.warn(`[Service Worker] Failed to pre-cache ${asset}:`, err);
        });
      });
      return Promise.all(cachePromises);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate strategy for offline support
self.addEventListener('fetch', (event) => {
  // Only handle local GET requests (skip external, API routes, or non-GET requests)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip hot-update (HMR) requests and dev-server specific calls
  if (event.request.url.includes('hot-update') || event.request.url.includes('@vite')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid standard responses
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for index/documents
            if (event.request.mode === 'navigate') {
              return cache.match('/');
            }
            return null;
          });

        // Return cached version immediately if available, otherwise wait for network
        return cachedResponse || fetchedResponse;
      });
    })
  );
});
