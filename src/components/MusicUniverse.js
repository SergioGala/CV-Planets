// Importaciones
import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Stars, Trail, Billboard, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import ExperienceSection from './ExperienceSection';


// Utilidades
const createTexture = (color) => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, '#000000');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  
  for (let i = 0; i < 20; i++) {
    context.beginPath();
    context.arc(Math.random() * size, Math.random() * size, Math.random() * 10 + 5, 0, Math.PI * 2);
    context.fillStyle = `rgba(0,0,0,${Math.random() * 0.5})`;
    context.fill();
  }

  return new THREE.CanvasTexture(canvas);
};

// Componentes auxiliares
const SunCorona = () => {
  const geometry = useMemo(() => new THREE.SphereGeometry(3.2, 64, 64), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
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
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float d = length(uv);
        float c = smoothstep(1.0, 0.0, d) * 0.5 + 0.5;
        c += sin(d * 20.0 - time * 2.0) * 0.1;
        gl_FragColor = vec4(1.0, 0.7, 0.3, c * 0.5);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.getElapsedTime();
  });

  return <mesh geometry={geometry} material={material} />;
};

const Moon = ({ name, color, planetRef }) => {
  const moonRef = useRef();
  const moonRadius = 0.3;
  const orbitRadius = 2;
  const orbitSpeed = 0.5;

  useFrame((state) => {
    if (planetRef.current && moonRef.current) {
      const time = state.clock.getElapsedTime();
      moonRef.current.position.set(
        Math.cos(time * orbitSpeed) * orbitRadius,
        Math.sin(time * orbitSpeed) * orbitRadius,
        0
      );
    }
  });

  return (
    <group ref={moonRef}>
      <Sphere args={[moonRadius, 32, 32]}>
        <meshStandardMaterial color={color} />
      </Sphere>
    </group>
  );
};

const PlanetRings = ({ radius, color }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.2, radius * 1.5, 64]} />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

const InfoPanel = ({ name, description }) => (
  <Html>
    <div style={{
      background: 'rgba(0,0,0,0.7)',
      color: '#FFF',
      padding: '10px',
      borderRadius: '5px',
      width: '200px',
    }}>
      <h3 style={{ color: '#FFF' }}>{name}</h3>
      <p style={{ color: '#FFF' }}>{description}</p>
    </div>
  </Html>
);

const Asteroids = () => {
  const asteroids = useMemo(() => {
    return Array.from({ length: 100 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <group>
      {asteroids.map((asteroid, index) => (
        <mesh key={index} position={asteroid.position} rotation={asteroid.rotation} scale={asteroid.scale}>
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial color="#8B7D6B" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const CameraController = ({ target, setTraveling }) => {
  const { camera } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    if (target) {
      vec.set(target[0], target[1], target[2]);
      camera.position.lerp(vec, 0.05);
      if (camera.position.distanceTo(vec) < 0.1) {
        setTraveling(false);
      }
    }
  });

  return null;
};

const VisibleOrbit = ({ radius, color }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.05, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Componentes principales
const Sun = ({ setActive }) => {
  const sunTexture = useMemo(() => createTexture('#FDB813'), []);
  
  return (
    <group onClick={() => setActive('Mi Perfil')}>
      <Sphere args={[3, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial map={sunTexture} />
      </Sphere>
      <SunCorona />
      <Sparkles count={500} scale={8} size={4} speed={0.4} color="#FDB813" />
      <pointLight position={[0, 0, 0]} intensity={2} distance={50} decay={2} />
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, 4, 0]}>
        <Text fontSize={1} color="#F7F7F7" anchorX="center" anchorY="middle">
          Mi Perfil
        </Text>
      </Billboard>
    </group>
  );
};

const Planet = ({ position, color, name, setActive, orbitRadius, orbitSpeed, hasRings, description }) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  
  useFrame((state) => {
    setAngle((prevAngle) => prevAngle + orbitSpeed);
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    groupRef.current.position.set(x, 0, z);
    meshRef.current.rotation.y += 0.005;
  });

  const texture = useMemo(() => createTexture(color), [color]);

  return (
    <group ref={groupRef}>
      <Trail width={5} length={20} color={new THREE.Color(color)} attenuation={(t) => t * t}>
        <Sphere
          args={[1, 64, 64]}
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setActive(name)}
        >
          <meshStandardMaterial map={texture} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.2} />
        </Sphere>
      </Trail>
      {hasRings && <PlanetRings radius={1.5} color={color} />}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, 1.5, 0]}>
        <Text fontSize={0.5} color="#FFF" anchorX="center" anchorY="middle">
          {name}
        </Text>
      </Billboard>
      <Moon name={name} color={color} planetRef={meshRef} />
      <Sparkles count={100} scale={4} size={2} speed={0.2} color={color} />
      {hovered && (
        <>
          <Sparkles count={200} scale={5} size={3} speed={0.5} color={color} />
          <InfoPanel name={name} description={description} />
        </>
      )}
    </group>
  );
};

const CVLegend = ({ planets }) => {
    return (
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        borderRadius: '10px',
        color: 'white',
      }}>
        <h3 style={{ marginTop: 0 }}>Secciones del CV</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FDB813', marginRight: '10px' }}></div>
            Mi Perfil
          </li>
          {planets.map((planet, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: planet.color, marginRight: '10px' }}></div>
              {planet.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
const PlanetSection = ({ name, color }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle, ${color}22 0%, ${color}66 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      padding: '2rem',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#FFF' }}>{name}</h2>
      <p style={{ fontSize: '1.5rem', maxWidth: '800px', textAlign: 'center', color: '#FFF' }}>
        Aquí iría la información detallada sobre {name}. Puedes incluir texto, imágenes, gráficos o cualquier otro contenido relevante para esta sección de tu CV.
      </p>
    </div>
  );
};

// Componente principal MusicUniverse
const MusicUniverse = () => {
  const [active, setActive] = useState(null);
  const [traveling, setTraveling] = useState(false);
  const [cameraTarget, setCameraTarget] = useState(null);

  const planets = useMemo(() => [
    { name: 'Experiencia', color: '#FF6B6B', orbitRadius: 15, orbitSpeed: 0.0005, hasRings: false, description: "Años de experiencia en desarrollo web y móvil." },
    { name: 'Habilidades', color: '#4ECDC4', orbitRadius: 18, orbitSpeed: 0.0007, hasRings: true, description: "Experto en JavaScript, React, y Node.js." },
    { name: 'Proyectos', color: '#45B7D1', orbitRadius: 21, orbitSpeed: 0.0009, hasRings: false, description: "Portfolio de proyectos innovadores." },
    { name: 'Educación', color: '#F7B731', orbitRadius: 24, orbitSpeed: 0.0011, hasRings: true, description: "Grado en Ingeniería Informática y formación continua." },
    { name: 'Logros', color: '#8B78E6', orbitRadius: 27, orbitSpeed: 0.0013, hasRings: true, description: "Reconocimientos y certificaciones en el campo." },
  ], []);

  const handlePlanetClick = useCallback((name) => {
    const planet = planets.find(p => p.name === name);
    setCameraTarget(name === 'Mi Perfil' ? [0, 0, 0] : [planet.orbitRadius, 0, 0]);
    setActive(name);
    setTraveling(true);
  }, [planets]);

  const renderActiveSection = () => {
    if (active === 'Experiencia') {
      return <ExperienceSection />;
    } else if (active === 'Mi Perfil') {
      return <PlanetSection name={active} color="#FDB813" />;
    } else {
      const planet = planets.find(p => p.name === active);
      return planet ? <PlanetSection name={active} color={planet.color} /> : null;
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      <Canvas camera={{ position: [0, 20, 35], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enabled={!traveling} />
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
        <Asteroids />
        <Sun setActive={handlePlanetClick} />
        {planets.map((planet, index) => (
          <React.Fragment key={index}>
            <VisibleOrbit radius={planet.orbitRadius} color={planet.color} />
            <Planet {...planet} setActive={handlePlanetClick} />
          </React.Fragment>
        ))}
        <CameraController target={cameraTarget} setTraveling={setTraveling} />
        <fog attach="fog" args={['#000', 0, 50]} />
      </Canvas>
      <CVLegend planets={planets} />
      {active && !traveling && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {renderActiveSection()}
        </div>
      )}
    </div>
  );
};
    
    export default MusicUniverse;