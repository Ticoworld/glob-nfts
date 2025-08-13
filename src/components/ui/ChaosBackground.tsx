import React from 'react';
import { motion } from 'framer-motion';

const ChaosBackground: React.FC = () => {
  // Use fixed positions to prevent hydration mismatches
  const particles = [
    { id: 1, size: 120, top: '10%', left: '20%', color: 'from-primary/20 to-chaos-pink/20' },
    { id: 2, size: 80, top: '60%', left: '80%', color: 'from-chaos-blue/20 to-chaos-purple/20' },
    { id: 3, size: 200, top: '40%', left: '70%', color: 'from-chaos-pink/20 to-primary/20' },
    { id: 4, size: 100, top: '80%', left: '10%', color: 'from-chaos-purple/20 to-chaos-blue/20' },
    { id: 5, size: 150, top: '20%', left: '60%', color: 'from-primary/20 to-chaos-blue/20' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-gradient-to-br ${particle.color} blur-3xl`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 8 + particle.id,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900" />
    </div>
  );
};

export default ChaosBackground;
