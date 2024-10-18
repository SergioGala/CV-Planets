import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Text, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

const PostgreSQLBuilding = ({ position }) => {
  const groupRef = useRef();
  const dataFlowRef = useRef();
  const rotatingRingsRef = useRef();

  const postgresColor = "#336791";
  const accentColor = "#89BADE";

  const columnSegments = 8;
  const columnHeight = 180;
  const baseRadius = 40;

  // Create shader material for data flow effect
  const dataFlowMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(accentColor) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        float flow = mod(vUv.y - time * 0.5, 1.0);
        float alpha = smoothstep(0.0, 0.1, flow) * smoothstep(0.3, 0.2, flow);
        gl_FragColor = vec4(color, alpha * 0.7);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  }), [accentColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    rotatingRingsRef.current.rotation.y = t * 0.2;
    dataFlowMaterial.uniforms.time.value = t;
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <Cylinder args={[baseRadius, baseRadius + 5, 20, 32]} position={[0, 10, 0]}>
        <meshStandardMaterial color={postgresColor} metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Main structure - Database "columns" */}
      {Array(columnSegments).fill().map((_, i) => {
        const angle = (i / columnSegments) * Math.PI * 2;
        const x = Math.cos(angle) * baseRadius;
        const z = Math.sin(angle) * baseRadius;
        return (
          <Cylinder key={i} args={[5, 5, columnHeight, 16]} position={[x, columnHeight / 2 + 20, z]}>
            <meshStandardMaterial color={postgresColor} metalness={0.6} roughness={0.2} />
          </Cylinder>
        );
      })}

      {/* Top cap */}
      <Cylinder args={[baseRadius, baseRadius, 20, 32]} position={[0, columnHeight + 20, 0]}>
        <meshStandardMaterial color={postgresColor} metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Central core - representing the database engine */}
      <Cylinder args={[15, 15, columnHeight, 32]} position={[0, columnHeight / 2 + 20, 0]}>
        <meshPhysicalMaterial color={accentColor} metalness={0.9} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </Cylinder>

      {/* Rotating rings - representing query execution */}
      <group ref={rotatingRingsRef} position={[0, columnHeight / 2 + 20, 0]}>
        {[1, 0.66, 0.33].map((scale, index) => (
          <Torus key={index} args={[baseRadius * scale, 2, 16, 100]} rotation={[Math.PI / 2, 0, index * Math.PI / 3]}>
            <meshPhysicalMaterial color={accentColor} metalness={0.8} roughness={0.2} transparent opacity={0.7} />
          </Torus>
        ))}
      </group>

      {/* Data flow effect */}
      <Cylinder args={[baseRadius - 1, baseRadius - 1, columnHeight, 64, 1, true]} position={[0, columnHeight / 2 + 20, 0]}>
        <primitive object={dataFlowMaterial} attach="material" />
      </Cylinder>

      {/* PostgreSQL logo */}
      <Text
        position={[0, columnHeight + 50, 0]}
        fontSize={15}
        color={postgresColor}
        anchorX="center"
        anchorY="middle"
      >
        PostgreSQL
      </Text>

      {/* Floating data spheres */}
      {Array(20).fill().map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = baseRadius * 1.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.sin(i * 1000) * 0.5 + 0.5) * columnHeight + 20;
        return (
          <Sphere key={i} args={[2, 16, 16]} position={[x, y, z]}>
            <meshBasicMaterial color={accentColor} />
          </Sphere>
        );
      })}

      {/* Accent lights */}
      <pointLight position={[0, columnHeight / 2 + 20, 0]} intensity={1} distance={100} color={accentColor} />
      {[0, Math.PI / 2, Math.PI, Math.PI * 3 / 2].map((angle, index) => (
        <pointLight 
          key={index}
          position={[Math.cos(angle) * baseRadius, columnHeight / 2 + 20, Math.sin(angle) * baseRadius]} 
          intensity={0.5} 
          distance={50} 
          color={accentColor} 
        />
      ))}
    </group>
  );
};

export default PostgreSQLBuilding;