import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Text, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

const NodeExpressBuilding = ({ position }) => {
  const groupRef = useRef();
  const dataFlowRef = useRef();
  const energyRingRef = useRef();

  const nodeColor = "#68A063";
  const expressColor = "#000000";

  const layers = useMemo(() => {
    return Array(8).fill().map((_, i) => ({
      y: i * 25,
      scale: 1 - i * 0.08,
      rotation: i * Math.PI / 16
    }));
  }, []);

  // Shader material for energy effect
  const energyMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(nodeColor) }
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
        float energy = sin(vUv.y * 20.0 + time * 2.0) * 0.5 + 0.5;
        gl_FragColor = vec4(color, energy * 0.6);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  }), [nodeColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    dataFlowRef.current.children.forEach((flow, i) => {
      flow.position.y = (t * 10 + i * 2) % 200 - 100;
    });

    energyRingRef.current.rotation.y = t * 0.5;
    energyMaterial.uniforms.time.value = t;
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <Cylinder args={[40, 45, 20, 64]} position={[0, 10, 0]}>
        <meshStandardMaterial color={nodeColor} metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Main structure */}
      {layers.map((layer, index) => (
        <Box 
          key={index}
          args={[70 * layer.scale, 20, 70 * layer.scale]} 
          position={[0, 30 + layer.y, 0]}
          rotation={[0, layer.rotation, 0]}
        >
          <meshPhysicalMaterial 
            color={index % 2 === 0 ? nodeColor : expressColor} 
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Box>
      ))}

      {/* Energy core */}
      <Cylinder args={[5, 5, 200, 32]} position={[0, 110, 0]}>
        <meshBasicMaterial color={nodeColor} transparent opacity={0.6} />
      </Cylinder>

      {/* Energy rings */}
      <group ref={energyRingRef}>
        {[40, 60, 80].map((radius, index) => (
          <Torus key={index} args={[radius, 2, 16, 100]} rotation={[Math.PI / 2, 0, 0]} position={[0, 110, 0]}>
            <meshBasicMaterial color={nodeColor} transparent opacity={0.4} />
          </Torus>
        ))}
      </group>

      {/* Energy effect */}
      <Cylinder args={[39, 39, 200, 64, 1, true]} position={[0, 110, 0]}>
        <primitive object={energyMaterial} attach="material" />
      </Cylinder>

      {/* Data flow */}
      <group ref={dataFlowRef}>
        {Array(50).fill().map((_, i) => (
          <Sphere key={i} args={[0.5, 16, 16]} position={[
            Math.sin(i * 0.5) * 30,
            0,
            Math.cos(i * 0.5) * 30
          ]}>
            <meshBasicMaterial color="#FFFFFF" />
          </Sphere>
        ))}
      </group>

      {/* Node.js logo */}
      <Text
        position={[0, 280, 40]}
        fontSize={15}
        color={nodeColor}
        anchorX="center"
        anchorY="middle"
      >
        Node.js
      </Text>

      {/* Express.js logo */}
      <Text
        position={[0, 270, 40]}
        fontSize={12}
        color={expressColor}
        anchorX="center"
        anchorY="middle"
      >
        Express
      </Text>

      {/* Floating platforms */}
      {[1, -1].map((sign, index) => (
        <Box key={index} args={[20, 5, 20]} position={[sign * 50, 110, 0]}>
          <meshPhysicalMaterial color={expressColor} metalness={0.8} roughness={0.2} />
        </Box>
      ))}

      {/* Top antenna */}
      <Cylinder args={[2, 0.5, 40, 16]} position={[0, 240, 0]}>
        <meshStandardMaterial color={nodeColor} metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Sphere args={[2, 16, 16]} position={[0, 260, 0]}>
        <meshBasicMaterial color={nodeColor} />
      </Sphere>

      {/* Accent lights */}
      <pointLight position={[0, 110, 0]} intensity={1} distance={100} color={nodeColor} />
      {[0, Math.PI / 2, Math.PI, Math.PI * 3 / 2].map((angle, index) => (
        <pointLight 
          key={index}
          position={[Math.cos(angle) * 40, 110, Math.sin(angle) * 40]} 
          intensity={0.5} 
          distance={50} 
          color={nodeColor} 
        />
      ))}
    </group>
  );
};

export default NodeExpressBuilding;