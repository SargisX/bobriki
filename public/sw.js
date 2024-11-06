// Service Worker code

const cacheKey = "cache-v1";

// Function to initialize cache
const initCache = () => {
  return caches.open(cacheKey).then((cache) => {
    return cache.addAll([
      '/bobriki/',                // Root of your site on GitHub Pages
      '/bobriki/index.html',      // Ensure index.html is cached
      '/bobriki/sw.js',           // Your service worker path
      '/bobriki/favicon.ico',     // Icon paths must match your project
      '/bobriki/badge-icon.png',  // Make sure badge icon exists at this path
    ]);
  });
};

// Install event - initializes cache and forces activation
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();  // Ensures the service worker activates immediately
  event.waitUntil(initCache());
});

// Activate event - cleans up old caches
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [cacheKey];  // Only allow the current cache
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();  // Take control of all clients
});

// Push notification event - only works if not iOS (no iOS PWA push support)
if (!/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
      body: data.body || 'You have a new notification!',
      icon: data.icon || '/bobriki/favicon.ico',
      badge: data.badge || '/bobriki/badge-icon.png',
      data: {
        url: data.url || '/',  // Ensure notificationclick can open a URL
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', options)
    );
  });
}

// Notification click event - opens URL associated with the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/bobriki/')
  );
});

// Fallback fetch event - retrieves from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
