import React, { Suspense, useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
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
import MongoDBBuilding from "./MongoDBBuilding";
import RedisBuilding from './RedisBuilding';
import DockerBuilding from './DockerBuilding';
import JestBuilding from './JestBuilding';
import TensorFlowBuilding from './TensorFlowBuilding';
import BaseStyleSelector from './BaseStyleSelector';

const buildings = [
  { Component: ReactBuilding, key: 'react', name: 'React' },
  { Component: AngularBuilding, key: 'angular', name: 'Angular' },
  { Component: NextJSBuilding, key: 'nextjs', name: 'Next.js' },
  { Component: StyledTailwindBuilding, key: 'styledtailwind', name: 'Styled Components / Tailwind' },
  { Component: JavaScriptBuilding, key: 'javascript', name: 'JavaScript' },
  { Component: TypeScriptBuilding, key: 'typescript', name: 'TypeScript' },
  { Component: PythonBuilding, key: 'python', name: 'Python' },
  { Component: NodeExpressBuilding, key: 'nodeexpress', name: 'Node.js / Express' },
  { Component: GraphQLBuilding, key: 'graphql', name: 'GraphQL' },
  { Component: PostgreSQLBuilding, key: 'postgresql', name: 'PostgreSQL' },
  { Component: MongoDBBuilding, key: 'mongodb', name: 'MongoDB' },
  { Component: RedisBuilding, key: 'redis', name: 'Redis' },
  { Component: DockerBuilding, key: 'docker', name: 'Docker' },
  { Component: JestBuilding, key: 'jest', name: 'Jest' },
  { Component: TensorFlowBuilding, key: 'tensorflow', name: 'TensorFlow.js' },
];

const City = React.memo(({ baseStyle }) => {
  const groupRef = useRef();
  const buildingSpacing = 140;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <CityBase baseStyle={baseStyle} />
      {buildings.map((building, index) => (
        <building.Component 
          key={building.key}
          position={[(index - 7) * buildingSpacing, 0, 0]}
        />
      ))}
    </group>
  );
});

const CameraController = ({ target, zoom }) => {
  const { camera, controls } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        duration: 2,
        x: target[0],
        y: target[1],
        z: target[2],
        onUpdate: () => controlsRef.current.update()
      });

      gsap.to(camera.position, {
        duration: 2,
        x: target[0] + zoom.x,
        y: target[1] + zoom.y,
        z: target[2] + zoom.z,
        onUpdate: () => controlsRef.current.update()
      });
    }
  }, [target, zoom, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, controlsRef.current?.domElement]}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
    />
  );
};

const Legend = ({ onBuildingClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: isOpen ? 0 : 300 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '280px',
        backgroundColor: 'rgba(10, 25, 41, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '15px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 0 20px rgba(97, 218, 251, 0.5)',
        borderLeft: '4px solid #61DAFB'
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '-20px',
          backgroundColor: '#61DAFB',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '20px',
          color: '#0A1929',
          boxShadow: '0 0 10px rgba(97, 218, 251, 0.5)'
        }}
      >
        {isOpen ? '>' : '<'}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={{ margin: '0 0 20px 0', color: '#61DAFB', fontSize: '18px', textAlign: 'center' }}>Edificios de Tecnologías</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {buildings.map((building, index) => (
                <motion.li 
                  key={building.key}
                  whileHover={{ scale: 1.05, color: '#61DAFB' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    margin: '10px 0',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => onBuildingClick(index)}
                >
                  {building.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SkillsSection = ({ onReturnToMain }) => {
  const [baseStyle, setBaseStyle] = useState('verdeEsmeralda');
  const [cameraTarget, setCameraTarget] = useState([0, 150, 0]);
  const [cameraZoom, setCameraZoom] = useState({ x: 0, y: 150, z: 1200 });

  const handleReturnToMain = useCallback(() => {
    onReturnToMain();
  }, [onReturnToMain]);

  const handleBaseStyleChange = useCallback((newStyle) => {
    setBaseStyle(newStyle);
  }, []);

  const handleBuildingClick = useCallback((index) => {
    const buildingSpacing = 140;
    const x = (index - 7) * buildingSpacing;
    setCameraTarget([x, 150, 0]);
    setCameraZoom({ x: 0, y: 50, z: 300 }); // Zoom más cercano
  }, []);

  const handleResetView = useCallback(() => {
    setCameraTarget([0, 150, 0]);
    setCameraZoom({ x: 0, y: 150, z: 1200 }); // Vista inicial
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'black',
      position: 'relative'
    }}>
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 300, 1200]} fov={60} />
        <CameraController target={cameraTarget} zoom={cameraZoom} />
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
      <button 
        onClick={handleResetView}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '280px',
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
        Resetear Vista
      </button>
      <BaseStyleSelector currentStyle={baseStyle} onStyleChange={handleBaseStyleChange} />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '15px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        boxShadow: '0 0 10px rgba(255,255,255,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#61DAFB' }}>Controles de Cámara</h3>
        <p style={{ margin: '5px 0' }}><strong>Clic izquierdo + Arrastrar:</strong> Rotar</p>
        <p style={{ margin: '5px 0' }}><strong>Clic derecho + Arrastrar:</strong> Pan</p>
        <p style={{ margin: '5px 0' }}><strong>Rueda del ratón:</strong> Zoom</p>
      </div>
      <Legend onBuildingClick={handleBuildingClick} />
    </div>
  );
};

export default React.memo(SkillsSection);