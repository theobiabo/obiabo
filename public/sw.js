const CACHE_PREFIX = 'obiabo-'
const STATIC_CACHE = `${CACHE_PREFIX}static-v1`
const PAGE_CACHE = `${CACHE_PREFIX}pages-v1`
const IMAGE_CACHE = `${CACHE_PREFIX}images-v1`

const STATIC_ASSETS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/fonts/departure-mono/DepartureMono-Regular.woff2',
  '/audio/rainy-jazz.mp3',
]

const PUBLIC_PAGES = [
  '/',
  '/about',
  '/projects',
  '/gallery',
  '/gallery?category=personal',
  '/gallery?category=coffee',
  '/gallery?category=other',
  '/notes',
  '/open-source-contributions',
  '/reach',
  '/search',
  '/work-with-me',
]

async function cacheAsset(cache, path) {
  const response = await fetch(path, {cache: 'reload'})
  if (!response.ok) throw new Error(`Could not cache ${path}`)
  await cache.put(path, response)
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const staticCache = await caches.open(STATIC_CACHE)
    const pageCache = await caches.open(PAGE_CACHE)
    const discoveredAssets = new Set()

    await cacheAsset(staticCache, '/offline.html')
    await Promise.allSettled(STATIC_ASSETS.filter((path) => path !== '/offline.html').map((path) => cacheAsset(staticCache, path)))
    await Promise.allSettled(PUBLIC_PAGES.map(async (path) => {
      const response = await fetch(path, {cache: 'reload'})
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return

      await pageCache.put(path, response.clone())
      const html = await response.text()
      for (const match of html.matchAll(/(?:src|href)=["'](\/_astro\/[^"']+)["']/g)) {
        discoveredAssets.add(match[1])
      }
    }))
    await Promise.allSettled([...discoveredAssets].map((path) => cacheAsset(staticCache, path)))
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names
      .filter((name) => name.startsWith(CACHE_PREFIX) && ![STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE].includes(name))
      .map((name) => caches.delete(name)))
    await self.clients.claim()
  })())
})

async function offlineFirstPage(event) {
  const cache = await caches.open(PAGE_CACHE)
  const cached = await cache.match(event.request)
  const refresh = async () => {
    const response = await fetch(event.request)
    if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
      await cache.put(event.request, response.clone())
    }
    return response
  }

  if (cached) {
    event.waitUntil(refresh().catch(() => {}))
    return cached
  }

  try {
    return await refresh()
  } catch {
    return await caches.match('/offline.html')
      ?? Response.error()
  }
}

async function cacheFirst(event, cacheName, allowOpaque = false) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(event.request)
  if (cached) return cached

  const response = await fetch(event.request)
  if (response.ok || (allowOpaque && response.type === 'opaque')) {
    const copy = response.clone()
    event.waitUntil((async () => {
      await cache.put(event.request, copy)
      if (allowOpaque) {
        const keys = await cache.keys()
        await Promise.all(keys.slice(0, Math.max(0, keys.length - 40)).map((key) => cache.delete(key)))
      }
    })())
  }
  return response
}

async function audioResponse(event) {
  const cache = await caches.open(STATIC_CACHE)
  let response = await cache.match('/audio/rainy-jazz.mp3')

  if (!response) {
    response = await fetch('/audio/rainy-jazz.mp3')
    if (!response.ok) return response
    event.waitUntil(cache.put('/audio/rainy-jazz.mp3', response.clone()))
  }

  const range = event.request.headers.get('range')
  if (!range) return response

  const match = /^bytes=(\d+)-(\d*)$/.exec(range)
  if (!match) return response

  const bytes = await response.arrayBuffer()
  const start = Number(match[1])
  const end = match[2] ? Math.min(Number(match[2]), bytes.byteLength - 1) : bytes.byteLength - 1
  if (start > end || start >= bytes.byteLength) {
    return new Response(null, {status: 416, headers: {'Content-Range': `bytes */${bytes.byteLength}`}})
  }

  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${bytes.byteLength}`,
    },
  })
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  const sameOrigin = url.origin === self.location.origin

  if (sameOrigin) {
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin/')) return

    const pagePath = !url.pathname.split('/').pop()?.includes('.')
    if (request.mode === 'navigate' ||
      request.headers.get('accept')?.includes('text/html') ||
      (request.destination === '' && pagePath)) {
      event.respondWith(offlineFirstPage(event))
      return
    }

    if (url.pathname === '/audio/rainy-jazz.mp3') {
      event.respondWith(audioResponse(event))
      return
    }

    if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/fonts/') ||
      url.pathname.startsWith('/icons/') || STATIC_ASSETS.includes(url.pathname)) {
      event.respondWith(cacheFirst(event, STATIC_CACHE))
    }
    return
  }

  if (url.origin === 'https://cdn.sanity.io' && request.destination === 'image') {
    event.respondWith(cacheFirst(event, IMAGE_CACHE, true))
  }
})
