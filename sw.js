const CACHE_NAME = "mathos-v2-static";
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./assets/css/main.css",
    "./assets/css/glass.css",
    "./assets/css/components.css",
    "./src/app.js",
    "./src/db.js",
    "./src/state.js",
    "./src/modules/ai.js",
    "./src/modules/astra.js",
    "./src/modules/booksData.js",
    "./src/modules/gamification.js",
    "./src/modules/timer.js",
    "./src/ui/aiTutor.ui.js",
    "./src/ui/books.ui.js",
    "./src/ui/dashboard.ui.js",
    "./src/ui/stats.ui.js",
    "./src/ui/timer.ui.js"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});