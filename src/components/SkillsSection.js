import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import CityBase from './CityBase';
import ReactBuilding from './ReactBuilding';
import PythonBuilding from './PythonBuilding';
import TypeScriptBuilding from './TypeScriptBuilding';
import SkyBox from './SkyBox';

const City = () => {
    const groupRef = useRef();
  
    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.05;
    });
  
    return (
      <group ref={groupRef}>
        <CityBase />
        <ReactBuilding position={[-40, 0, -40]} />
        <TypeScriptBuilding position={[-80, 0, -40]} /> {/* Colocado entre React y Python */}
        <PythonBuilding position={[60, 0, -40]} />
      </group>
    );
  };

const SkillsSection = ({ onReturnToMain }) => {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'black',
      position: 'relative'
    }}>
      <Canvas shadows gl={{ antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[100, 60, 100]} fov={60} />
        <OrbitControls target={[-20, 30, -20]} maxPolarAngle={Math.PI / 2} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[50, 50, 25]} intensity={1} castShadow />
        <pointLight position={[-40, 60, -40]} intensity={1} color="#61DAFB" />
        <Suspense fallback={null}>
          <SkyBox />
          <City />
        </Suspense>
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
      <button
        onClick={onReturnToMain}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#61DAFB',
          color: 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Volver al Universo
      </button>
    </div>
  );
};

export default SkillsSection;