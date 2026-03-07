"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────
 *  ChibiModel — loads a GLB and adds idle animations
 *  Tripo AI GLB models typically don't include skeletal anims,
 *  so we add programmatic breathing / sway / bounce.
 * ───────────────────────────────────────────── */

function ChibiModel({
  url,
  animationSpeed = 1,
  autoRotate = false,
}: {
  url: string;
  animationSpeed?: number;
  autoRotate?: boolean;
}) {
  const { scene, animations } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null!);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

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

  // Auto-center, auto-scale, and fix rotation to face front
  useEffect(() => {
    // Rotate model to face the camera (fix sideways orientation)
    scene.rotation.y = Math.PI;

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);

    // Re-center after scaling
    const scaledCenter = center.multiplyScalar(scale);
    scene.position.set(-scaledCenter.x, -scaledCenter.y + (size.y * scale) / 2 - 1, -scaledCenter.z);
  }, [scene]);

  useFrame((state, delta) => {
    // Update embedded animations
    if (mixerRef.current) {
      mixerRef.current.update(delta * animationSpeed);
    }

    const t = state.clock.getElapsedTime() * animationSpeed;
    const group = groupRef.current;
    if (!group) return;

    // Idle breathing — gentle Y-axis scale oscillation
    const breathe = 1 + Math.sin(t * 1.5) * 0.02;
    group.scale.set(1, breathe, 1);

    // Gentle sway — slight rotation around Y (more visible)
    group.rotation.y = autoRotate
      ? t * 0.3
      : Math.sin(t * 0.8) * 0.15;

    // Bouncy hop — livelier Y translation
    group.position.y = Math.abs(Math.sin(t * 1.2)) * 0.06;

    // Subtle lean — slight X-axis tilt following sway
    group.rotation.z = Math.sin(t * 0.8) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ─────────────────────────────────────────────
 *  FallbackModel — simple chibi silhouette
 *  shown while GLB loads or if it fails
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
      {/* Head */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#f5c0d0" />
      </mesh>
      {/* Body */}
      <mesh position={[0, -0.25, 0]}>
        <capsuleGeometry args={[0.3, 0.5, 16, 16]} />
        <meshStandardMaterial color="#9b8afb" />
      </mesh>
      {/* Eyes */}
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
 *  LoadingSpinner — shows while model loads
 * ───────────────────────────────────────────── */
function LoadingSpinner() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 2;
    }
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
 *  Renders a Three.js canvas with the GLB model
 * ───────────────────────────────────────────── */
export default function Avatar3D({
  modelUrl,
  size = 120,
  className = "",
  autoRotate = false,
  animationSpeed = 1,
}: {
  modelUrl?: string;
  size?: number;
  className?: string;
  autoRotate?: boolean;
  animationSpeed?: number;
}) {
  const [hasError, setHasError] = useState(false);
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  // Check if the model file exists
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

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        onError={() => setHasError(true)}
      >
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1} castShadow />
        <directionalLight position={[-2, 3, -1]} intensity={0.3} />

        {/* Environment — soft studio-like reflections */}
        <Environment preset="city" />

        {/* Model */}
        <Suspense fallback={<LoadingSpinner />}>
          {showFallback ? (
            <FallbackModel />
          ) : (
            <ChibiModel
              url={modelUrl!}
              animationSpeed={animationSpeed}
              autoRotate={autoRotate}
            />
          )}
        </Suspense>

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.3}
          scale={3}
          blur={2}
          far={2}
        />

        {/* Subtle interactive orbit (disabled for plaza, enabled for preview) */}
        {autoRotate && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        )}
      </Canvas>
    </div>
  );
}

// Pre-load hint for GLB
export function preloadModel(url: string) {
  useGLTF.preload(url);
}
