import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Text, Torus } from '@react-three/drei';
import * as THREE from 'three';

const DockerBuilding = ({ position }) => {
  const groupRef = useRef();
  const containersRef = useRef();
  const orbitsRef = useRef();

  const dockerBlue = "#0db7ed";
  const dockerDarkBlue = "#384d54";

  const containerMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: dockerBlue,
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8,
    transmission: 0.5
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    containersRef.current.children.forEach((child, index) => {
      child.position.y = Math.sin(t + index) * 5 + 100;
      child.rotation.y = t * 0.5;
    });

    orbitsRef.current.rotation.y = t * 0.1;
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <Cylinder args={[40, 45, 10, 32]} position={[0, 5, 0]}>
        <meshStandardMaterial color={dockerDarkBlue} />
      </Cylinder>

      {/* Central pillar */}
      <Cylinder args={[5, 5, 200, 32]} position={[0, 105, 0]}>
        <meshStandardMaterial color={dockerDarkBlue} />
      </Cylinder>

      {/* Containers */}
      <group ref={containersRef}>
        {Array(8).fill().map((_, i) => (
          <Box key={i} args={[20, 10, 15]} position={[
            Math.cos(i / 4 * Math.PI) * 30,
            80 + i * 15,
            Math.sin(i / 4 * Math.PI) * 30
          ]}>
            <primitive object={containerMaterial} />
          </Box>
        ))}
      </group>

      {/* Orbits */}
      <group ref={orbitsRef}>
        {[20, 35, 50].map((radius, index) => (
          <Torus key={index} args={[radius, 0.5, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color={dockerBlue} />
          </Torus>
        ))}
      </group>

      {/* Top structure */}
      <Cylinder args={[20, 15, 20, 32]} position={[0, 210, 0]}>
        <meshStandardMaterial color={dockerDarkBlue} />
      </Cylinder>

      {/* Docker logo */}
      <Text
        position={[0, 230, 0]}
        fontSize={15}
        color={dockerBlue}
        anchorX="center"
        anchorY="middle"
      >
        Docker
      </Text>

      {/* Accent lights */}
      <pointLight position={[0, 100, 0]} intensity={1} distance={100} color={dockerBlue} />
      {[0, 1, 2, 3].map((index) => (
        <pointLight 
          key={index}
          position={[
            Math.cos(index / 4 * Math.PI * 2) * 40,
            100,
            Math.sin(index / 4 * Math.PI * 2) * 40
          ]} 
          intensity={0.5} 
          distance={50} 
          color={dockerBlue} 
        />
      ))}
    </group>
  );
};

export default DockerBuilding;