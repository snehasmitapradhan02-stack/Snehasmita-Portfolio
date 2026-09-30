'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import useTheme from '@/hooks/useTheme';

/* -------------------------------------------------------------------------- */
/*  Particle field                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Deterministic PRNG (mulberry32). A seeded generator keeps the particle
 * layout identical across re-renders and theme switches — `Math.random()`
 * during render would make the geometry silently "jump" every time React
 * re-evaluated the memo, and is flagged by React's purity rules.
 */
function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ParticleField({ count = 340, color, accent2 }) {
  const pointsRef = useRef(null);

  const { positions, colors } = useMemo(() => {
    const random = createRandom(0x5e7a1 + count);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const base = new THREE.Color(color);
    const alt = new THREE.Color(accent2);

    for (let i = 0; i < count; i += 1) {
      const radius = 2.4 + random() * 3.4;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.7 - 1.2;

      const mix = random() * 0.75;
      const c = base.clone().lerp(alt, mix);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, [count, color, accent2]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const time = state.clock.getElapsedTime();
    points.rotation.y = time * 0.028;
    points.rotation.x = Math.sin(time * 0.12) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Orbital geometry — sits BEHIND the portrait                               */
/* -------------------------------------------------------------------------- */

function OrbitalGeometry({ color, accent2 }) {
  const group = useRef(null);
  const core = useRef(null);
  const ringA = useRef(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x = Math.sin(time * 0.16) * 0.14;
      group.current.position.y = Math.sin(time * 0.5) * 0.09;
    }
    if (core.current) {
      core.current.rotation.x += delta * 0.11;
      core.current.rotation.y += delta * 0.16;
    }
    if (ringA.current) {
      ringA.current.rotation.z += delta * 0.22;
      ringA.current.rotation.x = Math.sin(time * 0.3) * 0.5;
    }
  });

  return (
    <group ref={group} position={[0, 0, -1.4]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[2.05, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
      </mesh>

      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.75, 0.006, 6, 128]} />
        <meshBasicMaterial color={accent2} transparent opacity={0.24} />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.9, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

function Scene({ theme }) {
  const isDark = theme === 'dark';
  const color = isDark ? '#4d8bff' : '#1d4ed8';
  const accent2 = isDark ? '#22d3ee' : '#0891b2';

  return (
    <>
      <ambientLight intensity={0.6} />
      <ParticleField color={color} accent2={accent2} count={isDark ? 340 : 220} />
      <OrbitalGeometry color={color} accent2={accent2} />
    </>
  );
}

/**
 * The WebGL layer that sits behind the portrait. Dynamically imported and
 * desktop-only — it never blocks first paint and never ships to phones.
 */
export default function HeroScene() {
  const { theme } = useTheme();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Scene theme={theme} />
      </Canvas>
    </div>
  );
}
