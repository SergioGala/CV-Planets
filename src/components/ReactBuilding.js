import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';

const ReactBuilding = ({ position = [0, 0, 0] }) => {
  const buildingRef = useRef();
  const atomRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    buildingRef.current.position.y = Math.sin(t) * 0.2;
    atomRef.current.rotation.y += 0.01;
  });

  return (
    <group position={position} ref={buildingRef}>
      {/* Main building structure */}
      <Box args={[4, 20, 4]} position={[0, 10, 0]}>
        <meshStandardMaterial color="#61DAFB" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Glass panels */}
      {[-1.8, 0, 1.8].map((x, i) => (
        <Box key={i} args={[0.3, 19, 2]} position={[x, 10, 2]}>
          <meshPhysicalMaterial transmission={0.5} thickness={0.5} roughness={0} />
        </Box>
      ))}

      {/* Atom symbol on top */}
      <group position={[0, 21, 0]} ref={atomRef}>
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial color="#61DAFB" emissive="#61DAFB" emissiveIntensity={0.5} />
        </Sphere>
        {[0, 1, 2].map((rotation) => (
          <Cylinder
            key={rotation}
            args={[1.8, 1.8, 0.1, 32]}
            rotation={[0, 0, (Math.PI / 3) * 2 * rotation]}
          >
            <meshStandardMaterial color="#61DAFB" transparent opacity={0.7} />
          </Cylinder>
        ))}
      </group>
    </group>
  );
};

export default ReactBuilding;