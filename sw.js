var C = 'jarvis-v1';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png']); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) {
    var cp = r.clone(); caches.open(C).then(function (c) { c.put(e.request, cp); }); return r;
  }).catch(function () { return caches.match(e.request); }));
});
