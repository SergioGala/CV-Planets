import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text, Torus, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const MongoDBBuilding = ({ position }) => {
  const groupRef = useRef();
  const dataFlowRef = useRef();
  const floatingDocumentsRef = useRef();
  const centralSphereRef = useRef();

  const mongoColor = "#4DB33D";
  const accentColor = "#3FA037";

  // Create shader material for central sphere
  const sphereMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(mongoColor) }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        float noise = sin(vPosition.x * 10.0 + time) * sin(vPosition.y * 10.0 + time) * sin(vPosition.z * 10.0 + time);
        vec3 newColor = color + vec3(noise * 0.2);
        float alpha = smoothstep(0.3, 0.7, sin(vUv.y * 20.0 - time * 5.0) * 0.5 + 0.5);
        gl_FragColor = vec4(newColor, alpha * 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  }), [mongoColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    dataFlowRef.current.rotation.y = t * 0.5;
    sphereMaterial.uniforms.time.value = t;

    floatingDocumentsRef.current.children.forEach((doc, i) => {
      doc.position.y = Math.sin(t * 0.5 + i) * 30 + 110;
      doc.rotation.y = t * 0.2 + i;
      doc.rotation.x = Math.sin(t * 0.3 + i) * 0.2;
    });

    centralSphereRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base structure */}
      <Cylinder args={[40, 60, 20, 32]} position={[0, 10, 0]}>
        <meshStandardMaterial color={mongoColor} metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Central energy sphere */}
      <Sphere args={[40, 64, 64]} position={[0, 110, 0]} ref={centralSphereRef}>
        <primitive object={sphereMaterial} attach="material" />
      </Sphere>

      {/* Energy flow */}
      <group ref={dataFlowRef} position={[0, 110, 0]}>
        {[1.5, 1.2, 0.9].map((scale, index) => (
          <Torus key={index} args={[50 * scale, 3, 16, 100]} rotation={[Math.PI / 2, 0, index * Math.PI / 3]}>
            <meshPhysicalMaterial color={accentColor} metalness={0.8} roughness={0.2} transparent opacity={0.7} />
          </Torus>
        ))}
      </group>

      {/* Floating documents */}
      <group ref={floatingDocumentsRef}>
        {Array(30).fill().map((_, i) => (
          <Box key={i} args={[10, 15, 2]} position={[
            Math.cos(i / 15 * Math.PI) * 70,
            110,
            Math.sin(i / 15 * Math.PI) * 70
          ]}>
            <meshPhysicalMaterial color={accentColor} metalness={0.5} roughness={0.5} transparent opacity={0.8} />
          </Box>
        ))}
      </group>

      {/* Connecting beams */}
      {Array(6).fill().map((_, i) => (
        <Cylinder 
          key={i} 
          args={[2, 2, 180, 8]} 
          position={[
            Math.cos(i / 6 * Math.PI * 2) * 60,
            110,
            Math.sin(i / 6 * Math.PI * 2) * 60
          ]}
        >
          <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
        </Cylinder>
      ))}

      {/* Top structure - Hexagonal prism */}
      <Cylinder args={[40, 40, 30, 6]} position={[0, 230, 0]}>
        <meshPhysicalMaterial 
          color={mongoColor} 
          metalness={0.7}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Cylinder>

      {/* MongoDB logo */}
      <Text
        position={[0, 260, 0]}
        fontSize={15}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
      >
        MongoDB
      </Text>

      {/* Accent lights */}
      <pointLight position={[0, 110, 0]} intensity={2} distance={150} color={accentColor} />
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <pointLight 
          key={index}
          position={[
            Math.cos(index / 6 * Math.PI * 2) * 60,
            110,
            Math.sin(index / 6 * Math.PI * 2) * 60
          ]} 
          intensity={0.5} 
          distance={80} 
          color={accentColor} 
        />
      ))}
    </group>
  );
};

export default MongoDBBuilding;