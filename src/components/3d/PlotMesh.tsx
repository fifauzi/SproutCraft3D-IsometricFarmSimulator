import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SoilPlot } from '../../types/game';
import { Crop3D } from './Crop3D';
import { useGameStore } from '../../store/gameStore';

interface PlotMeshProps {
  plot: SoilPlot;
  position: [number, number, number];
}

export const PlotMesh: React.FC<PlotMeshProps> = ({ plot, position }) => {
  const [hovered, setHovered] = useState(false);
  const interactWithPlot = useGameStore((state) => state.interactWithPlot);
  const selectedTool = useGameStore((state) => state.selectedTool);
  const dropletRef = useRef<THREE.Group>(null);
  const sparkleRef = useRef<THREE.Group>(null);

  // If locked, render dormant plot
  if (!plot.isUnlocked) {
    return (
      <group
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          interactWithPlot(plot.id);
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
        {/* Dormant Plot Frame */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshStandardMaterial
            color={hovered ? '#475569' : '#334155'}
            roughness={0.9}
          />
        </mesh>
        {/* Overgrown grass top */}
        <mesh position={[0, 0.11, 0]} receiveShadow>
          <boxGeometry args={[1.34, 0.04, 1.34]} />
          <meshStandardMaterial color="#2d5a3f" roughness={0.95} />
        </mesh>
      </group>
    );
  }

  // Active Unlocked Plot
  let soilColor = plot.isMoist ? '#24140d' : '#856447';
  if (plot.isFertilized) {
    soilColor = plot.isMoist ? '#170c08' : '#573d2b';
  }
  const soilRoughness = plot.isMoist ? 0.55 : 0.9;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (dropletRef.current) {
      dropletRef.current.position.y = 0.8 + Math.sin(t * 3.5 + plot.id) * 0.08;
      dropletRef.current.rotation.y = t * 1.8;
    }
    if (sparkleRef.current) {
      sparkleRef.current.rotation.y = t * 0.8;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    interactWithPlot(plot.id);
  };

  const getCursor = () => {
    if (plot.crop && plot.stage === 3) return 'pointer';
    if (!plot.crop) return 'pointer';
    if (!plot.isMoist) return 'pointer';
    if (!plot.isFertilized && selectedTool === 'fertilize') return 'pointer';
    return selectedTool !== 'smart' ? 'pointer' : 'default';
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = getCursor();
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Wooden Raised Planter Frame */}
      <group position={[0, 0.08, 0]}>
        <mesh position={[0, 0, 0.72]} castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.16, 0.12]} />
          <meshStandardMaterial color="#6b4423" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, -0.72]} castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.16, 0.12]} />
          <meshStandardMaterial color="#5c3818" roughness={0.7} />
        </mesh>
        <mesh position={[0.72, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.16, 1.32]} />
          <meshStandardMaterial color="#5c3818" roughness={0.7} />
        </mesh>
        <mesh position={[-0.72, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.16, 1.32]} />
          <meshStandardMaterial color="#6b4423" roughness={0.7} />
        </mesh>
        {[
          [0.72, 0.72],
          [-0.72, 0.72],
          [0.72, -0.72],
          [-0.72, -0.72],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0.02, cz]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color="#3e230e" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Soil Mound Mesh */}
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <boxGeometry args={[1.32, 0.12, 1.32]} />
        <meshStandardMaterial
          color={soilColor}
          roughness={soilRoughness}
          metalness={plot.isMoist ? 0.08 : 0.0}
        />
      </mesh>

      {/* Soil Furrows */}
      <group position={[0, 0.132, 0]}>
        {[-0.35, 0, 0.35].map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]} receiveShadow>
            <boxGeometry args={[1.2, 0.015, 0.14]} />
            <meshStandardMaterial
              color={plot.isMoist ? '#140a06' : '#6b4f35'}
              roughness={soilRoughness}
            />
          </mesh>
        ))}
      </group>

      {/* Fertilized Visual Indicator */}
      {plot.isFertilized && (
        <group ref={sparkleRef} position={[0, 0.145, 0]}>
          {[
            [-0.35, -0.3],
            [0.3, -0.35],
            [-0.25, 0.32],
            [0.35, 0.28],
            [0.0, 0.0],
          ].map(([sx, sz], i) => (
            <mesh key={i} position={[sx, 0, sz]}>
              <boxGeometry args={[0.04, 0.01, 0.04]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#ca8a04"
                emissiveIntensity={0.5}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Interactive Selection Highlight Ring */}
      {hovered && (
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.76, 32]} />
          <meshBasicMaterial
            color={
              plot.crop && plot.stage === 3
                ? '#facc15'
                : selectedTool === 'fertilize'
                ? '#84cc16'
                : !plot.crop
                ? '#4ade80'
                : !plot.isMoist
                ? '#38bdf8'
                : '#e2e8f0'
            }
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Placed Crop */}
      {plot.crop && (
        <group position={[0, 0.14, 0]}>
          <Crop3D
            crop={plot.crop}
            stage={plot.stage}
            progress={plot.growthProgress}
            isMoist={plot.isMoist}
          />
        </group>
      )}

      {/* 3D Need Water Droplet Alert */}
      {plot.crop && !plot.isMoist && plot.stage < 3 && (
        <group ref={dropletRef} position={[0, 0.8, 0]}>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.07, 0.14, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -0.01, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.4}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
