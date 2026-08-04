'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Hero3D — abstract "core" visual for the hero.
 * A rotating icosahedron wireframe + orbiting particle field.
 *
 * Performance gates (in parent):
 *  - prefers-reduced-motion → not rendered
 *  - low deviceMemory / no WebGL → fallback (static gradient)
 *  - lazy-loaded via dynamic import → not in initial bundle
 */

function ParticleField({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  // Generate positions once (memoized by useRef)
  const positions = useRef(
    new Float32Array(
      Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 6)
    )
  ).current;

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FF5A00"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15;
      ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#0A1628"
        wireframe
        emissive="#FF5A00"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

export default function Hero3D() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null; // parent falls back to static gradient
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ opacity: 0.9 }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 1.5]} // cap devicePixelRatio for perf
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          // If WebGL context fails, fall back silently
          if (!gl.getContext()) setFailed(true);
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 2, 3]} intensity={1.2} color="#FF5A00" />
        <Core />
        <ParticleField />
      </Canvas>
    </div>
  );
}
