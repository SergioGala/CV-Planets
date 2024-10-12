import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';

const TypeScriptBuilding = ({ position }) => {
  const groupRef = useRef();
  const torusRef = useRef();
  const floatingCubesRef = useRef([]);

  const baseColor = new THREE.Color('#007ACC');
  const glowColor = new THREE.Color('#3178C6');

  const floatingCubes = useMemo(() => {
    return Array(20).fill().map(() => ({
      position: [
        Math.random() * 30 - 15,
        Math.random() * 60,
        Math.random() * 30 - 15
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: Math.random() * 2 + 1
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
    }
    if (torusRef.current) {
      
      torusRef.current.rotation.y = t * 2;
    }
    
    floatingCubesRef.current.forEach((cube, i) => {
      if (cube) {
        cube.position.y = floatingCubes[i].position[1] + Math.sin(t + i) * 2;
        cube.rotation.x = floatingCubes[i].rotation[0] + t * 0.5;
        cube.rotation.y = floatingCubes[i].rotation[1] + t * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central structure */}
      <Box args={[10, 70, 10]} position={[0, 35, 0]}>
        <meshPhysicalMaterial 
          color={baseColor}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Box>

      {/* Rotating torus - Adjusted rotation */}
      <Torus ref={torusRef} args={[15, 2, 16, 100]} position={[0, 35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhongMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.5} />
      </Torus>

      {/* Floating type cubes */}
      {floatingCubes.map((cube, index) => (
        <Box 
          key={index}
          ref={el => floatingCubesRef.current[index] = el}
          args={[cube.scale, cube.scale, cube.scale]}
          position={cube.position}
          rotation={cube.rotation}
        >
          <meshPhongMaterial color={baseColor} transparent opacity={0.7} />
        </Box>
      ))}

      {/* TypeScript logo (T) */}
      <group position={[0, 75, 0]}>
        <Box args={[10, 2, 2]} position={[0, 4, 0]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Box>
        <Box args={[2, 8, 2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Box>
      </group>

      {/* TypeScript text at the top */}
      <Text
  position={[0, 85, 0]}
  fontSize={5}
  color="#FFFFFF"
  anchorX="center"
  anchorY="middle"
>
  TypeScript
</Text>

      {/* Glowing spheres representing types */}
      {[...Array(5)].map((_, i) => (
        <Sphere 
          key={i}
          args={[1, 32, 32]} 
          position={[
            Math.sin(i * Math.PI * 0.4) * 12,
            i * 15 + 5,
            Math.cos(i * Math.PI * 0.4) * 12
          ]}
        >
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.5} />
        </Sphere>
      ))}

      {/* White bars representing type definitions or interfaces */}
      {[...Array(3)].map((_, i) => (
        <Box 
          key={i}
          args={[20, 0.5, 0.5]} 
          position={[0, 20 + i * 20, 0]} 
          rotation={[0, Math.PI / 4, 0]}
        >
          <meshStandardMaterial color="#FFFFFF" />
        </Box>
      ))}
    </group>
  );
};

export default TypeScriptBuilding;