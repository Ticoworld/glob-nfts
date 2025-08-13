import React from 'react';
import { motion } from 'framer-motion';

interface LiquidButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const LiquidButton: React.FC<LiquidButtonProps> = ({ text, onClick, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden px-8 py-4 rounded-full font-bold text-dark-900 ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary to-chaos-pink"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
        style={{ width: '200%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-chaos-pink" />
    </motion.button>
  );
};

export default LiquidButton;
