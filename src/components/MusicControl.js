// src/MusicControl.js
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from './AppContext';

const MusicControl = () => {
  const { isPlaying, toggleAudio } = useAppContext();

  return (
    <motion.button
      onClick={toggleAudio}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '15px',
        background: 'rgba(56, 189, 248, 0.2)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.4)' }}
      whileTap={{ scale: 0.95 }}
    >
      {isPlaying ? '🔇' : '🔊'}
    </motion.button>
  );
};

export default MusicControl;