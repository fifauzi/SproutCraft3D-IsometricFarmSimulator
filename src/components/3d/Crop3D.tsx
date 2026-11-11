import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { CropType, GrowthStage } from '../../types/game';

interface Crop3DProps {
  crop: CropType;
  stage: GrowthStage;
  progress: number;
  isMoist: boolean;
}

export const Crop3D: React.FC<Crop3DProps> = ({ crop, stage, progress, isMoist }) => {
  const swayRef = useRef<THREE.Group>(null);

  // Smooth pop-in scale and stage transitions using React Spring
  const targetScale = stage === 0 ? 0.45 : stage === 1 ? 0.75 : stage === 2 ? 0.95 : 1.15;
  const { scale } = useSpring({
    scale: [targetScale, targetScale, targetScale] as [number, number, number],
    config: { tension: 220, friction: 18 },
  });

  // Gentle wind sway animation
  useFrame(({ clock }) => {
    if (swayRef.current) {
      const t = clock.getElapsedTime();
      const speed = isMoist ? 2.5 : 1.0;
      const intensity = stage === 3 ? 0.05 : 0.03;
      swayRef.current.rotation.z = Math.sin(t * speed + stage) * intensity;
      swayRef.current.rotation.x = Math.cos(t * speed * 0.8 + stage) * (intensity * 0.5);
    }
  });

  return (
    <a.group scale={scale as unknown as [number, number, number]}>
      <group ref={swayRef}>
        {crop === 'corn' && <CornModel stage={stage} />}
        {crop === 'carrot' && <CarrotModel stage={stage} />}
        {crop === 'wheat' && <WheatModel stage={stage} />}
        {crop === 'pumpkin' && <PumpkinModel stage={stage} />}
      </group>

      {/* Mature harvest aura / sparkle indicator */}
      {stage === 3 && <MatureAura />}
    </a.group>
  );
};

// ==========================================
// 1. CORN PROCEDURAL MODEL (3-10 parts)
// ==========================================
const CornModel: React.FC<{ stage: GrowthStage }> = ({ stage }) => {
  if (stage === 0) {
    // Stage 0: Little shoot
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.12, 6]} />
          <meshStandardMaterial color="#86efac" roughness={0.6} />
        </mesh>
        <mesh position={[0.03, 0.12, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.06, 0.02, 0.03]} />
          <meshStandardMaterial color="#4ade80" roughness={0.5} />
        </mesh>
      </group>
    );
  }

  if (stage === 1) {
    // Stage 1: Sprout
    return (
      <group position={[0, 0, 0]}>
        {/* Main stem */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 0.36, 7]} />
          <meshStandardMaterial color="#22c55e" roughness={0.5} />
        </mesh>
        {/* Arching leaves */}
        {[-0.6, 0.6].map((rotZ, i) => (
          <group key={i} position={[0, 0.2 + i * 0.05, 0]} rotation={[0, (i * Math.PI) / 2, rotZ]}>
            <mesh position={[0.12, 0.04, 0]} rotation={[0, 0, 0.2]} castShadow>
              <boxGeometry args={[0.22, 0.02, 0.06]} />
              <meshStandardMaterial color="#16a34a" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (stage === 2) {
    // Stage 2: Tall growing stalk
    return (
      <group position={[0, 0, 0]}>
        {/* Stalk */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.45} />
        </mesh>
        {/* Nodes / leaf layers */}
        {[0.2, 0.35, 0.5].map((y, idx) => (
          <group key={idx} position={[0, y, 0]} rotation={[0, idx * 1.3, 0]}>
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
              <boxGeometry args={[0.34, 0.02, 0.08]} />
              <meshStandardMaterial color="#22c55e" roughness={0.4} />
            </mesh>
            <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.3]} castShadow>
              <boxGeometry args={[0.34, 0.02, 0.08]} />
              <meshStandardMaterial color="#15803d" roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Small top tassel */}
        <mesh position={[0, 0.74, 0]}>
          <coneGeometry args={[0.04, 0.14, 6]} />
          <meshStandardMaterial color="#fef08a" roughness={0.6} />
        </mesh>
      </group>
    );
  }

  // Stage 3: Mature Golden Corn
  return (
    <group position={[0, 0, 0]}>
      {/* Tall Main Stalk */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.07, 0.84, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.4} />
      </mesh>

      {/* Broad Ribbon Leaves */}
      {[0.22, 0.4, 0.58].map((y, idx) => (
        <group key={idx} position={[0, y, 0]} rotation={[0, idx * 1.2 + 0.4, 0]}>
          <mesh position={[0.22, -0.04, 0]} rotation={[0, 0, -0.45]} castShadow>
            <boxGeometry args={[0.42, 0.025, 0.09]} />
            <meshStandardMaterial color="#16a34a" roughness={0.35} />
          </mesh>
          <mesh position={[-0.22, -0.04, 0]} rotation={[0, 0, 0.45]} castShadow>
            <boxGeometry args={[0.42, 0.025, 0.09]} />
            <meshStandardMaterial color="#15803d" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Golden Corn Cob 1 */}
      <group position={[0.08, 0.38, 0.04]} rotation={[0.2, 0.3, -0.4]}>
        {/* Green Husk wrapper */}
        <mesh position={[-0.02, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.04, 0.22, 6]} />
          <meshStandardMaterial color="#65a30d" roughness={0.5} />
        </mesh>
        {/* Golden Cob with kernel texture */}
        <mesh position={[0.04, 0.04, 0]} castShadow>
          <capsuleGeometry args={[0.045, 0.16, 4, 8]} />
          <meshStandardMaterial color="#facc15" roughness={0.25} metalness={0.1} />
        </mesh>
        {/* Silk Tassel */}
        <mesh position={[0.07, 0.14, 0]}>
          <coneGeometry args={[0.025, 0.07, 5]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} />
        </mesh>
      </group>

      {/* Golden Corn Cob 2 */}
      <group position={[-0.08, 0.46, -0.04]} rotation={[-0.2, -0.3, 0.4]}>
        <mesh position={[0.02, 0, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.04, 0.2, 6]} />
          <meshStandardMaterial color="#65a30d" roughness={0.5} />
        </mesh>
        <mesh position={[-0.03, 0.03, 0]} castShadow>
          <capsuleGeometry args={[0.042, 0.15, 4, 8]} />
          <meshStandardMaterial color="#eab308" roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[-0.06, 0.13, 0]}>
          <coneGeometry args={[0.022, 0.06, 5]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} />
        </mesh>
      </group>

      {/* Top Pollen Tassel */}
      <group position={[0, 0.88, 0]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.02, 0.1, 5]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
        {[-0.3, 0, 0.3].map((r, i) => (
          <mesh key={i} position={[r * 0.08, 0.06, 0]} rotation={[0, 0, r]}>
            <cylinderGeometry args={[0.008, 0.012, 0.14, 4]} />
            <meshStandardMaterial color="#fef08a" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ==========================================
// 2. CARROT PROCEDURAL MODEL
// ==========================================
const CarrotModel: React.FC<{ stage: GrowthStage }> = ({ stage }) => {
  if (stage === 0) {
    return (
      <group position={[0, 0.04, 0]}>
        <mesh rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.02, 0.09, 5]} />
          <meshStandardMaterial color="#86efac" />
        </mesh>
      </group>
    );
  }
  if (stage === 1) {
    return (
      <group position={[0, 0.06, 0]}>
        {[-0.3, 0, 0.3].map((rot, i) => (
          <mesh key={i} position={[rot * 0.05, 0.08, 0]} rotation={[0, (i * Math.PI) / 3, rot]}>
            <boxGeometry args={[0.03, 0.16, 0.03]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        ))}
      </group>
    );
  }
  if (stage === 2) {
    return (
      <group position={[0, 0.08, 0]}>
        {/* Emerging carrot shoulder */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.06, 8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} />
        </mesh>
        {/* Foliage */}
        {[0, 1.2, 2.4, 3.6].map((rot, i) => (
          <group key={i} rotation={[0, rot, 0]}>
            <mesh position={[0.06, 0.16, 0]} rotation={[0, 0, -0.3]}>
              <coneGeometry args={[0.04, 0.32, 5]} />
              <meshStandardMaterial color="#16a34a" />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
  // Mature Carrot
  return (
    <group position={[0, 0.08, 0]}>
      {/* Bold Orange Carrot Root top poking out */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.07, 0.12, 10]} />
        <meshStandardMaterial color="#f97316" roughness={0.35} />
      </mesh>
      {/* Crown leaf rings */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.03, 8]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      {/* Bushy fronds */}
      {[0, 0.9, 1.8, 2.7, 3.6, 4.5].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]} position={[0, 0.08, 0]}>
          <mesh position={[0.08, 0.22, 0]} rotation={[0, 0, -0.35]} castShadow>
            <cylinderGeometry args={[0.015, 0.025, 0.44, 5]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
          <mesh position={[0.16, 0.32, 0]} rotation={[0, 0, -0.45]}>
            <coneGeometry args={[0.07, 0.22, 6]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ==========================================
// 3. WHEAT PROCEDURAL MODEL
// ==========================================
const WheatModel: React.FC<{ stage: GrowthStage }> = ({ stage }) => {
  if (stage === 0) {
    return (
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.02, 0.1, 4]} />
        <meshStandardMaterial color="#a3e635" />
      </mesh>
    );
  }
  if (stage === 1) {
    return (
      <group position={[0, 0.1, 0]}>
        {[-0.2, 0.2].map((r, i) => (
          <mesh key={i} position={[r * 0.1, 0.06, 0]} rotation={[0, 0, r]}>
            <cylinderGeometry args={[0.015, 0.02, 0.22, 4]} />
            <meshStandardMaterial color="#84cc16" />
          </mesh>
        ))}
      </group>
    );
  }
  if (stage === 2) {
    return (
      <group position={[0, 0.2, 0]}>
        {[-0.08, 0, 0.08].map((x, i) => (
          <group key={i} position={[x, 0, (i - 1) * 0.04]} rotation={[0, 0, (x / 0.08) * 0.15]}>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.018, 0.45, 5]} />
              <meshStandardMaterial color="#a16207" />
            </mesh>
            <mesh position={[0, 0.34, 0]}>
              <cylinderGeometry args={[0.03, 0.02, 0.16, 6]} />
              <meshStandardMaterial color="#ca8a04" />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
  // Mature Wheat Sheaf
  return (
    <group position={[0, 0, 0]}>
      {[-0.09, -0.03, 0.04, 0.1].map((x, idx) => {
        const z = (idx % 2 === 0 ? 0.05 : -0.05);
        return (
          <group key={idx} position={[x, 0, z]} rotation={[0.05 * idx, 0, (x / 0.1) * 0.2]}>
            {/* Slender golden stalk */}
            <mesh position={[0, 0.28, 0]} castShadow>
              <cylinderGeometry args={[0.014, 0.022, 0.58, 6]} />
              <meshStandardMaterial color="#d97706" roughness={0.4} />
            </mesh>
            {/* Heavy nodding grain head */}
            <mesh position={[0.02, 0.58, 0]} rotation={[0, 0, -0.2]} castShadow>
              <cylinderGeometry args={[0.04, 0.028, 0.26, 7]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.15} />
            </mesh>
            {/* Fine wheat beard/awns */}
            <mesh position={[0.04, 0.72, 0]} rotation={[0, 0, -0.25]}>
              <coneGeometry args={[0.02, 0.12, 4]} />
              <meshStandardMaterial color="#fef08a" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ==========================================
// 4. PUMPKIN PROCEDURAL MODEL
// ==========================================
const PumpkinModel: React.FC<{ stage: GrowthStage }> = ({ stage }) => {
  if (stage === 0) {
    return (
      <group position={[0, 0.04, 0]}>
        <mesh rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      </group>
    );
  }
  if (stage === 1) {
    return (
      <group position={[0, 0.06, 0]}>
        {/* Vine base */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.24, 6]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
        {/* Scalloped leaves */}
        <mesh position={[0.08, 0.04, 0]} rotation={[-0.3, 0, 0.2]}>
          <boxGeometry args={[0.15, 0.015, 0.14]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      </group>
    );
  }
  if (stage === 2) {
    return (
      <group position={[0, 0.08, 0]}>
        {/* Small green squash */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#65a30d" roughness={0.4} />
        </mesh>
        {/* Sprawling vine */}
        <mesh position={[0.08, 0.02, 0]} rotation={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
      </group>
    );
  }
  // Mature Heavy Pumpkin
  return (
    <group position={[0, 0.14, 0]}>
      {/* Big Ribbed Orange Pumpkin Body */}
      <group>
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rotY, i) => (
          <mesh key={i} rotation={[0, rotY, 0]} castShadow>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshStandardMaterial color="#ea580c" roughness={0.35} />
          </mesh>
        ))}
      </group>
      {/* Pumpkin indentation cap */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.04, 8]} />
        <meshStandardMaterial color="#c2410c" roughness={0.5} />
      </mesh>
      {/* Curled woody green stem */}
      <group position={[0, 0.22, 0]} rotation={[0.2, 0, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.035, 0.1, 6]} />
          <meshStandardMaterial color="#3f6212" roughness={0.7} />
        </mesh>
      </group>
      {/* Ground vine tendril */}
      <mesh position={[0.14, -0.1, 0.05]} rotation={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.35, 6]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
    </group>
  );
};

// ==========================================
// MATURE AURA / READY TO HARVEST INDICATOR
// ==========================================
const MatureAura: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = t * 1.5;
      meshRef.current.position.y = 1.05 + Math.sin(t * 3) * 0.06;
    }
  });

  return (
    <group>
      {/* Floating Sparkle / Star Icon above mature crop */}
      <mesh ref={meshRef} position={[0, 1.05, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#eab308"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};
