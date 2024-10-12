import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder } from '@react-three/drei';
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
  const particlesRef = useRef();
  const [particlesArray, setParticlesArray] = useState(null);

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

  useEffect(() => {
    setParticlesArray(new Float32Array(300).map(() => Math.random() * 2 - 1));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (buildingRef.current) {
      buildingRef.current.position.y = Math.sin(t * 0.5) * 0.5 + position[1] + 60;
    }
    if (glowMaterial.uniforms) {
      glowMaterial.uniforms.time.value = t;
    }

    if (particlesRef.current && particlesRef.current.geometry.attributes.position && particlesArray) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = particlesArray[i + 1] + t * 0.1 % 2 - 1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const buildingHeight = 150;
  const buildingWidth = 30;
  const buildingDepth = 30;
  const logoScale = 6;
  const logoYOffset = buildingHeight / 2 + 18;

  return (
    <group ref={buildingRef} position={[position[0], position[1] + 60, position[2]]}>
      <Box args={[buildingWidth, buildingHeight, buildingDepth]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#88CCFF"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
          envMapIntensity={1}
        />
      </Box>

      {/* Add window-like details */}
      {Array(6).fill().map((_, i) => (
        <Box 
          key={i} 
          args={[buildingWidth - 2, 3, 0.1]} 
          position={[0, -buildingHeight/2 + 15 + i * 22, buildingDepth/2 + 0.1]}
        >
          <meshPhysicalMaterial color="#61DAFB" metalness={1} roughness={0} />
        </Box>
      ))}

      <group position={[0, logoYOffset, 0]} scale={[logoScale, logoScale, logoScale]}>
        <ReactLogo />
      </group>

      <Text
        position={[0, buildingHeight / 2 + 7, buildingDepth / 2 + 0.1]}
        fontSize={10}
        color="#61DAFB"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        React.js
      </Text>

      <Sphere args={[25, 32, 32]} ref={glowRef}>
        <primitive object={glowMaterial} attach="material" />
      </Sphere>

      {/* Add some architectural details */}
      {[-1, 0, 1].map((x) => (
        <Cylinder
          key={x}
          args={[1, 1, buildingHeight - 10, 8]}
          position={[x * (buildingWidth / 2 - 1), 0, buildingDepth / 2 + 1]}
        >
          <meshPhysicalMaterial color="#61DAFB" metalness={0.9} roughness={0.1} />
        </Cylinder>
      ))}

      {/* Add a base */}
      <Box args={[buildingWidth + 10, 5, buildingDepth + 10]} position={[0, -buildingHeight / 2 - 2.5, 0]}>
        <meshPhysicalMaterial color="#61DAFB" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Add floating particles */}
      {particlesArray && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute 
              attachObject={['attributes', 'position']}
              count={particlesArray.length / 3}
              array={particlesArray}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#61DAFB" size={0.1} sizeAttenuation transparent opacity={0.8} />
        </points>
      )}
    </group>
  );
};

export default ReactBuilding;