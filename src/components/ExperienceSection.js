import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import Confetti from 'react-confetti';
import { useAppContext } from './AppContext';


const ExperienceSection = ({ onReturnToMain }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 80 });
  const [playerStats, setPlayerStats] = useState({ level: 1, exp: 0, skills: [] });
  const [showInventory, setShowInventory] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const mapRef = useRef(null);
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    // Reiniciar el estado si es necesario
    setPlayerStats({ level: 1, exp: 0, skills: [] });
    onReturnToMain();
  };
  const { setCurrentView } = useAppContext();

  const experiences = useMemo(() => [
    {
      level: 1,
      year: 2017,
      company: "StartUp Dynamics",
      role: "Aprendiz de Código",
      description: "Comenzaste tu aventura como un humilde aprendiz, aprendiendo los fundamentos del desarrollo web.",
      skill: "HTML/CSS Básico",
      icon: "🏠",
      expGain: 100,
      item: "Pergamino de HTML",
    },
    {
      level: 5,
      year: 2018,
      company: "Creative Web Solutions",
      role: "Guerrero Front-end",
      description: "Te convertiste en un valiente guerrero front-end, dominando React y creando interfaces impresionantes.",
      skill: "React Avanzado",
      icon: "⚔️",
      expGain: 500,
      item: "Escudo de Componentes",
    },
    {
      level: 10,
      year: 2020,
      company: "Tech Innovators",
      role: "Héroe Full Stack",
      description: "Alcanzaste el rango de héroe full stack, conquistando tanto el front-end como el back-end.",
      skill: "Node.js Maestría",
      icon: "🏰",
      expGain: 1000,
      item: "Vara de Servidor",
    },
    {
      level: 20,
      year: 2023,
      company: "Future Technologies",
      role: "Arquitecto de Software",
      description: "Te convertiste en un visionario arquitecto de software, diseñando sistemas escalables y robustos.",
      skill: "Arquitectura de Sistemas",
      icon: "👑",
      expGain: 2000,
      item: "Corona del Arquitecto",
    }
  ], []);

  const handleKeyDown = useCallback((e) => {
    const speed = 5;
    switch(e.key) {
      case 'ArrowUp':
        setPlayerPosition(prev => ({ ...prev, y: Math.max(0, prev.y - speed) }));
        break;
      case 'ArrowDown':
        setPlayerPosition(prev => ({ ...prev, y: Math.min(95, prev.y + speed) }));
        break;
      case 'ArrowLeft':
        setPlayerPosition(prev => ({ ...prev, x: Math.max(0, prev.x - speed) }));
        break;
      case 'ArrowRight':
        setPlayerPosition(prev => ({ ...prev, x: Math.min(95, prev.x + speed) }));
        break;
      case 'i':
        setShowInventory(prev => !prev);
        break;
      case 'Enter':
        if (showDialog) setShowDialog(false);
        if (showCelebration) setShowCelebration(false);
        break;
      default:
        break;
    }
  }, [showDialog, showCelebration]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const checkCollision = () => {
      const playerRect = {
        left: playerPosition.x,
        right: playerPosition.x + 5,
        top: playerPosition.y,
        bottom: playerPosition.y + 5
      };

      experiences.forEach((exp, index) => {
        const expRect = {
          left: (index + 1) * 20 - 5,
          right: (index + 1) * 20 + 5,
          top: 45,
          bottom: 55
        };

        if (
          playerRect.left < expRect.right &&
          playerRect.right > expRect.left &&
          playerRect.top < expRect.bottom &&
          playerRect.bottom > expRect.top
        ) {
          setCurrentLevel(index);
          setShowDialog(true);
          if (!playerStats.skills.includes(exp.skill)) {
            setPlayerStats(prev => ({
              ...prev,
              level: Math.max(prev.level, exp.level),
              exp: prev.exp + exp.expGain,
              skills: [...prev.skills, exp.skill]
            }));
          }
        }
      });
    };

    checkCollision();
  }, [playerPosition, playerStats, experiences]);

  useEffect(() => {
    // Verificar si se han obtenido todas las experiencias
    if (playerStats.skills.length === experiences.length && !showCelebration) {
      setShowCelebration(true);
    }
  }, [playerStats.skills.length, experiences.length, showCelebration]);

  const backgroundAnimation = useSpring({
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '100% 50%' },
    config: { duration: 60000 },
    loop: true,
  });

  const Inventory = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(15, 23, 42, 0.9)',
        padding: '30px',
        borderRadius: '15px',
        width: '400px',
        color: 'white',
        boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(56, 189, 248, 0.5)',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '20px', fontSize: '24px' }}>Inventario Mágico</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {experiences.slice(0, currentLevel + 1).map((exp, index) => (
          <motion.li 
            key={index} 
            style={{ 
              padding: '15px', 
              margin: '10px 0', 
              background: 'rgba(30, 41, 59, 0.7)', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)' }}
          >
            <span style={{ fontSize: '24px', marginRight: '15px' }}>{exp.icon}</span>
            <span style={{ flex: 1 }}>{exp.item}</span>
          </motion.li>
        ))}
      </ul>
      <motion.button 
        onClick={() => setShowInventory(false)} 
        style={{
          background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56, 189, 248, 0.7)' }}
      >
        Cerrar Inventario
      </motion.button>
    </motion.div>
  );

  return (
    <animated.div style={{
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      position: 'relative',
      background: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80")',
      backgroundSize: '400% 400%',
      ...backgroundAnimation
    }}>
        <motion.button
        onClick={onReturnToMain}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1em',
          fontWeight: 'bold',
          zIndex: 1000,
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56, 189, 248, 0.7)' }}
      >
        Volver al Universo
      </motion.button>
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(5px)',
        }}
      />
      <div ref={mapRef} style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
      }}>
        {showInventory && <Inventory />}
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              left: `${(index + 1) * 20}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '5rem',
              filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.7))',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {exp.icon}
          </motion.div>
        ))}
        <motion.div
          style={{
            position: 'absolute',
            left: `${playerPosition.x}%`,
            top: `${playerPosition.y}%`,
            fontSize: '4rem',
            zIndex: 10,
            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))',
          }}
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          🧙‍♂️
        </motion.div>
      </div>
      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(17, 24, 39, 0.95)',
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '600px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(56, 189, 248, 0.5)',
            }}
          >
            <h2 style={{ color: '#38bdf8', marginBottom: '15px', fontSize: '28px' }}>{experiences[currentLevel].role}</h2>
            <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>{experiences[currentLevel].company} - {experiences[currentLevel].year}</p>
            <p style={{ marginBottom: '15px' }}>{experiences[currentLevel].description}</p>
            <p style={{ marginBottom: '10px' }}>Nivel alcanzado: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{experiences[currentLevel].level}</span></p>
            <p style={{ marginBottom: '10px' }}>Nueva habilidad: <span style={{ color: '#34d399', fontWeight: 'bold' }}>{experiences[currentLevel].skill}</span></p>
            <p style={{ marginBottom: '10px' }}>Experiencia ganada: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{experiences[currentLevel].expGain}</span></p>
            <p style={{ marginBottom: '20px' }}>Objeto obtenido: <span style={{ color: '#f472b6', fontWeight: 'bold' }}>{experiences[currentLevel].item}</span></p>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#9CA3AF' }}>
              Presiona Enter para cerrar
            </p>
            <motion.button 
              onClick={() => setShowDialog(false)} 
              style={{
                background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1em',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56, 189, 248, 0.7)' }}
            >
              Continuar aventura
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(17, 24, 39, 0.8)',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(56, 189, 248, 0.5)',
        }}
        whileHover={{ scale: 1.05 }}
      >
        <p style={{ margin: '5px 0', fontSize: '16px' }}>Nivel: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{playerStats.level}</span></p>
        <p style={{ margin: '5px 0', fontSize: '16px' }}>Experiencia: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{playerStats.exp}</span></p>
        <p style={{ margin: '5px 0', fontSize: '16px' }}>Habilidades: <span style={{ color: '#34d399', fontWeight: 'bold' }}>{playerStats.skills.join(', ')}</span></p>
      </motion.div>
      <motion.div 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(17, 24, 39, 0.8)',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(56, 189, 248, 0.5)',
        }}
        whileHover={{ scale: 1.05 }}
      >
        <p style={{ margin: '5px 0', fontSize: '16px' }}>Usa las flechas del teclado para moverte</p>
        <p style={{ margin: '5px 0', fontSize: '16px' }}>Presiona 'I' para abrir el inventario</p>
      </motion.div>
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(17, 24, 39, 0.95)',
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '600px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              zIndex: 1000,
            }}
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={500}
            />
            <h2 style={{ color: '#fbbf24', marginBottom: '15px', fontSize: '28px' }}>¡Felicidades!</h2>
            <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>Has completado todas las experiencias y has dominado todas las habilidades.</p>
            <motion.button
        onClick={() => setCurrentView('main')}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'linear-gradient(45deg, #38bdf8, #818cf8)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1em',
          fontWeight: 'bold',
          zIndex: 1000,
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56, 189, 248, 0.7)' }}
      >
        Volver al Universo
      </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </animated.div>
  );
};

export default ExperienceSection;