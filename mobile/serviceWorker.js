const staticLinks = "dev-VITE-mobile-v1";
const assets = [
  "/index.html",
  "css/mobile.css",
  "js/mobile-menu.js",
  "js/mobile-vite.js",
  "icon/Back Arrow.svg",
  "icon/Caps.svg",
  "icon/edit.svg",
  "icon/moon.svg",
  "icon/submit.svg",
  "icon/sun.svg",
  "/src/jquery-3.6.0.min.js",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticLinks).then((cache) => {
      cache.addAll(assets);
    })
  );
});
self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
