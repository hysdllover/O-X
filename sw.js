const CACHE = 'ox-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'apple-touch-icon.png'];
const FONT_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (!same && !FONT_HOSTS.includes(url.hostname)) return; // GitHub API 등은 그대로 통과

  // 네트워크 우선, 실패 시 캐시 (오프라인 대응)
  e.respondWith(
    fetch(req, same ? { cache: 'no-cache' } : undefined).then(res => {
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || (same ? caches.match('index.html') : Response.error())))
  );
});
