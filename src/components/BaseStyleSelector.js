// BaseStyleSelector.js
import React from 'react';

const BaseStyleSelector = ({ currentStyle, onStyleChange }) => {
  const styles = {
    container: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'rgba(10, 20, 30, 0.8)',
      padding: '15px',
      borderRadius: '15px',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    },
    title: {
      color: '#00FFFF',
      marginBottom: '15px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: '300px',
    },
    button: {
      margin: '5px',
      width: '80px',
      height: '80px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    buttonContent: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      fontWeight: 'bold',
      textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    },
  };

  const styleOptions = [
    { name: 'azulProfundo', color: '#001f3f' },
    { name: 'verdeEsmeralda', color: '#025955' },
    { name: 'purpuraOscuro', color: '#2E0854' },
    { name: 'cobreAntiguo', color: '#B87333' },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Estilo de Base</h3>
      <div style={styles.buttonsContainer}>
        {styleOptions.map((style) => (
          <button
            key={style.name}
            style={{
              ...styles.button,
              backgroundColor: style.color,
              boxShadow: currentStyle === style.name ? '0 0 15px #00FFFF' : 'none',
              transform: currentStyle === style.name ? 'scale(1.1)' : 'scale(1)',
            }}
            onClick={() => onStyleChange(style.name)}
          >
            <div style={styles.buttonContent}>
              {style.name.charAt(0).toUpperCase()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BaseStyleSelector;