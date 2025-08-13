import React from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{
        textShadow: [
          '0px 0px 0px rgba(255, 107, 189, 0)',
          '2px 2px 0px rgba(255, 107, 189, 0.8)',
          '-2px -2px 0px rgba(107, 206, 255, 0.8)',
          '0px 0px 0px rgba(255, 107, 189, 0)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      {text}
    </motion.span>
  );
};

export default GlitchText;
