"use client";

import { Suspense, useRef, useState, useEffect, useCallback, memo } from "react";
import { Canvas, useFrame, invalidate } from "@react-three/fiber";
import { useGLTF, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { registerModelCacheSW } from "@/lib/perf";
import WebGLErrorBoundary from "./WebGLErrorBoundary";

/* ─── Register Service Worker for model caching (the GOOD optimization) ─── */
if (typeof window !== "undefined") {
  registerModelCacheSW();
}

/* ─── Model existence cache: skip HEAD requests for known URLs ─── */
const modelExistsCache = new Map<string, boolean>();

/* ─────────────────────────────────────────────
 *  ChibiModel — loads a GLB and adds idle/walk animation
 *  Keeps original quality. No material degradation.
 * ───────────────────────────────────────────── */
function ChibiModel({
  url,
  animationSpeed = 1,
  userRotating = false,
  baseRotationY = 0,
}: {
  url: string;
  animationSpeed?: number;
  userRotating?: boolean;
  baseRotationY?: number;
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

    // Compute bounding box from visible meshes only for accurate sizing
    const box = new THREE.Box3();
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.visible) {
        const meshBox = new THREE.Box3().setFromObject(child);
        box.union(meshBox);
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

    // Light texture optimization: disable mipmaps only (saves GPU memory, no visual impact)
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.map) {
          mat.map.generateMipmaps = false;
          mat.map.minFilter = THREE.LinearFilter;
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
  }, [scene, baseRotationY]);

  useFrame((state, delta) => {
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

/* ─── Loading placeholder (lightweight, no WebGL) ─── */
function LoadingPlaceholder({ size }: { size: number }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"
        style={{ borderColor: "rgba(155,138,251,0.6)" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Avatar3D — reliable + fast
 *
 *  KEPT (actually helps):
 *  ✅ Service Worker model cache → 2回目以降は即表示
 *  ✅ IntersectionObserver → 画面外はCanvas作らない（軽量化の本命）
 *  ✅ Model existence cache → HEAD requestの重複排除
 *  ✅ Error Boundary → クラッシュ時に自動リトライ
 *  ✅ frameloop="demand" → 必要な時だけ描画
 *  ✅ mipmap無効化 → GPUメモリ節約（見た目への影響なし）
 *
 *  REMOVED (壊してた):
 *  ❌ コンテキストプール制限 → アバター消えてた原因
 *  ❌ DPR制限 → ぼやけてた原因
 *  ❌ フレームスロットリング → カクカクの原因
 *  ❌ マテリアル劣化 → 見た目おかしくなってた原因
 *  ❌ テクスチャサイズ強制縮小 → ぼやけの原因
 *  ❌ メモリ圧迫検知 → 不安定で誤検知する
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
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── IntersectionObserver: only create Canvas when in/near viewport ──
  // This is THE most effective optimization. No Canvas = no WebGL context = no GPU load.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

    // Try HEAD first, assume exists on failure (let GLB loader handle it)
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

  // ── WebGL context loss/restore handling ──
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

  // DPR: use device native (sharp & clear) but cap at 2 to avoid overkill on 3x screens
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

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
        {isVisible ? (
          <Canvas
            camera={{ position: [0, 0.5, 3], fov: 35 }}
            gl={{
              alpha: true,
              antialias: false,
              powerPreference: "default",
              failIfMajorPerformanceCaveat: false,
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
                <ChibiModel
                  url={modelUrl!}
                  animationSpeed={animationSpeed}
                  userRotating={isRotating}
                  baseRotationY={Math.PI}
                />
              )}
            </Suspense>

            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.2}
              scale={2}
              blur={1}
              far={2}
              frames={1}
              resolution={64}
            />

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
          <LoadingPlaceholder size={size} />
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
