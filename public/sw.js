// Service Worker cho Pomo PWA: Cache static assets va offline shell
const CACHE_NAME = "pomo-cache-v1";
const OFFLINE_URLS = [
  "/today",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Chi cache GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Bo qua cac request toi Supabase hoac API ben ngoai
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Luu ban sao vao cache neu thanh cong
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(async () => {
        // Mat mang: tra ve tu cache
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // Neu dieu huong trang HTML ma offline, tra ve trang /today da cache
        if (event.request.mode === "navigate") {
          const fallback = await caches.match("/today");
          if (fallback) return fallback;
        }

        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
