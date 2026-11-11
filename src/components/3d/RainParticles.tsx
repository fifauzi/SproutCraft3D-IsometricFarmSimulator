import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

const RAIN_COUNT = 450;

export const RainParticles: React.FC = () => {
  const weather = useGameStore((state) => state.weather);
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3);
    const spd = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 18; // X span
      pos[i * 3 + 1] = Math.random() * 12 + 0.2; // Y height (0.2 to 12)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18; // Z span
      spd[i] = 7.0 + Math.random() * 4.0; // speed
    }

    return [pos, spd];
  }, []);

  useFrame((_, delta) => {
    if (weather !== 'rainy' || !pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < RAIN_COUNT; i++) {
      // Move downward
      array[i * 3 + 1] -= speeds[i] * delta;

      // Subtle wind slant
      array[i * 3 + 0] += 1.2 * delta;

      // Reset to top when hitting the ground
      if (array[i * 3 + 1] < 0.1) {
        array[i * 3 + 1] = 10 + Math.random() * 2;
        array[i * 3 + 0] = (Math.random() - 0.5) * 18;
        array[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
    }

    posAttr.needsUpdate = true;
  });

  if (weather !== 'rainy') return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7dd3fc"
        size={0.07}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
};
