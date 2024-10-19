import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const JestBuilding = ({ position }) => {
  const groupRef = useRef();
  const testSphereRef = useRef();
  const coverageRingsRef = useRef();

  const jestColor = "#99425B";
  const passColor = "#2ECC40";
  const failColor = "#FF4136";

  const testMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(jestColor) }
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
        float pulse = sin(time * 2.0) * 0.5 + 0.5;
        vec3 finalColor = mix(color, vec3(1.0), pulse * 0.3);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  }), [jestColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    testSphereRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    testMaterial.uniforms.time.value = t;

    coverageRingsRef.current.rotation.y = t * 0.5;
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <Cylinder args={[30, 35, 10, 32]} position={[0, 5, 0]}>
        <meshStandardMaterial color={jestColor} />
      </Cylinder>

      {/* Main structure */}
      <Box args={[50, 180, 50]} position={[0, 100, 0]}>
        <meshPhysicalMaterial 
          color={jestColor} 
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </Box>

      {/* Test sphere */}
      <Sphere args={[20, 32, 32]} position={[0, 100, 0]} ref={testSphereRef}>
        <primitive object={testMaterial} attach="material" />
      </Sphere>

      {/* Coverage rings */}
      <group ref={coverageRingsRef} position={[0, 100, 0]}>
        {[25, 30, 35].map((radius, index) => (
          <Cylinder key={index} args={[radius, radius, 2, 32, 1, true]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color={passColor} side={THREE.DoubleSide} transparent opacity={0.5} />
          </Cylinder>
        ))}
      </group>

      {/* Test results */}
      {[-1, 1].map((sign, index) => (
        <Box key={index} args={[8, 8, 8]} position={[sign * 20, 160, 0]}>
          <meshBasicMaterial color={index === 0 ? passColor : failColor} />
        </Box>
      ))}

      {/* Jest logo */}
      <Text
        position={[0, 200, 25]}
        fontSize={15}
        color={jestColor}
        anchorX="center"
        anchorY="middle"
      >
        Jest
      </Text>

      {/* Accent lights */}
      <pointLight position={[0, 100, 0]} intensity={1} distance={100} color={jestColor} />
      {[-1, 1].map((sign, index) => (
        <pointLight 
          key={index}
          position={[sign * 30, 100, 0]} 
          intensity={0.5} 
          distance={50} 
          color={index === 0 ? passColor : failColor} 
        />
      ))}
    </group>
  );
};

export default JestBuilding;