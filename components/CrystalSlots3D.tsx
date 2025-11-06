'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshTransmissionMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CrystalSlots3DProps {
  reels: string[];
  isSpinning: boolean;
}

const SYMBOL_COLORS: { [key: string]: string } = {
  '💎': '#3b82f6',
  '💰': '#fbbf24',
  '⭐': '#f59e0b',
  '🔮': '#a855f7',
  '👑': '#d97706',
  '🎰': '#10b981',
  '💫': '#ec4899',
};

function Crystal({ symbol, position, isSpinning }: { symbol: string; position: [number, number, number]; isSpinning: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      if (isSpinning) {
        meshRef.current.rotation.y = time * 5;
        meshRef.current.rotation.x = time * 3;
      } else {
        meshRef.current.rotation.y = Math.sin(time) * 0.3;
        meshRef.current.rotation.x = Math.cos(time * 0.5) * 0.2;
      }
    }
  });

  const color = SYMBOL_COLORS[symbol] || '#f59e0b';

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            color={color}
            thickness={0.5}
            roughness={0.1}
            transmission={0.9}
            ior={1.5}
            chromaticAberration={0.1}
            backside
          />
        </mesh>
        
        <pointLight position={[0, 0, 0]} intensity={2} color={color} />
        
        <Text
          position={[0, 0, 1.2]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
      </group>
    </Float>
  );
}

function SlotMachine({ reels, isSpinning }: CrystalSlots3DProps) {
  const positions: [number, number, number][] = [
    [-2.5, 0, 0],
    [0, 0, 0],
    [2.5, 0, 0],
  ];

  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[8, 4, 0.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Top bar */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[8.5, 0.5, 1]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={1}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Bottom bar */}
      <mesh position={[0, -2.5, 0]}>
        <boxGeometry args={[8.5, 0.5, 1]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={1}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Crystals */}
      {reels.map((symbol, index) => (
        <Crystal
          key={index}
          symbol={symbol}
          position={positions[index]}
          isSpinning={isSpinning}
        />
      ))}

      {/* Dividers */}
      <mesh position={[-1.25, 0, 0.5]}>
        <boxGeometry args={[0.1, 3.5, 0.5]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={1}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1.25, 0, 0.5]}>
        <boxGeometry args={[0.1, 3.5, 0.5]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={1}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function CrystalSlots3D({ reels, isSpinning }: CrystalSlots3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 5]} intensity={2} color="#f59e0b" />
        <pointLight position={[-5, 0, 3]} intensity={1.5} color="#a855f7" />
        <pointLight position={[5, 0, 3]} intensity={1.5} color="#3b82f6" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.6}
          penumbra={1}
          intensity={2}
          color="#fbbf24"
        />

        <SlotMachine reels={reels} isSpinning={isSpinning} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
