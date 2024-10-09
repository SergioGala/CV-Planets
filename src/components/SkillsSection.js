import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ReactBuilding from './ReactBuilding';


const City = () => {
    const groupRef = useRef();
  
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.001;
      }
    });
  
    return (
      <group ref={groupRef}>
        <ReactBuilding position={[0, 0, 0]} />
        {/* Otros edificios se añadirán aquí */}
      </group>
    );
  };

const SkillSection = ({ onReturnToMain }) => {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'radial-gradient(circle, #4ECDC422 0%, #4ECDC466 100%)',
      position: 'relative'
    }}>
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <City />
      </Canvas>
      <motion.button
        onClick={onReturnToMain}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1em',
          fontWeight: 'bold',
          zIndex: 1000,
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56, 189, 248, 0.7)' }}
      >
        Volver al Universo
      </motion.button>
    </div>
  );
};

export default SkillSection;