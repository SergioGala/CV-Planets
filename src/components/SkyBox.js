import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';


const SkyBox = () => {
  const { scene, gl } = useThree();
  
  const texture = useTexture('/textures/Galaxy 4k HDRI_0.png');

  useEffect(() => {
    if (texture) {
      console.log('Applying texture to scene');
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(gl, texture);
      scene.background = rt.texture;
    } else {
      console.log('Using fallback background color');
      scene.background = new THREE.Color(0x000011);
    }

    return () => {
      if (scene.background && scene.background.dispose) {
        scene.background.dispose();
      }
    };
  }, [scene, gl, texture]);

  return null;
};

export default SkyBox;