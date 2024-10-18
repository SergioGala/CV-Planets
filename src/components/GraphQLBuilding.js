import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

const GraphQLBuilding = ({ position }) => {
  const groupRef = useRef();
  const dataFlowRef = useRef();

  const nodes = useMemo(() => {
    return Array(10).fill().map(() => ({
      position: [
        Math.random() * 40 - 20,
        Math.random() * 80,
        Math.random() * 40 - 20
      ],
    }));
  }, []);

  const edges = useMemo(() => {
    return Array(15).fill().map(() => ({
      start: nodes[Math.floor(Math.random() * nodes.length)].position,
      end: nodes[Math.floor(Math.random() * nodes.length)].position,
    }));
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    dataFlowRef.current.children.forEach((flow, i) => {
      flow.position.y = (t * 10 + i * 10) % 100 - 50;
    });
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base del edificio */}
      <Box args={[50, 10, 50]} position={[0, 5, 0]}>
        <meshStandardMaterial color="#E535AB" />
      </Box>

      {/* Estructura principal */}
      <Box args={[40, 100, 40]} position={[0, 55, 0]}>
        <meshPhysicalMaterial color="#E535AB" metalness={0.9} roughness={0.1} opacity={0.7} transparent />
      </Box>

      {/* Nodos */}
      {nodes.map((node, index) => (
        <Sphere key={index} args={[2, 16, 16]} position={node.position}>
          <meshStandardMaterial color="#E535AB" emissive="#E535AB" emissiveIntensity={0.5} />
        </Sphere>
      ))}

      {/* Aristas */}
      {edges.map((edge, index) => (
        <Cylinder key={index} args={[0.5, 0.5, 1]} position={[
          (edge.start[0] + edge.end[0]) / 2,
          (edge.start[1] + edge.end[1]) / 2,
          (edge.start[2] + edge.end[2]) / 2
        ]}>
          <meshStandardMaterial color="#E535AB" emissive="#E535AB" emissiveIntensity={0.5} />
        </Cylinder>
      ))}

      {/* Flujo de datos */}
      <group ref={dataFlowRef}>
        {Array(10).fill().map((_, index) => (
          <Box key={index} args={[1, 1, 1]} position={[Math.random() * 40 - 20, 0, Math.random() * 40 - 20]}>
            <meshBasicMaterial color="#61DAFB" />
          </Box>
        ))}
      </group>

      {/* Logo de GraphQL */}
      <Text
        position={[0, 110, 20]}
        fontSize={10}
        color="#E535AB"
        anchorX="center"
        anchorY="middle"
      >
        GraphQL
      </Text>
    </group>
  );
};

export default GraphQLBuilding;