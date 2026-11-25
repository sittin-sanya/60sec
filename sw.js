const CACHE = 'sec60-v2';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  if (req.url.endsWith('/sw.js')) return;
  e.respondWith(
    fetch(new Request(req, { cache: 'reload' })).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, copy)); }
      return r;
    }).catch(() => caches.match(req.mode === 'navigate' ? './' : req).then(m => m || caches.match('./')))
  );
});
