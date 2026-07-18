// Service worker minimal : sert surtout à rendre le site installable
// (icône sur l'écran d'accueil, ouverture en plein écran). Ce site dépend
// entièrement de données en direct (connexion, quiz, réponses), donc on ne
// vise pas un vrai mode hors-ligne fonctionnel — juste un chargement plus
// rapide de la coquille (HTML/CSS) et un filet de secours si le réseau
// coupe une fraction de seconde.

const CACHE_NAME = 'compat-quiz-shell-v2';

const SHELL_ASSETS = [
  '/index.html',
  '/dashboard.html',
  '/quiz.html',
  '/admin.html',
  '/styles.css',
  '/config.js',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .catch((err) => console.error('SW install cache error :', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Supprime les anciens caches (utile si CACHE_NAME change lors d'une future mise à jour)
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // JAMAIS mettre en cache Supabase ni nos fonctions /api : ces données
  // doivent toujours être fraîches (authentification, quiz, réponses,
  // statut Pro...). On laisse ces requêtes suivre leur chemin normal.
  if (url.hostname.endsWith('supabase.co') || url.pathname.startsWith('/api/')) {
    return;
  }

  // Pour nos propres fichiers statiques : réseau en priorité (toujours la
  // dernière version), avec le cache en secours si hors-ligne.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
