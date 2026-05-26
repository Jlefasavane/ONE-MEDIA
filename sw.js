/* ═══════════════════════════════════════════════════════════
   ONE MEDIA — Service Worker v3
   Stratégie : Cache-first statique, Network-first API/articles
═══════════════════════════════════════════════════════════ */
const CACHE_VERSION = 'onemedia-v4';
const STATIC_ASSETS = [
  '/', '/index.html', '/style.css', '/design.css',
  '/main.js', '/data.js', '/player.js', '/manifest.json',
  '/article.html', '/artists.html', '/category.html',
];

/* ── Install : précache les assets statiques ─────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => c.addAll(STATIC_ASSETS))
      .catch(() => {}) // ne bloque pas si une ressource échoue
  );
  self.skipWaiting();
});

/* ── Activate : nettoie les anciens caches ───────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch : stratégies différenciées ───────────────────── */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // 1. API Railway → Network-first (données fraîches) + fallback cache
  if (url.hostname.includes('railway.app') && url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // 2. Assets statiques locaux → Cache-first (ultra rapide)
  if (url.hostname === self.location.hostname) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => {
          // Page offline de secours pour navigation HTML
          if (e.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
    );
    return;
  }

  // 3. Ressources externes (fonts, images CDN) → Network avec mise en cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
