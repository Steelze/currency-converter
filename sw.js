const VERSION = 'v0.0.3';
const STATIC_CACHE = `static-${VERSION}`;
const DYNAMIC_CACHE = `dynamic-${VERSION}`;
const STATIC_FILES = [
  './',
  './index.html',
  './css/app.css',
  './css/bootstrap.css',
  './js/app.js',
  './js/utility.js',
  './icons/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
];

function isInStaticCache(string) {
    let cache_path;
    //Check if file is on our domain or CDN
    if (string.includes(self.origin)) {
        cache_path = `.${string.substring(self.origin.length)}`;
    } else {
        cache_path = string
    }

    return STATIC_FILES.indexOf(cache_path) > 1;
}

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(STATIC_FILES);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    if (event.request.url.includes('free.currconv.com/api/v7/')) {
        console.log('This is a request to currency api, let idb handle this', event.request.url);
        event.respondWith(
            fetch(event.request)
        );
    } else if(isInStaticCache(event.request.url)) {
        event.respondWith(
            caches.match(event.request)
        );
    } else if(event.request.url.includes('chrome-extension') || event.request.url.includes('cr-input.mxpnl.net')) {
        event.respondWith(
            fetch(event.request)
        );
    } else {
        event.respondWith(
            caches.open(DYNAMIC_CACHE).then(function(cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function(response) {
                      cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
});