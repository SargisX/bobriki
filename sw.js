const CACHE_NAME = 'bobriki-cache-v3'; // Update version to force refresh

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => 
      cache.addAll([
        './',  // Start URL
        'https://raw.githubusercontent.com/SargisX/bobriki/main/index.html',
        'https://raw.githubusercontent.com/SargisX/bobriki/main/public/manifest.json',
        'https://raw.githubusercontent.com/SargisX/bobriki/main/public/icon-192x192.png',
        'https://raw.githubusercontent.com/SargisX/bobriki/main/public/icon-512x512.png',
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
