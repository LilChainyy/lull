// Minimal service worker — enables PWA install prompt.
// No offline caching since the app depends on YouTube streaming.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
