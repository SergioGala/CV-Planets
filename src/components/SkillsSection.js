import React, { Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import SkyBox from "./SkyBox";
import CityBase from './CityBase';
import ReactBuilding from './ReactBuilding';
import PythonBuilding from './PythonBuilding';
import TypeScriptBuilding from './TypeScriptBuilding';
import AngularBuilding from './AngularBuilding';
import JavaScriptBuilding from './JavaScriptBuilding';
import NextJSBuilding from './NextJSBuilding';
import StyledTailwindBuilding from './StyledTailwindBuilding';

const City = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.05;
  });

  const buildingSpacing = 140; // Adjust this value to change the space between buildings

  return (
    <group ref={groupRef}>
      <CityBase />

      {/* All buildings in a single row */}
      <ReactBuilding position={[-3 * buildingSpacing, 0, 0]} />
      <AngularBuilding position={[-2 * buildingSpacing, 0, 0]} />
      <JavaScriptBuilding position={[-1 * buildingSpacing, 0, 0]} />
      <TypeScriptBuilding position={[0, 0, 0]} />
      <PythonBuilding position={[1 * buildingSpacing, 0, 0]} />
      <NextJSBuilding position={[2 * buildingSpacing, 0, 0]} />
      <StyledTailwindBuilding position={[3 * buildingSpacing, 0, 0]} />
    </group>
  );
};

const SkillsSection = ({ onReturnToMain }) => {
    const handleReturnToMain = useCallback(() => {
      onReturnToMain();
    }, [onReturnToMain]);
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'black',
      position: 'relative'
    }}>
      <Canvas shadows gl={{ antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 200, 600]} fov={60} />
        <OrbitControls target={[0, 50, 0]} maxPolarAngle={Math.PI / 2} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[100, 100, 50]} intensity={1} castShadow />
        <pointLight position={[-80, 120, -80]} intensity={1} color="#61DAFB" />
        <Suspense fallback={null}>
          <City />
        </Suspense>
        <SkyBox />
      </Canvas>
      <button
       onClick={handleReturnToMain}
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