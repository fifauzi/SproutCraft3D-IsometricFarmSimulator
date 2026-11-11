import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

export const Shack3D: React.FC = () => {
  const shackPurchased = useGameStore((state) => state.shackPurchased);
  const buyShack = useGameStore((state) => state.buyShack);
  const sleepInShack = useGameStore((state) => state.sleepInShack);
  const collectFertilizerFromStorage = useGameStore((state) => state.collectFertilizerFromStorage);
  const timeInMinutes = useGameStore((state) => state.timeInMinutes);
  const money = useGameStore((state) => state.money);
  const shackCost = useGameStore((state) => state.shackCost);

  const [hovered, setHovered] = useState(false);
  const [chestHovered, setChestHovered] = useState(false);
  const sleepIconRef = useRef<THREE.Group>(null);
  const chestIconRef = useRef<THREE.Group>(null);

  const isBedtime = timeInMinutes >= 1200 || timeInMinutes < 120; // 8 PM to 2 AM

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (sleepIconRef.current) {
      sleepIconRef.current.position.y = 2.4 + Math.sin(t * 3) * 0.08;
      sleepIconRef.current.rotation.y = t * 1.5;
    }
    if (chestIconRef.current) {
      chestIconRef.current.position.y = 1.0 + Math.sin(t * 2.5) * 0.06;
    }
  });

  // If not purchased yet: Show building site foundation & signpost
  if (!shackPurchased) {
    return (
      <group
        position={[4.6, 0, -4.5]}
        onClick={(e) => {
          e.stopPropagation();
          buyShack();
        }}
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
        {/* Foundation perimeter plot */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.1, 2.6]} />
          <meshStandardMaterial
            color={hovered ? '#fbbf24' : '#78716c'}
            roughness={0.9}
            wireframe={!hovered}
          />
        </mesh>

        {/* 4 Corner Stakes */}
        {[
          [1.5, 1.2],
          [-1.5, 1.2],
          [1.5, -1.2],
          [-1.5, -1.2],
        ].map(([sx, sz], i) => (
          <mesh key={i} position={[sx, 0.25, sz]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
            <meshStandardMaterial color="#b45309" roughness={0.7} />
          </mesh>
        ))}

        {/* Builder Signpost */}
        <group position={[0, 0.45, 1.4]}>
          {/* Post */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.08]} />
            <meshStandardMaterial color="#5c3818" />
          </mesh>
          {/* Sign Board */}
          <mesh position={[0, 0.35, 0.05]} castShadow>
            <boxGeometry args={[1.5, 0.45, 0.06]} />
            <meshStandardMaterial color={hovered ? '#f59e0b' : '#d97706'} roughness={0.6} />
          </mesh>
          {/* Sign trim */}
          <mesh position={[0, 0.35, 0.09]}>
            <boxGeometry args={[1.35, 0.32, 0.02]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        </group>
      </group>
    );
  }

  // Purchased: Fully built 3D Shack
  return (
    <group position={[4.6, 0, -4.5]}>
      {/* 1. Stone Foundation */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.24, 2.8]} />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>

      {/* 2. Main Timber Cabin Structure */}
      <group
        position={[0, 0.24, 0]}
        onClick={(e) => {
          e.stopPropagation();
          sleepInShack();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = isBedtime ? 'pointer' : 'default';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Main Walls */}
        <mesh position={[0, 0.75, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.5, 2.0]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>

        {/* Corner Log Columns */}
        {[
          [1.35, 0.75, 0.75],
          [-1.35, 0.75, 0.75],
          [1.35, 0.75, -1.15],
          [-1.35, 0.75, -1.15],
        ].map(([cx, cy, cz], i) => (
          <mesh key={i} position={[cx, cy, cz]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 1.55, 8]} />
            <meshStandardMaterial color="#5c3818" roughness={0.8} />
          </mesh>
        ))}

        {/* Front Door */}
        <mesh position={[0, 0.55, 0.81]} castShadow>
          <boxGeometry args={[0.65, 1.1, 0.04]} />
          <meshStandardMaterial color={hovered ? '#b45309' : '#451a03'} roughness={0.5} />
        </mesh>
        {/* Brass Door Knob */}
        <mesh position={[0.22, 0.55, 0.84]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Window with glowing light at night */}
        <mesh position={[-0.8, 0.85, 0.81]}>
          <boxGeometry args={[0.45, 0.45, 0.04]} />
          <meshStandardMaterial
            color={isBedtime ? '#fef08a' : '#bae6fd'}
            emissive={isBedtime ? '#f59e0b' : '#000000'}
            emissiveIntensity={isBedtime ? 0.8 : 0}
            roughness={0.2}
          />
        </mesh>

        {/* Front Porch Steps & Deck */}
        <mesh position={[0, 0.06, 1.05]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.12, 0.65]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>

        {/* Porch Roof Overhang */}
        <mesh position={[0, 1.35, 1.05]} castShadow>
          <boxGeometry args={[2.2, 0.08, 0.75]} />
          <meshStandardMaterial color="#451a03" roughness={0.65} />
        </mesh>
        {/* Porch Support Posts */}
        {[-0.95, 0.95].map((px, i) => (
          <mesh key={i} position={[px, 0.7, 1.3]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.3, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))}

        {/* Cozy Lantern on Porch Post */}
        <group position={[0.95, 1.0, 1.3]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.07, 0.14, 6]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={isBedtime ? 1.0 : 0.2}
            />
          </mesh>
          {isBedtime && (
            <pointLight position={[0, 0, 0]} intensity={1.2} distance={3} color="#f59e0b" />
          )}
        </group>

        {/* Pitched Roof (A-Frame) */}
        <group position={[0, 1.85, -0.2]}>
          {/* Left Roof Plane */}
          <mesh position={[-0.85, 0.35, 0]} rotation={[0, 0, 0.65]} castShadow>
            <boxGeometry args={[1.9, 0.08, 2.3]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.6} />
          </mesh>
          {/* Right Roof Plane */}
          <mesh position={[0.85, 0.35, 0]} rotation={[0, 0, -0.65]} castShadow>
            <boxGeometry args={[1.9, 0.08, 2.3]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.6} />
          </mesh>
          {/* Roof Ridge Cap */}
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[0.15, 0.1, 2.32]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} />
          </mesh>
        </group>

        {/* Stone Chimney */}
        <mesh position={[0.85, 2.2, -0.6]} castShadow>
          <boxGeometry args={[0.35, 0.9, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </mesh>
      </group>

      {/* 3. Fertilizer Storage Chest Beside Shack */}
      <group
        position={[-1.75, 0.25, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          collectFertilizerFromStorage();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setChestHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setChestHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Chest Body */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.4, 0.45]} />
          <meshStandardMaterial color={chestHovered ? '#15803d' : '#166534'} roughness={0.7} />
        </mesh>
        {/* Chest Lid */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.7, 0.08, 0.5]} />
          <meshStandardMaterial color="#0f766e" roughness={0.6} />
        </mesh>
        {/* Metal clasps */}
        <mesh position={[0, 0.24, 0.23]}>
          <boxGeometry args={[0.08, 0.14, 0.02]} />
          <meshStandardMaterial color="#facc15" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Floating Fertilizer Indicator above chest */}
        <group ref={chestIconRef} position={[0, 0.9, 0]}>
          <mesh>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial
              color="#4ade80"
              emissive="#22c55e"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* Floating Bedtime Zzz / Sleep Alert */}
      {isBedtime && (
        <group ref={sleepIconRef} position={[0, 2.4, 0.8]}>
          <mesh>
            <torusGeometry args={[0.14, 0.04, 8, 16]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#9333ea"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
