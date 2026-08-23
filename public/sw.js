const CACHE_NAME = 'mtg-helper-v0.2'
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
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(APP_SHELL)
      const shellResponses = await Promise.all(APP_SHELL.map((path) => cache.match(path)))
      const shellBodies = await Promise.all(shellResponses.map((response) => response?.text() ?? ''))
      const bundledAssets = shellBodies.flatMap((html) =>
        [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)[^\"]*"/g)].map((match) => match[1]),
      )
      await cache.addAll([...new Set(bundledAssets)])
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys
        .filter((key) => key.startsWith('mtg-helper-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestUrl = new URL(event.request.url)
  // External card images and official documents remain remote and optional.
  if (requestUrl.origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request)
      if (cachedResponse) return cachedResponse
      try {
        const response = await fetch(event.request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(event.request, response.clone())
        }
        return response
      } catch {
        if (event.request.mode === 'navigate') return caches.match('/')
        return Response.error()
      }
    })(),
  )
})
