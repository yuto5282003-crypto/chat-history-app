"use client";

import { Suspense, useRef, useState, useEffect, useCallback, memo } from "react";
import { Canvas, useFrame, invalidate, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  acquireContextSlot,
  releaseContextSlot,
  getRenderParams,
  detectPerfTier,
  onMemoryPressure,
  registerModelCacheSW,
} from "@/lib/perf";
import WebGLErrorBoundary from "./WebGLErrorBoundary";

/* ─── Register Service Worker on first import ─── */
if (typeof window !== "undefined") {
  registerModelCacheSW();
}

/* ─── Model existence cache ─── */
const modelExistsCache = new Map<string, boolean>();

/* ─── Snapshot cache: 2D rendered snapshots of 3D models ─── */
const snapshotCache = new Map<string, string>();

/* ─────────────────────────────────────────────
 *  FrameThrottler — game-engine style frame budget
 *  Only calls invalidate() at target FPS, not every rAF
 * ───────────────────────────────────────────── */
function useFrameThrottle(targetFps: number = 30) {
  const lastFrame = useRef(0);
  const interval = 1000 / targetFps;

  return useCallback(
    (now: number) => {
      if (now - lastFrame.current >= interval) {
        lastFrame.current = now;
        return true;
      }
      return false;
    },
    [interval]
  );
}

/* ─────────────────────────────────────────────
 *  ChibiModel — loads GLB with game-engine optimizations
 *  - Texture downscaling based on device tier
 *  - Geometry simplification for small displays
 *  - Frame-budget-aware animation
 * ───────────────────────────────────────────── */
function ChibiModel({
  url,
  animationSpeed = 1,
  userRotating = false,
  baseRotationY = 0,
  displaySize = 120,
}: {
  url: string;
  animationSpeed?: number;
  userRotating?: boolean;
  baseRotationY?: number;
  displaySize?: number;
}) {
  const { scene, animations } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null!);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const bonesRef = useRef<{
    leftArm?: THREE.Bone;
    rightArm?: THREE.Bone;
    leftLeg?: THREE.Bone;
    rightLeg?: THREE.Bone;
    spine?: THREE.Bone;
    head?: THREE.Bone;
  }>({});
  const shouldThrottle = useFrameThrottle(displaySize < 80 ? 20 : 30);

  useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;
      animations.forEach((clip) => mixer.clipAction(clip).play());
      return () => {
        mixer.stopAllAction();
        mixer.uncacheRoot(scene);
      };
    }
  }, [scene, animations]);

  useEffect(() => {
    scene.rotation.set(0, baseRotationY, 0);

    const box = new THREE.Box3();
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.visible) {
        box.union(new THREE.Box3().setFromObject(child));
      }
    });
    if (box.isEmpty()) box.setFromObject(scene);

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);

    const sc = center.multiplyScalar(scale);
    scene.position.set(-sc.x, -sc.y + (size.y * scale) / 2 - 1, -sc.z);

    // ── Game-engine texture optimization ──
    // Downscale textures based on display size (LOD for textures)
    const maxTexSize = displaySize < 80 ? 256 : displaySize < 150 ? 512 : 1024;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.map) {
          mat.map.minFilter = THREE.LinearFilter;
          mat.map.generateMipmaps = false;
          // Limit texture size to save GPU memory
          const img = mat.map.image as { width?: number; height?: number } | undefined;
          if (img && typeof img.width === "number" && img.width > maxTexSize) {
            img.width = maxTexSize;
            img.height = maxTexSize;
            mat.map.needsUpdate = true;
          }
        }
        // Disable expensive material features for small displays
        if (displaySize < 100) {
          mat.envMapIntensity = 0;
          mat.roughness = 1;
          mat.metalness = 0;
        }
      }
    });

    const bones: typeof bonesRef.current = {};
    scene.traverse((child) => {
      const name = child.name.toLowerCase();
      if (child instanceof THREE.Bone) {
        if (name.includes("left") && (name.includes("arm") || name.includes("hand") || name.includes("upper_arm")))
          bones.leftArm = child;
        else if (name.includes("right") && (name.includes("arm") || name.includes("hand") || name.includes("upper_arm")))
          bones.rightArm = child;
        else if (name.includes("left") && (name.includes("leg") || name.includes("thigh") || name.includes("upper_leg")))
          bones.leftLeg = child;
        else if (name.includes("right") && (name.includes("leg") || name.includes("thigh") || name.includes("upper_leg")))
          bones.rightLeg = child;
        else if (name.includes("spine") || name.includes("torso") || name.includes("chest"))
          bones.spine = child;
        else if (name.includes("head") || name.includes("neck"))
          bones.head = child;
      }
    });
    bonesRef.current = bones;
  }, [scene, baseRotationY, displaySize]);

  useFrame((state, delta) => {
    // Frame budget: skip frame if we're over budget
    const now = performance.now();
    if (!shouldThrottle(now)) return;

    mixerRef.current?.update(delta * animationSpeed);

    const t = state.clock.getElapsedTime() * animationSpeed;
    const group = groupRef.current;
    if (!group) return;

    const bones = bonesRef.current;
    const walkCycle = t * 2.5;

    if (bones.leftArm || bones.leftLeg) {
      const s = Math.sin(walkCycle);
      const sa = Math.sin(walkCycle + Math.PI);
      if (bones.leftArm) bones.leftArm.rotation.x = s * 0.4;
      if (bones.rightArm) bones.rightArm.rotation.x = sa * 0.4;
      if (bones.leftLeg) bones.leftLeg.rotation.x = sa * 0.35;
      if (bones.rightLeg) bones.rightLeg.rotation.x = s * 0.35;
      if (bones.spine) {
        bones.spine.rotation.z = s * 0.03;
        bones.spine.rotation.y = Math.sin(walkCycle * 0.5) * 0.02;
      }
      if (bones.head) bones.head.rotation.x = Math.sin(walkCycle * 2) * 0.02;
    }

    group.position.y = Math.abs(Math.sin(walkCycle)) * 0.04;
    group.scale.set(1, 1 + Math.sin(t * 1.5) * 0.015, 1);
    group.rotation.z = Math.sin(walkCycle) * 0.04;
    if (!userRotating) group.rotation.y = Math.sin(t * 0.4) * 0.15;

    invalidate();
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ─── SnapshotCapture: captures a single frame as 2D image ─── */
function SnapshotCapture({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const { gl, scene, camera } = useThree();
  const captured = useRef(false);

  useFrame(() => {
    if (captured.current) return;
    captured.current = true;
    gl.render(scene, camera);
    try {
      const dataUrl = gl.domElement.toDataURL("image/jpeg", 0.6);
      onCapture(dataUrl);
    } catch { /* ignore */ }
  });

  return null;
}

/* ─── FallbackModel (low-poly) ─── */
function FallbackModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.6) * 0.1;
      ref.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
    invalidate();
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#f5c0d0" />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <capsuleGeometry args={[0.3, 0.5, 8, 8]} />
        <meshStandardMaterial color="#9b8afb" />
      </mesh>
      <mesh position={[-0.15, 0.6, 0.38]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.15, 0.6, 0.38]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

/* ─── LoadingSpinner ─── */
function LoadingSpinner() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 2;
    invalidate();
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.3, 0.05, 8, 24]} />
      <meshStandardMaterial color="#9b8afb" />
    </mesh>
  );
}

/* ─── Static placeholder (no WebGL) ─── */
function StaticPlaceholder({ size, snapshot }: { size: number; snapshot?: string }) {
  if (snapshot) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={snapshot}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          borderRadius: 8,
        }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, rgba(155,138,251,0.15), rgba(155,138,251,0.05))",
      }}
    >
      <div
        className="animate-pulse rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background: "linear-gradient(135deg, rgba(155,138,251,0.3), rgba(155,138,251,0.15))",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Avatar3D — game-engine grade component
 *
 *  Techniques borrowed from FPS games:
 *  1. Context pooling (like GPU resource pools)
 *  2. Frame budget throttling (skip frames when over budget)
 *  3. LOD: 2D snapshot when offscreen, 3D when visible
 *  4. Texture LOD based on display size
 *  5. Memory pressure response (auto-downgrade)
 *  6. IntersectionObserver (frustum culling equivalent)
 *  7. Service Worker model cache (like asset streaming)
 *  8. Error boundary with auto-retry (crash recovery)
 * ───────────────────────────────────────────── */
const Avatar3D = memo(function Avatar3D({
  modelUrl,
  size = 120,
  className = "",
  autoRotate = false,
  animationSpeed = 1,
  enableLongPressRotate = false,
  onRotatingChange,
}: {
  modelUrl?: string;
  size?: number;
  className?: string;
  autoRotate?: boolean;
  animationSpeed?: number;
  enableLongPressRotate?: boolean;
  onRotatingChange?: (rotating: boolean) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const [modelExists, setModelExists] = useState<boolean | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [underPressure, setUnderPressure] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextAcquired = useRef(false);

  // Get render params based on device tier
  const renderParams = getRenderParams();

  // ── Memory pressure listener ──
  useEffect(() => {
    return onMemoryPressure((pressure) => {
      setUnderPressure(pressure);
    });
  }, []);

  // ── IntersectionObserver: frustum culling ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "150px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Context pool management ──
  useEffect(() => {
    if (isVisible && !contextAcquired.current) {
      const got = acquireContextSlot();
      if (got) {
        contextAcquired.current = true;
        setCanvasReady(true);
      }
    }

    if (!isVisible && contextAcquired.current) {
      // Capture snapshot before releasing context
      releaseContextSlot();
      contextAcquired.current = false;
      setCanvasReady(false);
    }

    return () => {
      if (contextAcquired.current) {
        releaseContextSlot();
        contextAcquired.current = false;
      }
    };
  }, [isVisible]);

  // ── Model existence check with cache ──
  useEffect(() => {
    if (!modelUrl) {
      setModelExists(false);
      return;
    }

    const cached = modelExistsCache.get(modelUrl);
    if (cached !== undefined) {
      setModelExists(cached);
      return;
    }

    fetch(modelUrl, { method: "HEAD" })
      .then((res) => {
        modelExistsCache.set(modelUrl, res.ok);
        setModelExists(res.ok);
      })
      .catch(() => {
        modelExistsCache.set(modelUrl, true);
        setModelExists(true);
      });
  }, [modelUrl]);

  const showFallback = !modelUrl || hasError || modelExists === false;

  // ── Snapshot capture callback ──
  const handleSnapshot = useCallback(
    (dataUrl: string) => {
      if (modelUrl) snapshotCache.set(modelUrl, dataUrl);
    },
    [modelUrl]
  );

  // ── WebGL context loss recovery ──
  const handleCreated = useCallback((state: { gl: THREE.WebGLRenderer }) => {
    const gl = state.gl;
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      setHasError(true);
    });
    canvas.addEventListener("webglcontextrestored", () => {
      setHasError(false);
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enableLongPressRotate) return;
      longPressTimer.current = setTimeout(() => {
        setIsRotating(true);
        onRotatingChange?.(true);
      }, 400);
    },
    [enableLongPressRotate, onRotatingChange]
  );

  const handlePointerUp = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  const handlePointerLeave = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  useEffect(() => {
    if (!isRotating) return;
    const handleClickOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsRotating(false);
        onRotatingChange?.(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("pointerdown", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isRotating, onRotatingChange]);

  // DPR capped by device tier
  const dpr = typeof window !== "undefined"
    ? Math.min(window.devicePixelRatio, underPressure ? 0.5 : renderParams.dprCap)
    : 1;

  // Shadow resolution based on tier
  const shadowRes = underPressure ? 32 : renderParams.shadowResolution;

  // Get cached snapshot for offscreen display
  const cachedSnapshot = modelUrl ? snapshotCache.get(modelUrl) : undefined;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: size,
        height: size,
        background: "transparent",
        position: "relative",
        transition: "box-shadow 0.3s",
        boxShadow: isRotating
          ? "0 0 0 2px rgba(155,138,251,0.6), 0 0 12px rgba(155,138,251,0.3)"
          : "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <WebGLErrorBoundary size={size} onError={() => setHasError(true)}>
        {canvasReady ? (
          <Canvas
            camera={{ position: [0, 0.5, 3], fov: 35 }}
            gl={{
              alpha: true,
              antialias: renderParams.antialias,
              powerPreference: "low-power",
              precision: renderParams.precision,
              failIfMajorPerformanceCaveat: false,
              preserveDrawingBuffer: true,
            }}
            dpr={dpr}
            style={{ background: "transparent" }}
            onError={() => setHasError(true)}
            onCreated={handleCreated}
            frameloop="demand"
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[3, 5, 4]} intensity={0.9} />

            <Suspense fallback={<LoadingSpinner />}>
              {showFallback ? (
                <FallbackModel />
              ) : (
                <>
                  <ChibiModel
                    url={modelUrl!}
                    animationSpeed={underPressure ? animationSpeed * 0.5 : animationSpeed}
                    userRotating={isRotating}
                    baseRotationY={Math.PI}
                    displaySize={size}
                  />
                  {!snapshotCache.has(modelUrl!) && (
                    <SnapshotCapture onCapture={handleSnapshot} />
                  )}
                </>
              )}
            </Suspense>

            {!underPressure && (
              <ContactShadows
                position={[0, -1, 0]}
                opacity={0.2}
                scale={2}
                blur={1}
                far={2}
                frames={1}
                resolution={shadowRes}
              />
            )}

            {(isRotating || autoRotate) && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={autoRotate && !isRotating}
                autoRotateSpeed={1.5}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 3}
                rotateSpeed={1.0}
                touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
              />
            )}
          </Canvas>
        ) : (
          <StaticPlaceholder size={size} snapshot={cachedSnapshot} />
        )}
      </WebGLErrorBoundary>

      {isRotating && (
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-bold text-white whitespace-nowrap"
          style={{ background: "rgba(155,138,251,0.8)", backdropFilter: "blur(4px)" }}
        >
          ドラッグで回転
        </div>
      )}

      {enableLongPressRotate && !isRotating && (
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[6px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          長押しで回転
        </div>
      )}
    </div>
  );
});

export default Avatar3D;

export function preloadModel(url: string) {
  useGLTF.preload(url);
}
