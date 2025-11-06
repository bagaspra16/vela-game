'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface Roulette3DProps {
  isSpinning: boolean;
  result: number | null;
  rotation: number;
}

function RouletteWheel({ isSpinning, result, rotation }: Roulette3DProps) {
  const wheelRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (wheelRef.current) {
      if (isSpinning) {
        wheelRef.current.rotation.z = rotation * (Math.PI / 180);
      }
    }

    if (ballRef.current && !isSpinning && result !== null) {
      const angle = (result / 37) * Math.PI * 2;
      ballRef.current.position.x = Math.cos(angle) * 2.2;
      ballRef.current.position.z = Math.sin(angle) * 2.2;
      ballRef.current.position.y = 0.5 + Math.sin(time * 3) * 0.1;
    }
  });

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const getNumberColor = (num: number): string => {
    if (num === 0) return '#10b981';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? '#ef4444' : '#1f2937';
  };

  return (
    <group ref={wheelRef}>
      {/* Main wheel disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.3, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <torusGeometry args={[3, 0.2, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={1}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Number segments */}
      {numbers.map((num, index) => {
        const angle = (index / 37) * Math.PI * 2;
        const radius = 2.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={num} position={[x, 0.2, z]} rotation={[0, -angle, 0]}>
            <mesh>
              <boxGeometry args={[0.4, 0.1, 0.6]} />
              <meshStandardMaterial
                color={getNumberColor(num)}
                metalness={0.5}
                roughness={0.3}
                emissive={getNumberColor(num)}
                emissiveIntensity={0.3}
              />
            </mesh>
            <Text
              position={[0, 0.1, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {num}
            </Text>
          </group>
        );
      })}

      {/* Center spinner */}
      <Float speed={2} rotationIntensity={1}>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.3, 0.8, 8]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={1}
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>

      {/* Ball */}
      <mesh ref={ballRef} position={[2.2, 0.5, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function Roulette3D({ isSpinning, result, rotation }: Roulette3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 6, 8], fov: 50 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={2} color="#f59e0b" />
        <pointLight position={[5, 3, 5]} intensity={1} color="#fbbf24" />
        <pointLight position={[-5, 3, -5]} intensity={1} color="#d97706" />
        <spotLight
          position={[0, 8, 0]}
          angle={0.5}
          penumbra={1}
          intensity={3}
          color="#f59e0b"
          castShadow
        />

        <RouletteWheel isSpinning={isSpinning} result={result} rotation={rotation} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}
