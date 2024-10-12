import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

const StyledTailwindBuildingSpectacular = ({ position }) => {
  const buildingRef = useRef();
  const particlesRef = useRef();
  const ringsRef = useRef();

  // Colors
  const styledComponentsColor = "#DB7093";
  const tailwindColor = "#38B2AC";

  // Create a dynamic material for the main building
  const buildingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color(styledComponentsColor) },
        colorB: { value: new THREE.Color(tailwindColor) }
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
        uniform vec3 colorA;
        uniform vec3 colorB;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec3 color = mix(colorA, colorB, sin(vPosition.y * 0.1 + time) * 0.5 + 0.5);
          float stripe = sin(vPosition.y * 20.0 + time * 5.0) * 0.5 + 0.5;
          color = mix(color, vec3(1.0), stripe * 0.3);
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, []);

  // Create particles for a swirling effect
  const particles = useMemo(() => {
    return Array(1000).fill().map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        Math.random() * 200,
        (Math.random() - 0.5) * 100
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ),
      color: Math.random() > 0.5 ? styledComponentsColor : tailwindColor
    }));
  }, []);

  // Create floating rings
  const rings = useMemo(() => {
    return Array(5).fill().map((_, i) => ({
      position: [0, i * 40, 0],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 15 - i * 2
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    buildingRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    buildingMaterial.uniforms.time.value = t;

    // Animate particles
    particlesRef.current.children.forEach((particle, i) => {
      particle.position.add(particles[i].velocity);
      if (particle.position.y > 200) particle.position.y = 0;
      if (particle.position.y < 0) particle.position.y = 200;
      if (particle.position.x > 50 || particle.position.x < -50) particles[i].velocity.x *= -1;
      if (particle.position.z > 50 || particle.position.z < -50) particles[i].velocity.z *= -1;
    });

    // Animate rings
    ringsRef.current.children.forEach((ring, i) => {
      ring.rotation.x += 0.01;
      ring.rotation.y += 0.01;
      ring.position.y = rings[i].position[1] + Math.sin(t + i) * 5;
    });
  });

  return (
    <group position={[position[0], position[1] + 100, position[2]]} ref={buildingRef}>
      {/* Main building structure */}
      <Box args={[40, 200, 40]} material={buildingMaterial} />

      {/* Particle system */}
      <group ref={particlesRef}>
        {particles.map((particle, index) => (
          <Sphere key={index} args={[0.1, 8, 8]} position={particle.position}>
            <meshBasicMaterial color={particle.color} />
          </Sphere>
        ))}
      </group>

      {/* Floating rings */}
      <group ref={ringsRef}>
        {rings.map((ring, index) => (
          <Torus key={index} args={[ring.scale, 1, 16, 100]} position={ring.position} rotation={ring.rotation}>
            <meshPhongMaterial color={index % 2 === 0 ? styledComponentsColor : tailwindColor} transparent opacity={0.7} />
          </Torus>
        ))}
      </group>

      {/* Styled-components logo */}
      <Text
        position={[0, 120, 25]}
        fontSize={12}
        color={styledComponentsColor}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        💅 Styled
      </Text>

      {/* Tailwind CSS logo */}
      <Text
        position={[0, 100, 25]}
        fontSize={12}
        color={tailwindColor}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        Tailwind
      </Text>

      {/* Dynamic lighting */}
      <pointLight position={[0, 100, 50]} intensity={1} color="#FFFFFF" />
      <spotLight position={[50, 150, 50]} angle={0.3} penumbra={1} intensity={1} color={styledComponentsColor} />
      <spotLight position={[-50, 150, -50]} angle={0.3} penumbra={1} intensity={1} color={tailwindColor} />
    </group>
  );
};

export default StyledTailwindBuildingSpectacular;