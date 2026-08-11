const CACHE = "nabaden-v4";
const CORE = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/assets/nabaden-logo.webp",
  "/assets/nabaden-assistant.png",
  "/assets/garden-real.jpg",
  "/assets/product-gift-box.jpg",
  "/assets/product-wine.jpg",
  "/assets/product-dried.jpg",
  "/assets/product-gift-set.jpg",
  "/assets/harvest-gallery-collage.jpg",
  "/assets/gallery-harvest-crates.jpg",
  "/assets/gallery-fruit-closeup.jpg",
  "/assets/gallery-packing-process.jpg",
  "/assets/chung-nhan-ocop-3-sao.jpg",
  "/assets/kgs-unity-journey-group.jpg",
  "/assets/kgs-school-buses.jpg",
  "/assets/kgs-arrival-buses.jpg",
  "/assets/kgs-orchard-nui-ba-den.jpg",
  "/assets/kgs-arrival-at-farm.jpg",
  "/assets/kgs-welcome-at-nabaden.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});
