import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const TypeScriptBuilding = ({ position }) => {
  const groupRef = useRef();
  const glassColor = new THREE.Color('#007ACC');
  const structureColor = new THREE.Color('#007ACC').lerp(new THREE.Color('#ffffff'), 0.5);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.5 + 0.5;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Base del edificio */}
      <Box args={[20, 40, 20]} position={[0, 20, 0]}>
        <meshPhysicalMaterial 
          color={glassColor} 
          transparent 
          opacity={0.3} 
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Box>

      {/* Estructuras internas */}
      {[...Array(5)].map((_, i) => (
        <Box 
          key={i} 
          args={[18, 2, 18]} 
          position={[0, i * 10 + 5, 0]}
        >
          <meshStandardMaterial color={structureColor} />
        </Box>
      ))}

      {/* Tejado */}
      <Box args={[22, 1, 22]} position={[0, 40.5, 0]}>
        <meshStandardMaterial color={structureColor} />
      </Box>

      {/* Símbolo de TypeScript flotante */}
      <group position={[0, 48, 0]}>
        <Box args={[6, 6, 2]} position={[0, 0, 1]}>
          <meshStandardMaterial color="#007ACC" />
        </Box>
        <Box args={[2, 10, 2]} position={[0, -2, 1]}>
          <meshStandardMaterial color="#007ACC" />
        </Box>
      </group>

      {/* Esferas flotantes representando tipos */}
      {[...Array(10)].map((_, i) => (
        <Sphere 
          key={i} 
          args={[0.5, 16, 16]} 
          position={[
            Math.sin(i * 0.5) * 12,
            Math.cos(i * 0.3) * 20 + 20,
            Math.cos(i * 0.5) * 12
          ]}
        >
          <meshStandardMaterial color="#ffffff" emissive="#007ACC" emissiveIntensity={0.5} />
        </Sphere>
      ))}
    </group>
  );
};

export default TypeScriptBuilding;