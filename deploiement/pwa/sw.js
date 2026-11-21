// Empreinte · Service worker minimal : il rend l'app installable (Android, ordinateur) et
// garde une page de secours quand le réseau manque. Le contenu vient toujours du serveur ;
// rien n'est mis en cache de façon durable, pour que chaque mise à jour arrive aussitôt.
const SECOURS = 'empreinte-secours-v1'

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SECOURS).then(cache => cache.add('/app/hors-ligne.html')))
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(noms => Promise.all(noms.filter(nom => nom !== SECOURS).map(nom => caches.delete(nom))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(
    fetch(event.request).catch(() => caches.match('/app/hors-ligne.html'))
  )
})
