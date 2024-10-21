const CACHE_NAME = 'bobriki-cache-v3'; // Update version to force refresh

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => 
      cache.addAll([
        './bobriki',  // Start URL
        '/bobriki/index.html',
        '/bobriki/favicon.ico',
        '/bobriki/manifest.json',
        '/bobriki/icon-192x192.png',
        '/bobriki/icon-512x512.png',
      ])
    )
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => 
      response || fetch(event.request)
    )
  );
});
