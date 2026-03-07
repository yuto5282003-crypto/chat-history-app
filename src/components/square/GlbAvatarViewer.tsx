"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Model({ url, autoRotate }: { url: string; autoRotate?: boolean }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Center>
      <group ref={ref}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

function Fallback({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full rounded-2xl" style={{ background: "var(--gradient-soft)" }}>
      <div className="text-center">
        <div
          className="mx-auto flex items-center justify-center rounded-full text-white font-bold text-3xl"
          style={{ width: 80, height: 80, background: "var(--gradient-main)" }}
        >
          {name.charAt(0)}
        </div>
        <p className="mt-2 text-[11px] font-medium" style={{ color: "var(--muted)" }}>
          3Dモデル準備中
        </p>
      </div>
    </div>
  );
}

export default function GlbAvatarViewer({
  glbPath,
  name,
  size = 200,
  autoRotate = true,
  className,
}: {
  glbPath?: string;
  name: string;
  size?: number;
  autoRotate?: boolean;
  className?: string;
}) {
  if (!glbPath) {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <Fallback name={name} />
      </div>
    );
  }

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 1.2, 2.5], fov: 35 }}
        style={{ borderRadius: 16 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 1]} intensity={0.8} />
        <Suspense fallback={null}>
          <Model url={glbPath} autoRotate={autoRotate} />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.3} blur={2} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
