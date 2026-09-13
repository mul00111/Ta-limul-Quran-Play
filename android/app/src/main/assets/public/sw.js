// Production Service Worker for Ta'limul Quran Play PWA
const CACHE_NAME = 'talimul-quran-play-v3';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching skipped for some resources:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING' || (event.data && event.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
  if (event.data === 'PURGE' || (event.data && event.data.type === 'PURGE')) {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
    self.registration.unregister();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // CRITICAL: NEVER intercept or cache development assets, Vite internals, or local dev server
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.includes('.vite') ||
    url.pathname.includes('@fs') ||
    url.searchParams.has('v') ||
    url.searchParams.has('t') ||
    url.hostname === 'localhost' ||
    url.hostname.includes('ais-dev') ||
    url.port === '3000'
  ) {
    return; // Pass directly to network
  }

  // Audio streams & external CDNs (cache first with network fallback for audio)
  if (url.hostname.includes('everyayah') || url.pathname.includes('audio')) {
    event.respondWith(
      caches.open('quran-audio-v1').then(async (audioCache) => {
        const cached = await audioCache.match(event.request);
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            audioCache.put(event.request, networkResponse.clone()).catch(() => {});
          }
          return networkResponse;
        }).catch(() => {
          return new Response('Audio unavailable offline', { status: 503 });
        });
      })
    );
    return;
  }

  // Other external CDNs / API calls
  if (
    url.pathname.startsWith('/api') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first / Stale-while-revalidate for static production assets only
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const toCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, toCache));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
