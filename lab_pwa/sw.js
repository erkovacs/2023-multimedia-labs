self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static').then(cache => {
            return cache.addAll([
                './',
                './manifest.json',
                './css/',
                './js',
                './css/syles.css',
                './js/bar-chart.js',
                './index.html',
                './icon-192x192.png',
                './icon-256x256.png',
                './icon-384x384.png',
                './icon-512x512.png'
            ])
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        e.request.url.includes('/api/') ? fetch(e.request).then(response => {
            return response || caches.match(e.request);
        }).catch(e => {
            console.error(e);
            return caches.match(e.request);
        }) : caches.match(e.request)
    );
});
