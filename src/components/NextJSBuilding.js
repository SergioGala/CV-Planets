import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const NextJSBuilding = ({ position }) => {
  const buildingRef = useRef();
  const floatingComponentsRef = useRef();

  // Create a material for the main building
  const buildingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color("#000000") },
        colorB: { value: new THREE.Color("#FFFFFF") }
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

  // Create floating components with adjusted positions
  const floatingComponents = useMemo(() => {
    return ['SSR', 'SSG', 'ISR', 'CSR', 'API'].map((component, index) => ({
      text: component,
      position: [
        Math.sin(index / 5 * Math.PI * 2) * 30,  // Increased radius
        40 + index * 15,  // Adjusted height
        Math.cos(index / 5 * Math.PI * 2) * 30   // Increased radius
      ],
      rotation: [0, index / 5 * Math.PI * 2, 0]
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    buildingRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    buildingMaterial.uniforms.time.value = t;

    floatingComponentsRef.current.children.forEach((child, index) => {
      const angle = (t * 0.5 + index * Math.PI * 0.4) % (Math.PI * 2);
      child.position.x = Math.sin(angle) * 30;
      child.position.z = Math.cos(angle) * 30;
      child.position.y = floatingComponents[index].position[1] + Math.sin(t + index) * 2;
      child.rotation.y = -angle + Math.PI / 2;
    });
  });

  return (
    <group position={[position[0], position[1] + 50, position[2]]} ref={buildingRef}>
      {/* Main building structure */}
      <Box args={[40, 100, 40]} material={buildingMaterial} />

      {/* Roof structure representing versatility */}
      <Cylinder args={[25, 20, 20, 6]} position={[0, 60, 0]}>
        <meshStandardMaterial color="#000000" />
      </Cylinder>

      {/* Floating components */}
      <group ref={floatingComponentsRef}>
        {floatingComponents.map((component, index) => (
          <Text
            key={index}
            position={component.position}
            rotation={component.rotation}
            fontSize={5}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {component.text}
          </Text>
        ))}
      </group>

      {/* Next.js logo */}
      <Text
        position={[0, 75, 20.1]}
        fontSize={10}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        Next.js
      </Text>

      {/* Reactive base representing integration with React */}
      <Box args={[50, 5, 50]} position={[0, -47.5, 0]}>
        <meshStandardMaterial color="#61DAFB" />
      </Box>

      {/* Dynamic lighting */}
      <pointLight position={[0, 50, 30]} intensity={1} color="#FFFFFF" />
      <spotLight position={[30, 100, 30]} angle={0.3} penumbra={1} intensity={1} color="#61DAFB" />
    </group>
  );
};

export default NextJSBuilding;