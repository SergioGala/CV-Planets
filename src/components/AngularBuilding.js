import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const AngularBuilding = ({ position }) => {
  const mainRef = useRef();
  const modulesRef = useRef();
  const logoRef = useRef();

  // Create Angular shield shape
  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(40, 0);
    shape.lineTo(40, 60);
    shape.lineTo(20, 80);
    shape.lineTo(0, 60);
    shape.lineTo(0, 0);
    return shape;
  }, []);

  // Create a dynamic material for the main building
  const shieldMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color("#DD0031") },
        colorB: { value: new THREE.Color("#C3002F") }
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
          vec3 color = mix(colorA, colorB, vUv.y + sin(vUv.x * 10.0 + time) * 0.1);
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, []);

  // Create floating modules closer to the building
  const modules = useMemo(() => {
    return Array(50).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 30,
        Math.random() * 80,
        (Math.random() - 0.5) * 30
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: 0.2 + Math.random() * 0.8,
      speed: 0.2 + Math.random() * 0.5
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mainRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    shieldMaterial.uniforms.time.value = t;
    
    modulesRef.current.children.forEach((child, i) => {
      const module = modules[i];
      child.position.y = module.position[1] + Math.sin(t * module.speed + i) * 2;
      child.rotation.x = module.rotation[0] + t * 0.2;
      child.rotation.y = module.rotation[1] + t * 0.2;
    });

    logoRef.current.rotation.y = t * 0.5;
  });

  return (
    <group position={position} ref={mainRef}>
      {/* Main building shield */}
      <mesh>
        <extrudeGeometry args={[shieldShape, { depth: 25, bevelEnabled: true, bevelThickness: 2, bevelSize: 1, bevelSegments: 5 }]} />
        <primitive object={shieldMaterial} attach="material" />
      </mesh>

      {/* Angular logo (3D version) */}
      <group position={[20, 40, 13]} ref={logoRef}>
        <mesh>
          <cylinderGeometry args={[15, 15, 4, 6]} />
          <meshStandardMaterial color="#DD0031" />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[13, 13, 4, 6]} />
          <meshStandardMaterial color="#C3002F" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 6]} position={[-4, 0, 2]}>
          <boxGeometry args={[4, 20, 2]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 6]} position={[4, 0, 2]}>
          <boxGeometry args={[4, 20, 2]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Floating modules */}
      <group ref={modulesRef}>
        {modules.map((module, index) => (
          <Sphere key={index} args={[1, 16, 16]} position={module.position} scale={module.scale}>
            <meshStandardMaterial color="#FFFFFF" metalness={0.7} roughness={0.3} emissive="#FFFFFF" emissiveIntensity={0.2} />
          </Sphere>
        ))}
      </group>

      {/* Connecting lines */}
      {modules.map((module, index) => (
        <line key={`line-${index}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={2}
              array={new Float32Array([...module.position, 20, 40, 13])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#FFFFFF" linewidth={1} transparent opacity={0.4} />
        </line>
      ))}

      {/* Building text */}
      <Text
        position={[20, 110, 0]}
        fontSize={15}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        Angular
      </Text>

      {/* Dynamic lighting */}
      <pointLight position={[20, 50, 30]} intensity={1} color="#DD0031" />
      <pointLight position={[-20, 80, -20]} intensity={0.8} color="#FFFFFF" />
      <spotLight position={[0, 120, 40]} angle={0.3} penumbra={0.2} intensity={0.8} color="#FFFFFF" />

      {/* Glowing ground effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, -0.1, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#DD0031" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export default AngularBuilding;