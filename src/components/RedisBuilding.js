import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const RedisBuilding = ({ position }) => {
  const groupRef = useRef();
  const dataFlowRef = useRef();
  const energyCoreMaterialRef = useRef();

  const redisColor = "#DC382D";
  const accentColor = "#FFFFFF";

  // Create shader material for energy core
  const energyCoreMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(redisColor) }
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
        float energy = sin(vUv.y * 20.0 - time * 2.0) * 0.5 + 0.5;
        vec3 finalColor = mix(color, vec3(1.0), energy * 0.3);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  }), [redisColor]);

  energyCoreMaterialRef.current = energyCoreMaterial;

  // Create transparent material for the exterior
  const transparentMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: redisColor,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  }), [redisColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    dataFlowRef.current.children.forEach((child, index) => {
      child.position.y = ((t * 20 + index * 10) % 200) - 100;
    });

    energyCoreMaterialRef.current.uniforms.time.value = t;
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <Cylinder args={[30, 35, 10, 6]} position={[0, 5, 0]}>
        <meshStandardMaterial color={redisColor} metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Main structure - Hexagonal prism */}
      <Cylinder args={[25, 25, 180, 6]} position={[0, 100, 0]}>
        <primitive object={transparentMaterial} />
      </Cylinder>

      {/* Energy core */}
      <Cylinder args={[10, 10, 160, 32]} position={[0, 100, 0]}>
        <primitive object={energyCoreMaterial} attach="material" />
      </Cylinder>

      {/* Data cubes */}
      <group ref={dataFlowRef}>
        {Array(30).fill().map((_, i) => (
          <Box key={i} args={[4, 4, 4]} position={[
            Math.cos(i / 5 * Math.PI * 2) * 15,
            0,
            Math.sin(i / 5 * Math.PI * 2) * 15
          ]}>
            <meshPhysicalMaterial color={accentColor} metalness={0.5} roughness={0.5} transparent opacity={0.8} />
          </Box>
        ))}
      </group>

      {/* Connection lines */}
      {Array(6).fill().map((_, i) => (
        <Cylinder 
          key={i} 
          args={[0.5, 0.5, 180, 8]} 
          position={[
            Math.cos(i / 6 * Math.PI * 2) * 20,
            100,
            Math.sin(i / 6 * Math.PI * 2) * 20
          ]}
        >
          <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
        </Cylinder>
      ))}

      {/* Top structure */}
      <Cylinder args={[20, 15, 20, 6]} position={[0, 200, 0]}>
        <primitive object={transparentMaterial} />
      </Cylinder>

      {/* Redis logo */}
      <Text
        position={[0, 220, 0]}
        fontSize={15}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
      >
        Redis
      </Text>

      {/* Accent lights */}
      <pointLight position={[0, 100, 0]} intensity={2} distance={100} color={redisColor} />
      {[0, 1, 2].map((index) => (
        <pointLight 
          key={index}
          position={[
            Math.cos(index / 3 * Math.PI * 2) * 30,
            100,
            Math.sin(index / 3 * Math.PI * 2) * 30
          ]} 
          intensity={0.5} 
          distance={50} 
          color={accentColor} 
        />
      ))}
    </group>
  );
};

export default RedisBuilding;