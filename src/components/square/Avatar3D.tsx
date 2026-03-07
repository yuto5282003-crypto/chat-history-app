"use client";

import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────
 *  ChibiModel — loads a GLB and adds walking animation
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

  // Play embedded animations if the GLB has them
  useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;
      animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });
      return () => {
        mixer.stopAllAction();
        mixer.uncacheRoot(scene);
      };
    }
  }, [scene, animations]);

  // Auto-center, auto-scale, find bones
  useEffect(() => {
    // Reset rotation — let the GLB's native orientation be the base
    // Then apply baseRotationY to correct facing direction
    scene.rotation.set(0, baseRotationY, 0);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);

    const scaledCenter = center.multiplyScalar(scale);
    scene.position.set(
      -scaledCenter.x,
      -scaledCenter.y + (size.y * scale) / 2 - 1,
      -scaledCenter.z,
    );

    // Find bones for walking animation
    const bones: typeof bonesRef.current = {};
    scene.traverse((child) => {
      const name = child.name.toLowerCase();
      if (child instanceof THREE.Bone) {
        if (name.includes("left") && (name.includes("arm") || name.includes("hand") || name.includes("upper_arm"))) {
          bones.leftArm = child;
        } else if (name.includes("right") && (name.includes("arm") || name.includes("hand") || name.includes("upper_arm"))) {
          bones.rightArm = child;
        } else if (name.includes("left") && (name.includes("leg") || name.includes("thigh") || name.includes("upper_leg"))) {
          bones.leftLeg = child;
        } else if (name.includes("right") && (name.includes("leg") || name.includes("thigh") || name.includes("upper_leg"))) {
          bones.rightLeg = child;
        } else if (name.includes("spine") || name.includes("torso") || name.includes("chest")) {
          bones.spine = child;
        } else if (name.includes("head") || name.includes("neck")) {
          bones.head = child;
        }
      }
    });
    bonesRef.current = bones;
  }, [scene, baseRotationY]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta * animationSpeed);
    }

    const t = state.clock.getElapsedTime() * animationSpeed;
    const group = groupRef.current;
    if (!group) return;

    const bones = bonesRef.current;
    const hasBones = !!(bones.leftArm || bones.leftLeg);
    const walkCycle = t * 2.5;

    if (hasBones) {
      const swing = Math.sin(walkCycle);
      const swingAlt = Math.sin(walkCycle + Math.PI);
      if (bones.leftArm) bones.leftArm.rotation.x = swing * 0.4;
      if (bones.rightArm) bones.rightArm.rotation.x = swingAlt * 0.4;
      if (bones.leftLeg) bones.leftLeg.rotation.x = swingAlt * 0.35;
      if (bones.rightLeg) bones.rightLeg.rotation.x = swing * 0.35;
      if (bones.spine) {
        bones.spine.rotation.z = Math.sin(walkCycle) * 0.03;
        bones.spine.rotation.y = Math.sin(walkCycle * 0.5) * 0.02;
      }
      if (bones.head) bones.head.rotation.x = Math.sin(walkCycle * 2) * 0.02;
    }

    // Walking bob
    group.position.y = Math.abs(Math.sin(walkCycle)) * 0.04;

    // Breathing
    const breathe = 1 + Math.sin(t * 1.5) * 0.015;
    group.scale.set(1, breathe, 1);

    // Body sway
    group.rotation.z = Math.sin(walkCycle) * 0.04;

    // When user is rotating via OrbitControls, don't override Y rotation
    if (!userRotating) {
      group.rotation.y = Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ─────────────────────────────────────────────
 *  FallbackModel
 * ───────────────────────────────────────────── */
function FallbackModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.6) * 0.1;
      ref.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#f5c0d0" />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <capsuleGeometry args={[0.3, 0.5, 16, 16]} />
        <meshStandardMaterial color="#9b8afb" />
      </mesh>
      <mesh position={[-0.15, 0.6, 0.38]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.15, 0.6, 0.38]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
 *  LoadingSpinner
 * ───────────────────────────────────────────── */
function LoadingSpinner() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 2;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.3, 0.05, 16, 32]} />
      <meshStandardMaterial color="#9b8afb" />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
 *  Avatar3D — the public component
 *  Supports long-press to rotate the model
 * ───────────────────────────────────────────── */
export default function Avatar3D({
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
  /** Enable long-press to let user rotate the model */
  enableLongPressRotate?: boolean;
  /** Callback when rotation mode changes */
  onRotatingChange?: (rotating: boolean) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const [modelExists, setModelExists] = useState<boolean | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modelUrl) {
      setModelExists(false);
      return;
    }
    fetch(modelUrl, { method: "HEAD" })
      .then((res) => setModelExists(res.ok))
      .catch(() => setModelExists(false));
  }, [modelUrl]);

  const showFallback = !modelUrl || hasError || modelExists === false;

  // Long press handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!enableLongPressRotate) return;
    e.stopPropagation();
    longPressTimer.current = setTimeout(() => {
      setIsRotating(true);
      onRotatingChange?.(true);
    }, 500);
  }, [enableLongPressRotate, onRotatingChange]);

  const handlePointerUp = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  const handlePointerLeave = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  // Close rotation mode when tapping outside
  useEffect(() => {
    if (!isRotating) return;
    const handleClickOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsRotating(false);
        onRotatingChange?.(false);
      }
    };
    // Delay to avoid immediate trigger
    const timer = setTimeout(() => {
      document.addEventListener("pointerdown", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isRotating, onRotatingChange]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: isRotating ? "12px" : "50%",
        overflow: "hidden",
        background: "transparent",
        position: "relative",
        transition: "border-radius 0.3s, box-shadow 0.3s",
        boxShadow: isRotating ? "0 0 0 2px rgba(155,138,251,0.6), 0 0 12px rgba(155,138,251,0.3)" : "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        onError={() => setHasError(true)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1} castShadow />
        <directionalLight position={[-2, 3, -1]} intensity={0.3} />
        <Environment preset="city" />

        <Suspense fallback={<LoadingSpinner />}>
          {showFallback ? (
            <FallbackModel />
          ) : (
            <ChibiModel
              url={modelUrl!}
              animationSpeed={animationSpeed}
              userRotating={isRotating}
              baseRotationY={-Math.PI / 2}
            />
          )}
        </Suspense>

        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.3}
          scale={3}
          blur={2}
          far={2}
        />

        {/* OrbitControls — enabled during rotation mode or autoRotate */}
        {(isRotating || autoRotate) && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate && !isRotating}
            autoRotateSpeed={1.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.8}
          />
        )}
      </Canvas>

      {/* Rotation mode indicator */}
      {isRotating && (
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-bold text-white whitespace-nowrap"
          style={{
            background: "rgba(155,138,251,0.8)",
            backdropFilter: "blur(4px)",
          }}
        >
          ドラッグで回転
        </div>
      )}

      {/* Long press hint — shown briefly on hover */}
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
}

export function preloadModel(url: string) {
  useGLTF.preload(url);
}
