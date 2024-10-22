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


self.addEventListener('install', (event) => {
  console.log('Installed');
  event.waitUntil(initCache())
});

const cacheKey = "cache-v1";

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


self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/bobriki/')
  );
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/bobriki/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}
