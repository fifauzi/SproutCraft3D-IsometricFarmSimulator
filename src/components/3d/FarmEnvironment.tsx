import React from 'react';
import * as THREE from 'three';
import { Shack3D } from './Shack3D';

export const FarmEnvironment: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Extended Grassy Farm Island for 3 Sections (Left, Center, Right) */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[21.5, 0.3, 14.5]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>

      {/* Earth / Subsoil base layer */}
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[21.6, 0.3, 14.6]} />
        <meshStandardMaterial color="#57381f" roughness={0.9} />
      </mesh>

      {/* Decorative Cobblestone Stepping Stones / Pathways */}
      <PathwayDecor />

      {/* 2. Wooden Perimeter Post-and-Rail Fences */}
      <PerimeterFences />

      {/* 3. Stone Water Well with Bucket */}
      <group position={[-8.8, 0, -5.2]}>
        <StoneWaterWell />
      </group>

      {/* 4. Purchasable Player Shack & Fertilizer Storage */}
      <group position={[7.8, 0, -4.5]}>
        <Shack3D />
      </group>

      {/* 5. Cozy Farm Trees */}
      <group position={[-9.2, 0, 4.8]}>
        <FruitTree hasApples={false} />
      </group>
      <group position={[9.2, 0, 4.8]}>
        <FruitTree hasApples={true} />
      </group>

      {/* 6. Hay Bales & Crates */}
      <group position={[-7.2, 0, -5.2]}>
        <HayBaleStack />
      </group>
      <group position={[8.8, 0, 2.2]}>
        <VegetableCrates />
      </group>
    </group>
  );
};

// ==========================================
// PATHWAYS BETWEEN SECTIONS
// ==========================================
const PathwayDecor: React.FC = () => {
  // Natural stepping stones dividing Left, Center, and Right sections
  const stones: [number, number, number, number][] = [
    // Dividing path between Left & Center (X ~ -3.0)
    [-2.9, -0.05, -2.0, 0.38],
    [-2.9, -0.05, -0.7, 0.36],
    [-2.9, -0.05, 0.6, 0.4],
    [-2.9, -0.05, 1.9, 0.35],
    // Dividing path between Center & Right (X ~ +3.0)
    [2.9, -0.05, -2.0, 0.36],
    [2.9, -0.05, -0.7, 0.4],
    [2.9, -0.05, 0.6, 0.38],
    [2.9, -0.05, 1.9, 0.36],
    // Front path leading towards well & shack
    [0, -0.05, 3.2, 0.42],
    [-1.4, -0.05, 3.2, 0.36],
    [1.4, -0.05, 3.2, 0.38],
  ];

  return (
    <group>
      {stones.map(([x, y, z, radius], idx) => (
        <mesh key={idx} position={[x, y + 0.052, z]} receiveShadow rotation={[-Math.PI / 2, 0, idx]}>
          <circleGeometry args={[radius, 7]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
};

// ==========================================
// PERIMETER FENCES
// ==========================================
const PerimeterFences: React.FC = () => {
  const postPositions: [number, number][] = [
    // North edge
    [-10, -6.5], [-6.5, -6.5], [-3, -6.5], [0, -6.5], [3, -6.5], [6.5, -6.5], [10, -6.5],
    // South edge
    [-10, 6.5], [-6.5, 6.5], [-3, 6.5], [0, 6.5], [3, 6.5], [6.5, 6.5], [10, 6.5],
    // West edge
    [-10, -3.5], [-10, 0], [-10, 3.5],
    // East edge
    [10, -3.5], [10, 0], [10, 3.5],
  ];

  return (
    <group position={[0, 0, 0]}>
      {postPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.65, 0.16]} />
          <meshStandardMaterial color="#784b23" roughness={0.7} />
        </mesh>
      ))}

      {/* Horizontal Rails */}
      {[-6.5, 6.5].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[19.8, 0.06, 0.06]} />
            <meshStandardMaterial color="#8b572a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[19.8, 0.06, 0.06]} />
            <meshStandardMaterial color="#8b572a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {[-10, 10].map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.06, 0.06, 12.8]} />
            <meshStandardMaterial color="#8b572a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.06, 12.8]} />
            <meshStandardMaterial color="#8b572a" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ==========================================
// STONE WATER WELL
// ==========================================
const StoneWaterWell: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.72, 0.5, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 12]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.2} />
      </mesh>
      <mesh position={[-0.5, 0.75, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh position={[0.5, 0.75, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.08]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <group position={[0, 1.35, 0]}>
        <mesh rotation={[0, 0, 0.4]} position={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.05, 1.1]} />
          <meshStandardMaterial color="#854d0e" roughness={0.65} />
        </mesh>
        <mesh rotation={[0, 0, -0.4]} position={[0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.05, 1.1]} />
          <meshStandardMaterial color="#854d0e" roughness={0.65} />
        </mesh>
      </group>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.09, 0.18, 8]} />
        <meshStandardMaterial color="#a16207" roughness={0.6} />
      </mesh>
    </group>
  );
};

// ==========================================
// FRUIT / OAK TREE
// ==========================================
const FruitTree: React.FC<{ hasApples?: boolean }> = ({ hasApples = false }) => {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 1.6, 7]} />
        <meshStandardMaterial color="#5c3818" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
      <mesh position={[-0.35, 1.5, 0.3]} castShadow>
        <sphereGeometry args={[0.65, 7, 7]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
      <mesh position={[0.35, 1.6, -0.25]} castShadow>
        <sphereGeometry args={[0.7, 7, 7]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>

      {hasApples && (
        <group>
          {[
            [-0.4, 1.5, 0.6],
            [0.5, 1.6, 0.3],
            [-0.2, 1.9, -0.6],
            [0.3, 1.8, -0.4],
          ].map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]} castShadow>
              <sphereGeometry args={[0.07, 6, 6]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.1} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// ==========================================
// HAY BALES
// ==========================================
const HayBaleStack: React.FC = () => {
  return (
    <group position={[0, 0.2, 0]}>
      <mesh position={[0, 0, 0]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.45, 0.55]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.85} />
      </mesh>
      <mesh position={[0.6, 0, 0.1]} rotation={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.45, 0.55]} />
        <meshStandardMaterial color="#d97706" roughness={0.85} />
      </mesh>
      <mesh position={[0.3, 0.42, 0.05]} rotation={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.45, 0.55]} />
        <meshStandardMaterial color="#eab308" roughness={0.85} />
      </mesh>
    </group>
  );
};

// ==========================================
// VEGETABLE CRATES
// ==========================================
const VegetableCrates: React.FC = () => {
  return (
    <group position={[0, 0.15, 0]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.3, 0.45]} />
        <meshStandardMaterial color="#854d0e" roughness={0.7} />
      </mesh>
      <mesh position={[0.5, 0, -0.1]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#713f12" roughness={0.7} />
      </mesh>
      <group position={[0, 0.18, 0]}>
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <sphereGeometry args={[0.07, 6, 6]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
        ))}
      </group>
    </group>
  );
};
