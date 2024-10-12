import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const CityBase = () => {
  const gridHelper = useMemo(() => new THREE.GridHelper(1000, 100, 0x0000ff, 0x000000), []);

  const hologramRings = useMemo(() =>
    Array(5).fill().map((_, i) => ({
      position: [0, i * 2, 0],
      scale: 30 - i * 3,
    }))
  , []);

  const ringsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ringsRef.current.children.forEach((ring, i) => {
      ring.position.y = ((t * 0.5 + i * 2) % 10) + 0.1;
    });
  });

  const baseWidth = 1000;
  const baseDepth = 300;

  return (
    <group>
      {/* Main platform */}
      <Plane
        args={[baseWidth, baseDepth]}
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#24243e" metalness={0.8} roughness={0.4} />
      </Plane>

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

      {/* Animated ring around the city */}
      <Cylinder args={[baseWidth / 2 - 10, baseWidth / 2 - 10, 2, 64, 1, true]} position={[0, 1, 0]}>
        <meshBasicMaterial color="#00ffff" transparent opacity={0.2} side={THREE.DoubleSide} />
      </Cylinder>
    </group>
  );
};

export default CityBase;