﻿
self.addEventListener('install', (event) => {

});

self.addEventListener('activate', (event) => {
    // console.log('👷', 'activate', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    // console.log('👷', 'fetch', event);
    if (event.request.method == "GET" && (
            event.request.url.toLowerCase().endsWith('.jpg') ||
            event.request.url.toLowerCase().endsWith('.jpeg') ||
            event.request.url.toLowerCase().endsWith('.png')
            )) {
        event.respondWith(
            caches.open('spacex-imageCache').then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function (response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
    else {
        event.respondWith(fetch(event.request));
    }
});
