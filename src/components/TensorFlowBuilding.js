import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

const TensorFlowBuilding = ({ position }) => {
  const groupRef = useRef();
  const neuralNetworkRef = useRef();
  const dataFlowRef = useRef();
  const energyFieldRef = useRef();

  const tensorFlowColor = "#FF6F00";
  const neuronColor = "#FFA726";
  const synapseColor = "#4FC3F7";

  const neuronMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: neuronColor,
    metalness: 0.8,
    roughness: 0.2,
    emissive: neuronColor,
    emissiveIntensity: 0.5,
  }), []);

  const synapseMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: synapseColor,
    transparent: true,
    opacity: 0.6,
  }), []);

  const energyFieldMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(tensorFlowColor) }
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
        float energy = sin(vUv.y * 20.0 - time * 2.0) * 0.5 + 0.5;
        vec3 finalColor = mix(color, vec3(1.0), energy * 0.3);
        gl_FragColor = vec4(finalColor, energy * 0.5);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  }), [tensorFlowColor]);

  // Create neural network structure
  const networkStructure = useMemo(() => {
    const layers = 7;
    const neuronsPerLayer = [4, 6, 8, 10, 8, 6, 4];
    const structure = [];

    for (let i = 0; i < layers; i++) {
      const layer = [];
      for (let j = 0; j < neuronsPerLayer[i]; j++) {
        layer.push(new THREE.Vector3(
          (i - (layers-1)/2) * 20,
          j * 15 - (neuronsPerLayer[i]-1) * 7.5,
          0
        ));
      }
      structure.push(layer);
    }

    return structure;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    neuralNetworkRef.current.children.forEach((neuron, i) => {
      neuron.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.1);
    });

    dataFlowRef.current.children.forEach((data, i) => {
      data.position.x = ((t * 20 + i * 5) % 140) - 70;
    });

    energyFieldMaterial.uniforms.time.value = t;
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <Box args={[120, 10, 120]} position={[0, 5, 0]}>
        <meshStandardMaterial color={tensorFlowColor} />
      </Box>

      {/* Energy field */}
      <group ref={energyFieldRef} position={[0, 110, 0]}>
        <Box args={[100, 200, 100]} position={[0, 0, 0]}>
          <primitive object={energyFieldMaterial} attach="material" />
        </Box>
      </group>

      {/* Neural Network */}
      <group ref={neuralNetworkRef} position={[0, 140, 0]}>
        {networkStructure.flat().map((pos, i) => (
          <Sphere key={i} args={[3, 16, 16]} position={pos}>
            <primitive object={neuronMaterial} />
          </Sphere>
        ))}
      </group>

      {/* Synapses */}
      <group position={[0, 140, 0]}>
        {networkStructure.slice(0, -1).map((layer, i) =>
          layer.map((neuron, j) =>
            networkStructure[i+1].map((nextNeuron, k) => (
              <Line
                key={`${i}-${j}-${k}`}
                points={[neuron, nextNeuron]}
                color={synapseColor}
                lineWidth={1}
                transparent
                opacity={0.6}
              />
            ))
          )
        )}
      </group>

      {/* Data flow */}
      <group ref={dataFlowRef} position={[0, 110, 0]}>
        {Array(60).fill().map((_, i) => (
          <Box key={i} args={[2, 2, 2]} position={[0, (i - 30) * 6, 50]}>
            <meshBasicMaterial color={synapseColor} />
          </Box>
        ))}
      </group>

      {/* TensorFlow.js logo */}
      <Text
        position={[0, 230, 51]}
        fontSize={15}
        color={tensorFlowColor}
        anchorX="center"
        anchorY="middle"
      >
        TensorFlow.js
      </Text>

      {/* Accent lights */}
      <pointLight position={[0, 140, 0]} intensity={1} distance={150} color={tensorFlowColor} />
      {[-1, 1].map((sign, index) => (
        <pointLight 
          key={index}
          position={[sign * 40, 140, sign * 40]} 
          intensity={0.5} 
          distance={100} 
          color={neuronColor} 
        />
      ))}
    </group>
  );
};

export default TensorFlowBuilding;