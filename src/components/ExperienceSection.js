import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Play } from 'lucide-react';

const ExperienceSection = () => {
  const experiences = [
    { title: "Desarrollador Full Stack", company: "Tech Innovators", year: "2020-2023", description: "Desarrollo de aplicaciones web utilizando React y Node.js." },
    { title: "Desarrollador Front-end", company: "Creative Web Solutions", year: "2018-2020", description: "Creación de interfaces de usuario interactivas y responsivas." },
    { title: "Pasante de Desarrollo", company: "StartUp Dynamics", year: "2017", description: "Aprendizaje y aplicación de metodologías ágiles en proyectos reales." },
  ];

  return (
    <div className="experience-timeline" style={{ padding: '2rem', background: 'linear-gradient(to bottom, #1a1a2e, #16213e)', height: '100%', overflowY: 'auto' }}>
      <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '2rem' }}>Mi Trayectoria Musical</h2>
      <div className="timeline" style={{ position: 'relative' }}>
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            className="experience-item"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem',
              color: '#fff',
            }}
          >
            <Disc size={64} color="#4ecdc4" style={{ marginRight: '1rem' }} />
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{exp.title}</h3>
              <p style={{ fontSize: '1rem', color: '#ccc' }}>{exp.company} | {exp.year}</p>
              <p style={{ fontSize: '1rem' }}>{exp.description}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
            >
              <Play size={32} color="#4ecdc4" />
            </motion.div>
          </motion.div>
        ))}
        <div className="timeline-line" style={{
          position: 'absolute',
          left: '32px',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'linear-gradient(to bottom, #4ecdc4, #45b7d1)',
          transform: 'translateX(-50%)',
        }} />
      </div>
    </div>
  );
};

export default ExperienceSection;