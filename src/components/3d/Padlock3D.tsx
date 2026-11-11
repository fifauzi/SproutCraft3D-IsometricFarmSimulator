import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

interface Padlock3DProps {
  section: 'left' | 'right';
  position: [number, number, number];
}

export const Padlock3D: React.FC<Padlock3DProps> = ({ section, position }) => {
  const day = useGameStore((state) => state.day);
  const unlockSection = useGameStore((state) => state.unlockSection);
  const [hovered, setHovered] = useState(false);
  const lockRef = useRef<THREE.Group>(null);

  const canUnlock = day >= 30;

  useFrame(({ clock }) => {
    if (lockRef.current) {
      const t = clock.getElapsedTime();
      lockRef.current.position.y = 1.6 + Math.sin(t * 2.5 + (section === 'left' ? 0 : 1.5)) * 0.12;
      lockRef.current.rotation.y = Math.sin(t * 1.5) * 0.15;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    unlockSection(section);
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Translucent boundary zone plane */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.06, 5.2]} />
        <meshStandardMaterial
          color={hovered ? '#fbbf24' : '#64748b'}
          transparent
          opacity={0.35}
          roughness={0.8}
        />
      </mesh>

      {/* Floating 3D Golden Padlock */}
      <group ref={lockRef} position={[0, 1.6, 0]}>
        {/* Padlock Brass Body */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.45, 0.22]} />
          <meshStandardMaterial
            color={canUnlock ? '#22c55e' : '#f59e0b'}
            metalness={0.7}
            roughness={0.25}
            emissive={hovered ? '#fbbf24' : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </mesh>

        {/* Shackle (Torus) */}
        <mesh position={[0, 0.28, 0]} rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.18, 0.045, 8, 18, Math.PI]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Keyhole */}
        <mesh position={[0, -0.04, 0.115]}>
          <circleGeometry args={[0.04, 8]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, -0.1, 0.115]}>
          <planeGeometry args={[0.03, 0.07]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>

        {/* Signplate */}
        <group position={[0, -0.4, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 0.32, 0.04]} />
            <meshStandardMaterial
              color={canUnlock ? '#15803d' : '#1e293b'}
              roughness={0.7}
            />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[1.7, 0.26]} />
            <meshBasicMaterial color={canUnlock ? '#22c55e' : '#334155'} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
