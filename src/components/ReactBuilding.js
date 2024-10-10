import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const ReactLogo = () => {
  const logoRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    logoRef.current.rotation.z = Math.sin(t * 0.5) * 0.3;
    logoRef.current.position.y = Math.sin(t) * 0.3 + 0.3;
  });

  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: '#61dafb',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });

  return (
    <group ref={logoRef}>
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial color="#61dafb" />
      </Sphere>
      {[0, 1, 2].map((index) => (
        <group key={index} rotation={[0, 0, (Math.PI / 3) * index]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8, 0.05, 16, 100]} />
            <primitive object={orbitMaterial} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const ReactBuilding = ({ position }) => {
  const buildingRef = useRef();
  const glowRef = useRef();

  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x61DAFB) }
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
          float strength = distance(vUv, vec2(0.5));
          strength = sin(strength * 10.0 - time) * 0.1 + 0.1;
          gl_FragColor = vec4(color, strength);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    buildingRef.current.position.y = Math.sin(t * 0.5) * 0.5 + position[1] + 30;
    glowMaterial.uniforms.time.value = t;
  });

  const buildingHeight = 60;
  const logoScale = 5;
  const logoYOffset = buildingHeight / 2 + 10;

  return (
    <group ref={buildingRef} position={[position[0], position[1] + 30, position[2]]}>
      <Box args={[20, buildingHeight, 20]} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#88CCFF" 
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
          envMapIntensity={1}
        />
      </Box>

      <group position={[0, logoYOffset, 0]} scale={[logoScale, logoScale, logoScale]}>
        <ReactLogo />
      </group>

      <Text
        position={[0, buildingHeight / 2, 10.1]} // Ajustado para que esté en el nivel del techo
        fontSize={3.5}
        color="#61DAFB"
        anchorX="center"
        anchorY="middle"
      >
        React.js
      </Text>

      <Sphere args={[12, 32, 32]} ref={glowRef}>
        <primitive object={glowMaterial} attach="material" />
      </Sphere>
    </group>
  );
};

export default ReactBuilding;