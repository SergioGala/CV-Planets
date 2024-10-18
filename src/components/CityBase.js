import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Cylinder, Ring } from '@react-three/drei';
import * as THREE from 'three';

const CityBase = ({ baseStyle = 'azulProfundo' }) => {
  const baseRef = useRef();
  const pulseRingsRef = useRef();

  // Dimensiones de la base
  const baseWidth = 2000;
  const baseDepth = 1000;

  // Materiales para la base
  const materials = useMemo(() => {
    const azulProfundo = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color("#001f3f") },
        color2: { value: new THREE.Color("#003366") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
    });

    const verdeEsmeralda = new THREE.MeshPhysicalMaterial({
      color: "#025955",
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });

    const purpuraOscuro = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color("#2E0854") },
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
        uniform vec3 baseColor;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv * 20.0;
          float shimmer = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time) * 0.1;
          vec3 color = baseColor + vec3(shimmer);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const cobreAntiguo = new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: new THREE.Color("#B87333") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        varying vec2 vUv;
        
        vec2 hexCoords(vec2 uv) {
          vec2 r = vec2(1, 1.73);
          vec2 h = r * 0.5;
          vec2 a = mod(uv, r) - h;
          vec2 b = mod(uv - h, r) - h;
          return dot(a, a) < dot(b, b) ? a : b;
        }
        
        void main() {
          vec2 hexUV = hexCoords(vUv * 50.0);
          float hexPattern = smoothstep(0.05, 0.1, length(hexUV));
          vec3 color = mix(baseColor * 1.2, baseColor * 0.8, hexPattern);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    return { azulProfundo, verdeEsmeralda, purpuraOscuro, cobreAntiguo };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animación de los anillos pulsantes
    pulseRingsRef.current.children.forEach((ring, i) => {
      ring.scale.setScalar(1 + Math.sin(t * 2 + i * 0.5) * 0.05);
    });

    // Actualizar tiempo para el material púrpura oscuro
    if (baseStyle === 'purpuraOscuro') {
      materials.purpuraOscuro.uniforms.time.value = t;
    }
  });

  return (
    <group ref={baseRef}>
      {/* Plataforma principal */}
      <Plane
        args={[baseWidth, baseDepth]}
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
        receiveShadow
      >
        <primitive object={materials[baseStyle]} attach="material" />
      </Plane>

      {/* Anillos pulsantes */}
      <group ref={pulseRingsRef} position={[0, 0.2, 0]}>
        {[200, 400, 600, 800].map((radius, index) => (
          <Ring key={index} args={[radius - 2, radius, 64]} rotation-x={-Math.PI / 2}>
            <meshBasicMaterial color="#4a90e2" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
          </Ring>
        ))}
      </group>

      {/* Bordes iluminados */}
      <Cylinder args={[baseWidth / 2, baseWidth / 2, 5, 64, 1, true]} position={[0, 2.5, 0]}>
        <meshBasicMaterial color="#4a90e2" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </Cylinder>

      {/* Puntos de energía en las esquinas */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map((pos, index) => (
        <group key={index} position={[pos[0] * (baseWidth / 2 - 50), 0, pos[1] * (baseDepth / 2 - 50)]}>
          <Cylinder args={[10, 10, 5, 16]} position={[0, 2.5, 0]}>
            <meshBasicMaterial color="#4a90e2" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
          </Cylinder>
          <pointLight intensity={0.6} distance={200} color="#4a90e2" position={[0, 10, 0]} />
        </group>
      ))}
    </group>
  );
};

export default CityBase;