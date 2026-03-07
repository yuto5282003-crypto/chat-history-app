/**
 * Service Worker for caching 3D GLB models in Cache API.
 * Models are cached on first fetch and served from cache on subsequent requests.
 * This dramatically reduces load times for returning users.
 */

const CACHE_NAME = "sloty-models-v1";
const MODEL_PATTERNS = [
  /\/api\/model-proxy/,
  /\.glb$/,
  /\.gltf$/,
  /\.vrm$/,
];

function isModelRequest(url) {
  return MODEL_PATTERNS.some((p) => p.test(url));
}

// Install — pre-cache nothing, let runtime caching handle it
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("sloty-models-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first strategy for model files
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (!isModelRequest(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try cache first
      const cached = await cache.match(event.request);
      if (cached) return cached;

      // Fetch from network
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          // Clone and cache the response
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        // Network failure — return error
        return new Response("Model fetch failed", { status: 503 });
      }
    })
  );
});

// Handle cache cleanup messages from the app
self.addEventListener("message", (event) => {
  if (event.data?.type === "CLEAR_MODEL_CACHE") {
    caches.delete(CACHE_NAME);
  }
});
