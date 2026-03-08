"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const snapshotCache = new Map<string, string>();
const failedUrls = new Set<string>();

/* Fallback: a simple silhouette SVG data URL for failed models */
const FALLBACK_AVATAR = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="none"/><circle cx="64" cy="40" r="20" fill="#c4b5fd"/><ellipse cx="64" cy="100" rx="30" ry="24" fill="#c4b5fd"/></svg>`;
  return `data:image/svg+xml;base64,${typeof btoa !== "undefined" ? btoa(svg) : ""}`;
})();

/**
 * Offscreen snapshot renderer: uses ONE WebGL context to capture all avatar thumbnails.
 * Much lighter than multiple live Canvas elements.
 */
export function useAvatarSnapshots(renderSize = 128) {
  const [snapshots, setSnapshots] = useState<Map<string, string>>(new Map(snapshotCache));
  const queueRef = useRef<string[]>([]);
  const busyRef = useRef(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const loaderRef = useRef<GLTFLoader | null>(null);
  const modelCacheRef = useRef<Map<string, THREE.Group>>(new Map());

  const renderNext = useCallback(async () => {
    if (busyRef.current || queueRef.current.length === 0) return;
    busyRef.current = true;

    const url = queueRef.current.shift()!;

    if (snapshotCache.has(url) || failedUrls.has(url)) {
      // If previously failed, set fallback
      if (failedUrls.has(url) && !snapshotCache.has(url)) {
        snapshotCache.set(url, FALLBACK_AVATAR);
        setSnapshots((prev) => {
          const next = new Map(prev);
          next.set(url, FALLBACK_AVATAR);
          return next;
        });
      }
      busyRef.current = false;
      renderNext();
      return;
    }

    try {
      if (!rendererRef.current) {
        rendererRef.current = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          preserveDrawingBuffer: true,
        });
        rendererRef.current.setPixelRatio(1);
      }
      if (!loaderRef.current) {
        loaderRef.current = new GLTFLoader();
      }

      const renderer = rendererRef.current;

      // Check if WebGL context is lost
      const gl = renderer.getContext();
      if (gl.isContextLost()) {
        rendererRef.current.dispose();
        rendererRef.current = null;
        throw new Error("WebGL context lost");
      }

      renderer.setSize(renderSize, renderSize);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0.5, 3);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(3, 5, 4);
      scene.add(dirLight);

      let model: THREE.Group;
      if (modelCacheRef.current.has(url)) {
        model = modelCacheRef.current.get(url)!.clone(true);
      } else {
        const loader = loaderRef.current;
        const gltf = await Promise.race([
          new Promise<ReturnType<GLTFLoader["parseAsync"]>>((resolve, reject) => {
            loader.load(url, resolve as (gltf: unknown) => void, undefined, reject);
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Model load timeout")), 15000)
          ),
        ]);
        const origModel = (gltf as { scene: THREE.Group }).scene;
        modelCacheRef.current.set(url, origModel);
        model = origModel.clone(true);
      }

      model.rotation.set(0, Math.PI, 0);

      const box = new THREE.Box3().setFromObject(model);
      const sz = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(sz.x, sz.y, sz.z);
      const sc = 2 / maxDim;
      model.scale.setScalar(sc);
      const c = center.multiplyScalar(sc);
      model.position.set(-c.x, -c.y + (sz.y * sc) / 2 - 1, -c.z);

      // Cap texture size for performance
      const MAX_TEX = 128;
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          const maps = [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap, mat.emissiveMap];
          for (const tex of maps) {
            if (tex) {
              tex.generateMipmaps = false;
              tex.minFilter = THREE.LinearFilter;
              const img = tex.image as { width?: number; height?: number } | null;
              if (img && ((img.width ?? 0) > MAX_TEX || (img.height ?? 0) > MAX_TEX)) {
                img.width = MAX_TEX;
                img.height = MAX_TEX;
                tex.needsUpdate = true;
              }
            }
          }
        }
      });

      scene.add(model);
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL("image/png");

      snapshotCache.set(url, dataUrl);
      setSnapshots((prev) => {
        const next = new Map(prev);
        next.set(url, dataUrl);
        return next;
      });

      scene.remove(model);
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m: THREE.Material) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    } catch {
      // Failed to render — set fallback so spinner doesn't spin forever
      failedUrls.add(url);
      snapshotCache.set(url, FALLBACK_AVATAR);
      setSnapshots((prev) => {
        const next = new Map(prev);
        next.set(url, FALLBACK_AVATAR);
        return next;
      });
    }

    busyRef.current = false;
    requestAnimationFrame(() => renderNext());
  }, [renderSize]);

  const enqueue = useCallback(
    (urls: string[]) => {
      const newUrls = urls.filter(
        (u) => !snapshotCache.has(u) && !queueRef.current.includes(u)
      );
      queueRef.current.push(...newUrls);
      renderNext();
    },
    [renderNext]
  );

  useEffect(() => {
    return () => {
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  return { snapshots, enqueue };
}
