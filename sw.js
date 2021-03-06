const cacheName = "maskDetector-v1"
const staticAssets = [
    "index.html",
    "access-denied.ogg",
    "access-granted.ogg",
    "index.js",
    "manifest.webmanifest",
    "metadata.json",
    "model.json",
    "weights.bin",
    "icon48.png",
    "icon72.png",
    "icon96.png",
    "icon144.png",
    "icon152.png",
    "icon168.png",
    "icon192.png",
    "icon384.png",
    "icon512.png"
]

self.addEventListener("install",async e=> {
    const cache = await caches.open(cacheName)
    await cache.addAll(staticAssets)
    return self.skipWaiting();
})

self.addEventListener("activate", e => {
    self.clients.claim();
})

self.addEventListener("fetch", async e => {
    const req = e.request;
    const url = new URL(req.url)

    if(url.origin === location.origin){
        e.respondWith(cacheFirst(req))
    }else{
        e.respondWith(networkAndCache(req))
    }
})

async function cacheFirst(req){
    const cache = await caches.open(cacheName)
    const cached = await cache.match(req)
    return cached || fetch(req)
}

async function networkAndCache(req){
    const cache = await caches.open(cacheName)
    try{
        const fresh = await fetch(req)
        await cache.put(req, fresh.clone())
        return fresh;
    }catch(e){
        const cached = await cache.match(req)
        return cached;
    }
}