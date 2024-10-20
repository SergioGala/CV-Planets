// BaseStyleSelector.js
import React from 'react';

const BaseStyleSelector = ({ currentStyle, onStyleChange }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(255,255,255,0.1)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#61DAFB', fontSize: '14px' }}>Estilo de Base</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['verdeEsmeralda', 'azulProfundo', 'purpuraOscuro', 'cobreAntiguo'].map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            style={{
              width: '30px',
              height: '30px',
              margin: '2px',
              border: currentStyle === style ? '2px solid white' : 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              backgroundColor: style === 'verdeEsmeralda' ? '#025955' :
                               style === 'azulProfundo' ? '#001f3f' :
                               style === 'purpuraOscuro' ? '#2E0854' :
                               '#B87333'
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default BaseStyleSelector;