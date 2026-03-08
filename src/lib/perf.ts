/**
 * SLOTY Performance Infrastructure
 *
 * Only the optimizations that ACTUALLY help without breaking things:
 * - Service Worker for model caching (instant reload)
 * - That's it. Simple is better.
 */

/* ═══════════════════════════════════════════════════════
 * Service Worker Registration — cache GLB models in Cache API
 *
 * First visit: models load from Google Drive (slow)
 * Second visit onwards: models load from local cache (instant)
 * ═══════════════════════════════════════════════════════ */

let swRegistered = false;

export function registerModelCacheSW() {
  if (swRegistered) return;
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  swRegistered = true;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/model-cache-sw.js", { scope: "/" })
      .catch(() => {
        // SW registration failed — app works fine without it
      });
  });
}
