import React, { Suspense, useRef, useCallback, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, FlyControls } from '@react-three/drei';
import SkyBox from "./SkyBox";
import CityBase from './CityBase';
import ReactBuilding from './ReactBuilding';
import PythonBuilding from './PythonBuilding';
import TypeScriptBuilding from './TypeScriptBuilding';
import AngularBuilding from './AngularBuilding';
import JavaScriptBuilding from './JavaScriptBuilding';
import NextJSBuilding from './NextJSBuilding';
import StyledTailwindBuilding from './StyledTailwindBuilding';
import GraphQLBuilding from './GraphQLBuilding';
import NodeExpressBuilding from './NodeExpressBuilding';
import PostgreSQLBuilding from './PostgreSQLBuilding';
import MongoDBBuilding from "./MongoDBBuilding"
import RedisBuilding from './RedisBuilding';
import BaseStyleSelector from './BaseStyleSelector';

const City = ({ baseStyle }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.05;
  });

  const buildingSpacing = 140; // Adjust this value to change the space between buildings

  return (
    <group ref={groupRef}>
      <CityBase baseStyle={baseStyle} />

      {/* All buildings in a single row */}
      <ReactBuilding position={[-5 * buildingSpacing, 0, 0]} />
      <AngularBuilding position={[-4 * buildingSpacing, 0, 0]} />
      <JavaScriptBuilding position={[-3 * buildingSpacing, 0, 0]} />
      <TypeScriptBuilding position={[-2, 0, 0]} />
      <PythonBuilding position={[-1 * buildingSpacing, 0, 0]} />
      <NextJSBuilding position={[0 * buildingSpacing, 0, 0]} />
      <StyledTailwindBuilding position={[1 * buildingSpacing, 0, 0]} />
      <GraphQLBuilding position={[2 * buildingSpacing, 0, 0]} />
      <NodeExpressBuilding position={[3 * buildingSpacing, 0, 0]} />
      <PostgreSQLBuilding position={[4 * buildingSpacing, 0, 0]} />
      <MongoDBBuilding position={[5 * buildingSpacing, 0, 0]} />
      <RedisBuilding position={[7.2* buildingSpacing, 0, 0]} />
    </group>
  );
};

const CameraController = () => {
  const controlsRef = useRef();

  useFrame((state, delta) => {
    if (controlsRef.current) {
      controlsRef.current.update(delta);
    }
  });

  return (
    <FlyControls 
      ref={controlsRef}
      movementSpeed={100}
      rollSpeed={0.5}
      dragToLook={true}
    />
  );
};

const SkillsSection = ({ onReturnToMain }) => {
  const [baseStyle, setBaseStyle] = useState('verdeEsmeralda');

  const handleReturnToMain = useCallback(() => {
    onReturnToMain();
  }, [onReturnToMain]);

  const handleBaseStyleChange = useCallback((newStyle) => {
    setBaseStyle(newStyle);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'black',
      position: 'relative'
    }}>
      <Canvas shadows gl={{ antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 200, 600]} fov={60} />
        <CameraController />
        <ambientLight intensity={0.1} />
        <directionalLight position={[100, 100, 50]} intensity={1} castShadow />
        <pointLight position={[-80, 120, -80]} intensity={1} color="#61DAFB" />
        <Suspense fallback={null}>
          <City baseStyle={baseStyle} />
        </Suspense>
        <SkyBox />
      </Canvas>
      <button
        onClick={handleReturnToMain}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '15px 30px',
          fontSize: '16px',
          backgroundColor: 'rgba(97, 218, 251, 0.8)',
          color: 'black',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 20px rgba(97, 218, 251, 0.5)',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Volver al Universo
      </button>
      <BaseStyleSelector currentStyle={baseStyle} onStyleChange={handleBaseStyleChange} />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px',
      }}>
        <p>WASD: Mover | Q/E: Subir/Bajar | Ratón: Mirar alrededor</p>
      </div>
    </div>
  );
};

export default SkillsSection;