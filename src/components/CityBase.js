import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const CityBase = () => {
  const gridHelper = useMemo(() => new THREE.GridHelper(400, 80, 0x0000ff, 0x000000), []);

  const hologramRings = useMemo(() => 
    Array(5).fill().map((_, i) => ({
      position: [0, i * 2, 0],
      scale: 20 - i * 2,
    }))
  , []);

  const ringsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ringsRef.current.children.forEach((ring, i) => {
      ring.position.y = ((t * 0.5 + i * 2) % 10) + 0.1;
    });
  });

  const sectionSize = 100;
  const sections = [
    { position: [-sectionSize, 0, -sectionSize], color: "#1a1a2e" },
    { position: [0, 0, -sectionSize], color: "#1f1f3d" },
    { position: [sectionSize, 0, -sectionSize], color: "#1a1a2e" },
    { position: [-sectionSize, 0, 0], color: "#1f1f3d" },
    { position: [0, 0, 0], color: "#24243e" },
    { position: [sectionSize, 0, 0], color: "#1f1f3d" },
    { position: [-sectionSize, 0, sectionSize], color: "#1a1a2e" },
    { position: [0, 0, sectionSize], color: "#1f1f3d" },
    { position: [sectionSize, 0, sectionSize], color: "#1a1a2e" },
  ];

  return (
    <group>
      {sections.map((section, index) => (
        <Plane 
          key={index}
          args={[sectionSize, sectionSize]} 
          rotation-x={-Math.PI / 2} 
          position={section.position}
          receiveShadow
        >
          <meshStandardMaterial color={section.color} metalness={0.8} roughness={0.4} />
        </Plane>
      ))}

      <primitive object={gridHelper} position={[0, 0.01, 0]} />

      <group ref={ringsRef}>
        {hologramRings.map((ring, index) => (
          <Cylinder
            key={index}
            args={[ring.scale, ring.scale, 0.05, 32]}
            position={ring.position}
          >
            <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
          </Cylinder>
        ))}
      </group>

      <Sphere args={[3, 32, 32]} position={[0, 3, 0]}>
        <meshBasicMaterial color="#00ffff" wireframe />
      </Sphere>
    </group>
  );
};

export default CityBase;