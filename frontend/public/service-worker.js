// Service worker ECO-PUMP AFRIK — mode hors-ligne
//
// Stratégie :
// - Fichiers de l'app (HTML, JS, CSS, icônes) : "network-first" avec repli sur le
//   cache si hors-ligne — l'app peut donc s'ouvrir et être consultée sans réseau.
// - Appels API vers le backend : jamais mis en cache (toujours réseau), car les
//   calculs hydrauliques doivent toujours utiliser des données à jour.
const CACHE_NAME = 'ecopump-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // ne jamais intercepter POST/PUT/DELETE (calculs, sauvegardes...)

  const url = new URL(request.url);

  // Appels vers un autre domaine (API backend) : réseau uniquement, jamais de cache.
  if (url.origin !== self.location.origin) return;

  // Fichiers de l'app (même origine) : network-first, repli cache si hors-ligne.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          // Repli générique : pour une navigation (changement de page), sers la page d'accueil en cache
          if (request.mode === 'navigate') return caches.match('/');
          return new Response('', { status: 408, statusText: 'Hors-ligne' });
        })
      )
  );
});
