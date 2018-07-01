const staticCacheNamme = 'curr-converter-static-v1';
const itemCache = ['/','/js/main.js', '/js/indexedDb.js', '/css/main.css', '/dist/bootstrap.min.css', 'https://use.fontawesome.com/releases/v5.1.0/css/all.css', '/img/favicon.ico'];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheNamme).then(function(cache) {
            return cache.addAll(itemCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== staticCacheNamme && thisCacheName.startsWith('curr-converter-')) {
                  return  caches.delete(thisCacheName);
                }
            }))
        })
    );
});

self.addEventListener('fetch', function(event) {
    let resource =  new URL(event.request.url);
    if (resource.origin ===location.origin) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    return response
                }
                return fetch(event.request);
            })
        ) 
    } 
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
});