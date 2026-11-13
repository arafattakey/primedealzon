/* Offline support: cache pages as they are visited; serve from cache when there is no network. */
const CACHE = 'sohoj-v2';
const CORE = ['./', 'css/style.css', 'js/common.js', 'js/resizer.js', 'icon.svg', 'manifest.webmanifest',
  'data/helplines.json', 'data/govt-portals.json', 'data/overseas-checklist.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Network first (always fresh when online), cache as fallback
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('./')))
  );
});
