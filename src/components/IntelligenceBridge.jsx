import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const ParticleBeam = ({ start, end, color, speed = 1 }) => {
  const lineRef = useRef();
  const particleRef = useRef();

  const curve = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
    mid.y += Math.random() * 2 - 1;
    mid.x += Math.random() * 2 - 1;
    return new THREE.QuadraticBezierCurve3(vStart, mid, vEnd);
  }, [start, end]);

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.2 * speed) % 1;
    const pos = curve.getPoint(t);
    if (particleRef.current) {
      particleRef.current.position.copy(pos);
    }
  });

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      <line geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.15} linewidth={1} />
      </line>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

const IntelligenceCore = () => {
  const coreRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.01;
      coreRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05);
    }
  });

  return (
    <group ref={coreRef}>
      <Sphere args={[0.8, 32, 32]}>
        <meshPhongMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6" 
          emissiveIntensity={2} 
          transparent 
          opacity={0.3} 
          wireframe
        />
      </Sphere>
      <Sphere args={[0.4, 32, 32]}>
        <meshPhongMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={5} />
      </Sphere>
      <pointLight color="#8b5cf6" intensity={20} distance={10} />
    </group>
  );
};

const BridgeNodes = () => {
  const leftNodes = [
    [-4, 2, 0], [-4, 0, 0], [-4, -2, 0]
  ];
  const rightNodes = [
    [4, 2, 0], [4, 0, 0], [4, -2, 0]
  ];

  return (
    <group>
      {leftNodes.map((pos, i) => (
        <Float key={`l-${i}`} speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={pos}>
          <Sphere args={[0.15, 16, 16]}>
            <meshBasicMaterial color="#a78bfa" />
          </Sphere>
          <ParticleBeam start={pos} end={[0, 0, 0]} color="#8b5cf6" speed={0.5 + Math.random()} />
        </Float>
      ))}
      {rightNodes.map((pos, i) => (
        <Float key={`r-${i}`} speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={pos}>
          <Sphere args={[0.15, 16, 16]}>
            <meshBasicMaterial color="#22d3ee" />
          </Sphere>
          <ParticleBeam start={[0, 0, 0]} end={pos} color="#06b6d4" speed={0.5 + Math.random()} />
        </Float>
      ))}
    </group>
  );
};

export default function IntelligenceBridge() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.6 }}>
      <Canvas 
        dpr={[1, 1.5]} 
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: false
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <IntelligenceCore />
        <BridgeNodes />
      </Canvas>
    </div>
  );
}
