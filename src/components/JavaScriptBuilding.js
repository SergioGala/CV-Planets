import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const JavaScriptBuildingExtreme = ({ position }) => {
  const mainRef = useRef();
  const floorsRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Create a dynamic material for the main building
  const buildingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color("#F0DB4F") },
        colorB: { value: new THREE.Color("#323330") }
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
        uniform vec3 colorA;
        uniform vec3 colorB;
        varying vec2 vUv;
        
        void main() {
          vec3 color = mix(colorA, colorB, sin(vUv.y * 20.0 + time) * 0.5 + 0.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, []);

  // Create dynamic floors
  const floors = useMemo(() => {
    return Array(10).fill().map((_, i) => ({
      position: [0, i * 8, 0],
      rotation: [0, 0, 0],
      scale: 1,
      speed: 0.2 + Math.random() * 0.3
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mainRef.current) {
      mainRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    }
    if (buildingMaterial.uniforms) {
      buildingMaterial.uniforms.time.value = t;
    }
    
    if (floorsRef.current && floorsRef.current.children) {
      floorsRef.current.children.forEach((floor, i) => {
        if (floor && floors[i]) {
          const floorData = floors[i];
          floor.position.y = floorData.position[1] + Math.sin(t * floorData.speed) * 2;
          floor.rotation.y = t * floorData.speed;
          floor.scale.setScalar(0.8 + Math.sin(t * floorData.speed) * 0.2);
        }
      });
    }
  });

  return (
    <group position={position} ref={mainRef}>
      {/* Base of the building */}
      <Box args={[50, 10, 50]} position={[0, 5, 0]}>
        <meshStandardMaterial color="#323330" />
      </Box>

      {/* Main building structure */}
      <mesh position={[0, 60, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[40, 90, 40]} />
        <primitive object={buildingMaterial} attach="material" />
      </mesh>

      {/* Dynamic floors */}
      <group ref={floorsRef} position={[0, 15, 0]}>
        {floors.map((floor, index) => (
          <Box
            key={index}
            args={[50, 4, 50]}
            position={floor.position}
          >
            <meshPhongMaterial
              color={new THREE.Color().setHSL(index * 0.1 % 1, 1, 0.5)}
              transparent
              opacity={0.7}
            />
          </Box>
        ))}
      </group>

      {/* Floating JavaScript symbols */}
      <group position={[0, 110, 0]}>
        {['{}', '[]', '()', '=>', '&&', '||'].map((symbol, index) => (
          <Text
            key={index}
            position={[
              Math.sin(index / 6 * Math.PI * 2) * 30,
              index * 8,
              Math.cos(index / 6 * Math.PI * 2) * 30
            ]}
            fontSize={5}
            color="#F0DB4F"
            anchorX="center"
            anchorY="middle"
          >
            {symbol}
          </Text>
        ))}
      </group>

      {/* Interactive code snippet */}
      {hovered && (
        <Text
          position={[0, 170, 25]}
          fontSize={4}
          color="#F0DB4F"
          anchorX="center"
          anchorY="middle"
        >
          {`function jsRocks() {
  return '🚀'.repeat(Infinity);
}`}
        </Text>
      )}

      {/* Rotating JS logo on top */}
      <group position={[0, 140, 0]}>
        <Cylinder args={[12, 12, 6, 6]} rotation={[0, Math.PI / 6, 0]}>
          <meshStandardMaterial color="#F0DB4F" />
        </Cylinder>
        <Text
          position={[0, 10, 0]}
          fontSize={10}
          color="#323330"
          anchorX="center"
          anchorY="middle"
        >
          JS
        </Text>
      </group>

      {/* Dynamic lighting */}
      <pointLight position={[0, 60, 30]} intensity={1} color="#F0DB4F" />
      <spotLight position={[30, 120, 30]} angle={0.3} penumbra={1} intensity={1} color="#00FFFF" />
      <spotLight position={[-30, 120, -30]} angle={0.3} penumbra={1} intensity={1} color="#FF00FF" />
    </group>
  );
};

export default JavaScriptBuildingExtreme;