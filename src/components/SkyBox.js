import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const SkyBox = () => {
  const { scene, gl } = useThree();
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  const texture = useTexture('/textures/Galaxy 4k HDRI_0.png', 
    (loadedTexture) => {
      console.log('Texture loaded successfully');
      setTextureLoaded(true);
    },
    (error) => {
      console.error('Error loading texture:', error);
    }
  );
  
  useEffect(() => {
    if (textureLoaded) {
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
  }, [scene, gl, texture, textureLoaded]);

  return null;
};

export default SkyBox;