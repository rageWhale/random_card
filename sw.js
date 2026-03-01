const CACHE_NAME = "v1"
self.addEventListener("install", async (e) => {
  console.log("Service Worker installed", e)
  // 开启缓存，缓存版本为v1
  const cache = await caches.open(CACHE_NAME)
  // 将需要缓存的资源添加到缓存中
  await cache.addAll([
    "./随机抽卡小程序.html",
    "./icon.png",
    "./iconfont/iconfont.css",
    "./css/base.css",
    "./css/main.css",
    "./javaScript/main.js",
    "./javaScript/DB.js",
    "./sw.js",
    "./manifest.json",
    "./imgs/pic0.png",
  ])
  await self.skipWaiting()
})
self.addEventListener("activate", async (e) => {
  console.log("Service Worker activated", e)
  // 删除旧版本的缓存
  const cacheNames = await caches.keys()
  cacheNames.forEach((cacheName) => {
    if (cacheName !== CACHE_NAME) {
      caches.delete(cacheName)
    }
  })
  await self.clients.claim()
})

self.addEventListener("fetch", (e) => {
  const request = e.request
  e.respondWith(netWorkFirst(request))
})

async function netWorkFirst(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (e) {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    return cachedResponse
  }
}