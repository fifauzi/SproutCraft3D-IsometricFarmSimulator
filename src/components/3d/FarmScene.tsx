import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { PlotMesh } from './PlotMesh';
import { FarmEnvironment } from './FarmEnvironment';
import { RainParticles } from './RainParticles';
import { Padlock3D } from './Padlock3D';

const SPACING = 1.7;

export const FarmScene: React.FC = () => {
  const timeInMinutes = useGameStore((state) => state.timeInMinutes);
  const weather = useGameStore((state) => state.weather);

  const envState = useMemo(() => {
    const hours = timeInMinutes / 60;
    const isNight = hours >= 19.5 || hours < 5.5;
    const isSunset = hours >= 16.5 && hours < 19.5;
    const isMorning = hours >= 5.5 && hours < 9.5;

    const sunAngle = ((timeInMinutes - 360) / 720) * Math.PI;
    const sunX = Math.cos(sunAngle) * 14;
    const sunY = Math.max(1.5, Math.sin(sunAngle) * 16);
    const sunZ = 8;

    if (weather === 'rainy') {
      return {
        bg: '#475569',
        fog: '#475569',
        keyLight: '#94a3b8',
        keyIntensity: 0.9,
        sunPos: [sunX, sunY, sunZ] as [number, number, number],
        hemiSky: '#64748b',
        hemiGround: '#1e293b',
        hemiIntensity: 0.5,
        isNight,
      };
    }

    if (weather === 'heatwave') {
      return {
        bg: '#fed7aa',
        fog: '#fed7aa',
        keyLight: '#fde047',
        keyIntensity: 2.4,
        sunPos: [sunX, sunY, sunZ] as [number, number, number],
        hemiSky: '#fef08a',
        hemiGround: '#78350f',
        hemiIntensity: 1.1,
        isNight: false,
      };
    }

    if (isNight) {
      return {
        bg: '#090d16',
        fog: '#090d16',
        keyLight: '#93c5fd',
        keyIntensity: 0.45,
        sunPos: [-10, 14, -8] as [number, number, number],
        hemiSky: '#0f172a',
        hemiGround: '#022c22',
        hemiIntensity: 0.25,
        isNight: true,
      };
    }

    if (isSunset) {
      return {
        bg: '#fdba74',
        fog: '#fdba74',
        keyLight: '#ea580c',
        keyIntensity: 1.9,
        sunPos: [sunX, sunY, sunZ] as [number, number, number],
        hemiSky: '#fed7aa',
        hemiGround: '#451a03',
        hemiIntensity: 0.8,
        isNight: false,
      };
    }

    if (isMorning) {
      return {
        bg: '#bae6fd',
        fog: '#bae6fd',
        keyLight: '#fef08a',
        keyIntensity: 1.7,
        sunPos: [sunX, sunY, sunZ] as [number, number, number],
        hemiSky: '#e0f2fe',
        hemiGround: '#14532d',
        hemiIntensity: 0.85,
        isNight: false,
      };
    }

    // Midday
    return {
      bg: '#93c5fd',
      fog: '#93c5fd',
      keyLight: '#ffffff',
      keyIntensity: 1.85,
      sunPos: [sunX, sunY, sunZ] as [number, number, number],
      hemiSky: '#e0f2fe',
      hemiGround: '#166534',
      hemiIntensity: 0.9,
      isNight: false,
    };
  }, [timeInMinutes, weather]);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{
          position: [12, 13, 12], // Isometric view positioned for 3-section farm
          fov: 42,
          near: 0.1,
          far: 80,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <color attach="background" args={[envState.bg]} />
        <fog attach="fog" args={[envState.fog, 22, 55]} />

        {/* Stars in Night Sky */}
        {envState.isNight && (
          <Stars
            radius={45}
            depth={25}
            count={1400}
            factor={3}
            saturation={0}
            fade
            speed={0.5}
          />
        )}

        {/* Lighting Rig */}
        <ambientLight intensity={envState.isNight ? 0.2 : 0.4} />
        <hemisphereLight
          args={[envState.hemiSky, envState.hemiGround, envState.hemiIntensity]}
        />
        <directionalLight
          position={envState.sunPos}
          intensity={envState.keyIntensity}
          color={envState.keyLight}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={40}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />

        {/* Lantern Glow at Night */}
        {envState.isNight && (
          <pointLight position={[0, 3, 0]} intensity={1.8} color="#fbbf24" distance={18} />
        )}

        {/* Rain Particles Effect */}
        <RainParticles />

        {/* Constrained Isometric Orbit Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.3}
          minDistance={10}
          maxDistance={32}
          target={[0, 0, 0]}
        />

        {/* 3-Section Farm World */}
        <FarmWorld />

        {/* Contact Shadow beneath entire island */}
        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.55}
          scale={24}
          blur={1.8}
          far={8}
          color="#0f172a"
        />
      </Canvas>
    </div>
  );
};

// ==========================================
// SCENE WORLD & TICK DRIVER
// ==========================================
const FarmWorld: React.FC = () => {
  const plots = useGameStore((state) => state.plots);
  const isLeftUnlocked = useGameStore((state) => state.isLeftUnlocked);
  const isRightUnlocked = useGameStore((state) => state.isRightUnlocked);
  const tick = useGameStore((state) => state.tick);

  useFrame((_, delta) => {
    tick(delta);
  });

  // Section offsets along X axis
  const sectionXOffsets: Record<string, number> = {
    left: -5.8,
    center: 0,
    right: 5.8,
  };

  // 3x3 local offset: (col - 1) * SPACING
  const getPlotPos = (section: string, row: number, col: number): [number, number, number] => {
    const secX = sectionXOffsets[section] || 0;
    const localX = (col - 1) * SPACING;
    const localZ = (row - 1) * SPACING;
    return [secX + localX, 0, localZ];
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Decorative Island & Shack */}
      <FarmEnvironment />

      {/* 27 Soil Plots across 3 sections */}
      <group position={[0, 0, 0]}>
        {plots.map((plot) => {
          const [posX, posY, posZ] = getPlotPos(plot.section, plot.row, plot.col);
          return <PlotMesh key={plot.id} plot={plot} position={[posX, posY, posZ]} />;
        })}
      </group>

      {/* 3D Padlocks over Left & Right sections if locked */}
      {!isLeftUnlocked && <Padlock3D section="left" position={[-5.8, 0, 0]} />}
      {!isRightUnlocked && <Padlock3D section="right" position={[5.8, 0, 0]} />}
    </group>
  );
};
