'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = time * 0.1;
      outerRingRef.current.rotation.z = time * 0.15;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(time * 2) * 1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <pointLight ref={lightRef} position={[0, 0, 0]} color="#f59e0b" intensity={3} />
      
      {/* Main golden sphere */}
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.5}>
        <MeshDistortMaterial
          color="#f59e0b"
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          emissive="#f59e0b"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Outer ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[3.5, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Sparkles effect */}
      <Sparkles
        count={100}
        scale={8}
        size={3}
        speed={0.5}
        color="#fbbf24"
      />
    </Float>
  );
}

function ParticleRing() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 4 + Math.random() * 3;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#fbbf24"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function OrbitingIcons() {
  const groupRef = useRef<THREE.Group>(null);
  const iconsRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.3;
    }

    iconsRef.current.forEach((icon, index) => {
      if (icon) {
        icon.rotation.x = time * (1 + index * 0.1);
        icon.rotation.y = time * (1.5 + index * 0.1);
        icon.position.y += Math.sin(time * 2 + index) * 0.002;
      }
    });
  });

  const icons = [
    { position: [5, 0, 0], color: '#f59e0b', scale: 0.4 },
    { position: [-5, 0, 0], color: '#fbbf24', scale: 0.5 },
    { position: [0, 5, 0], color: '#d97706', scale: 0.45 },
    { position: [0, -5, 0], color: '#f59e0b', scale: 0.4 },
    { position: [3.5, 3.5, 0], color: '#fbbf24', scale: 0.35 },
    { position: [-3.5, -3.5, 0], color: '#d97706', scale: 0.35 },
    { position: [3.5, -3.5, 0], color: '#f59e0b', scale: 0.3 },
    { position: [-3.5, 3.5, 0], color: '#fbbf24', scale: 0.3 },
  ];

  return (
    <group ref={groupRef}>
      {icons.map((icon, index) => (
        <Float key={index} speed={2 + index * 0.5} rotationIntensity={2}>
          <mesh 
            ref={(el) => { if (el) iconsRef.current[index] = el; }}
            position={icon.position as [number, number, number]}
            scale={icon.scale}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={icon.color}
              emissive={icon.color}
              emissiveIntensity={1}
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 25]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#f59e0b" />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#d97706" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          color="#f59e0b"
        />
        
        <AnimatedSphere />
        <ParticleRing />
        <OrbitingIcons />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
