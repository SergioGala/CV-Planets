import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const PythonBuilding = ({ position }) => {
  const mainRef = useRef();
  const dataStreamRef = useRef();

  // Crear una curva compleja para el cuerpo principal
  const curve = useMemo(() => {
    const curvePoints = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      curvePoints.push(new THREE.Vector3(
        40 * Math.sin(t * Math.PI * 3),
        20 + 30 * t,
        40 * Math.cos(t * Math.PI * 3)
      ));
    }
    return new THREE.CatmullRomCurve3(curvePoints);
  }, []);

  const bodyGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 200, 3, 8, false);
  }, [curve]);

  // Shader para el efecto de flujo de datos
  const dataStreamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ff00) }
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
          float strength = mod(vUv.y - time * 0.1, 0.1) / 0.1;
          strength = step(0.5, strength);
          gl_FragColor = vec4(color, strength * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mainRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    dataStreamRef.current.material.uniforms.time.value = t;
  });

  return (
    <group position={position} ref={mainRef}>
      {/* Base del edificio */}
      <Cylinder args={[30, 35, 10, 32]} position={[0, 5, 0]}>
        <meshStandardMaterial color="#1E2736" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Cuerpo principal (serpiente) */}
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial color="#3776AB" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Efecto de flujo de datos */}
      <mesh geometry={bodyGeometry} ref={dataStreamRef}>
        <primitive object={dataStreamMaterial} attach="material" />
      </mesh>

      {/* Esferas de datos */}
      {[0.3, 0.5, 0.7].map((t, index) => (
        <Sphere key={index} args={[3, 32, 32]} position={curve.getPointAt(t)}>
          <meshStandardMaterial color="#4B8BBE" emissive="#4B8BBE" emissiveIntensity={0.5} />
        </Sphere>
      ))}

      {/* Cabeza de la serpiente / Terminal */}
      <group position={curve.getPointAt(1)}>
        <Box args={[10, 6, 8]}>
          <meshStandardMaterial color="#1E2736" metalness={0.9} roughness={0.1} />
        </Box>
        <Text position={[0, 0, 4.1]} fontSize={1} color="#00FF00">
          &gt;&gt;&gt; Python
        </Text>
      </group>

      {/* Texto del edificio */}
      <Text
        position={[0, 70, 0]}
        fontSize={10}
        color="#FFD43B"
        anchorX="center"
        anchorY="middle"
      >
        Python
      </Text>

      {/* Iluminación */}
      <pointLight position={[0, 50, 0]} intensity={1} color="#FFD43B" />
      <spotLight position={[30, 30, 30]} angle={0.3} penumbra={1} intensity={1} color="#4B8BBE" castShadow />
      <spotLight position={[-30, 30, -30]} angle={0.3} penumbra={1} intensity={1} color="#4B8BBE" castShadow />

      {/* Partículas flotantes (representando la comunidad de Python) */}
      {Array(100).fill().map((_, i) => (
        <Sphere key={i} args={[0.2, 8, 8]} position={[
          Math.random() * 100 - 50,
          Math.random() * 100,
          Math.random() * 100 - 50
        ]}>
          <meshBasicMaterial color="#FFD43B" />
        </Sphere>
      ))}
    </group>
  );
};

export default PythonBuilding;