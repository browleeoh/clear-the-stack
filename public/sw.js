const CACHE_NAME = 'mtg-helper-v0.1'
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/app-icon.svg',
  '/mechanics/storied',
  '/cards/thorin-oakenshield',
  '/learn/turn-structure',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkResponse = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseCopy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy))
          }
          return response
        })
        .catch(() => cachedResponse || caches.match('/'))

      return cachedResponse || networkResponse
    }),
  )
})
