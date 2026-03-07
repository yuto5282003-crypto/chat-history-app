/**
 * SLOTY Performance Infrastructure
 *
 * Utilities for managing WebGL resources, memory pressure,
 * and Service Worker model caching. Import where needed.
 */

/* ═══════════════════════════════════════════════════════
 * 1. Service Worker Registration — cache GLB models
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
        // SW registration failed — app works without it
      });
  });
}

/* ═══════════════════════════════════════════════════════
 * 2. Memory Pressure Detection
 * ═══════════════════════════════════════════════════════ */

export type PerfTier = "high" | "medium" | "low";

let cachedTier: PerfTier | null = null;

/**
 * Detect device performance tier based on hardware signals.
 * Used to auto-adjust rendering quality.
 */
export function detectPerfTier(): PerfTier {
  if (cachedTier) return cachedTier;
  if (typeof window === "undefined") return "medium";

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency ?? 4;

  // Check device memory (GB) — Chrome/Edge only
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;

  // Check if mobile
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Check WebGL capabilities
  let maxTextureSize = 4096;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) ?? 4096;
      // Force context loss to free resources
      const ext = gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    }
  } catch { /* ignore */ }

  // Scoring
  let score = 0;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;

  if (mem >= 8) score += 2;
  else if (mem >= 4) score += 1;

  if (maxTextureSize >= 8192) score += 1;

  if (isMobile) score -= 1;

  if (score >= 4) cachedTier = "high";
  else if (score >= 2) cachedTier = "medium";
  else cachedTier = "low";

  return cachedTier;
}

/**
 * Get rendering parameters based on performance tier.
 */
export function getRenderParams(tier?: PerfTier) {
  const t = tier ?? detectPerfTier();

  switch (t) {
    case "high":
      return {
        maxContexts: 12,
        dprCap: 1.5,
        shadowResolution: 128,
        antialias: false,
        precision: "mediump" as const,
      };
    case "medium":
      return {
        maxContexts: 8,
        dprCap: 1,
        shadowResolution: 64,
        antialias: false,
        precision: "lowp" as const,
      };
    case "low":
      return {
        maxContexts: 4,
        dprCap: 0.75,
        shadowResolution: 32,
        antialias: false,
        precision: "lowp" as const,
      };
  }
}

/* ═══════════════════════════════════════════════════════
 * 3. Memory Pressure Monitoring
 * ═══════════════════════════════════════════════════════ */

type MemoryCallback = (isUnderPressure: boolean) => void;
const memoryListeners: MemoryCallback[] = [];
let memoryMonitorActive = false;

export function onMemoryPressure(cb: MemoryCallback) {
  memoryListeners.push(cb);

  if (!memoryMonitorActive && typeof window !== "undefined") {
    memoryMonitorActive = true;

    // Performance.memory (Chrome only)
    const perf = performance as unknown as {
      memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
    };
    if (perf.memory) {
      setInterval(() => {
        const ratio = perf.memory!.usedJSHeapSize / perf.memory!.jsHeapSizeLimit;
        const pressure = ratio > 0.85;
        memoryListeners.forEach((cb) => cb(pressure));
      }, 5000);
    }
  }

  return () => {
    const idx = memoryListeners.indexOf(cb);
    if (idx >= 0) memoryListeners.splice(idx, 1);
  };
}

/* ═══════════════════════════════════════════════════════
 * 4. WebGL Context Pool Management
 * ═══════════════════════════════════════════════════════ */

let _maxContexts: number | null = null;
let _activeContexts = 0;
const _waitQueue: Array<() => void> = [];

export function getMaxContexts(): number {
  if (_maxContexts !== null) return _maxContexts;
  _maxContexts = getRenderParams().maxContexts;
  return _maxContexts;
}

/**
 * Request a WebGL context slot. Returns true if granted.
 * If over budget, queues and resolves when a slot frees up.
 */
export function acquireContextSlot(): boolean {
  if (_activeContexts < getMaxContexts()) {
    _activeContexts++;
    return true;
  }
  return false;
}

export function releaseContextSlot() {
  _activeContexts = Math.max(0, _activeContexts - 1);
  // Notify waiters
  if (_waitQueue.length > 0 && _activeContexts < getMaxContexts()) {
    const next = _waitQueue.shift();
    next?.();
  }
}

export function waitForContextSlot(): Promise<void> {
  if (_activeContexts < getMaxContexts()) {
    _activeContexts++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    _waitQueue.push(() => {
      _activeContexts++;
      resolve();
    });
  });
}

export function getActiveContextCount() {
  return _activeContexts;
}
