import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';

interface SimplePageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const SimplePageLoader: React.FC<SimplePageLoaderProps> = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading Glob NFTs...');

  const loadingMessages = [
    'Loading Glob NFTs...',
    'Connecting to HyperLiquid...',
    'Preparing gallery...',
    'Almost ready...'
  ];

  useEffect(() => {
    if (!isLoading) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete?.(), 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-dark-900 flex items-center justify-center"
        >
          <div className="text-center max-w-md px-6">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-2 border-primary/30 rounded-full absolute inset-0"
                />
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-chaos-pink rounded-full flex items-center justify-center">
                  <FiGlobe className="text-dark-900" size={32} />
                </div>
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold mb-2"
            >
              <span className="text-primary">Glob</span>NFTs
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-400 mb-8"
            >
              Professional NFT Marketplace on HyperLiquid
            </motion.p>

            {/* Simple Loading Spinner */}
            <div className="mb-6">
              <motion.div
                className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Loading Text */}
            <motion.p
              key={loadingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-300 font-medium mb-6"
            >
              {loadingText}
            </motion.p>

            {/* Progress Bar */}
            <div className="w-full bg-dark-700 rounded-full h-1 mb-4">
              <motion.div
                className="bg-gradient-to-r from-primary to-chaos-pink h-1 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="text-sm text-gray-500">
              {Math.round(Math.min(progress, 100))}% Complete
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimplePageLoader;
