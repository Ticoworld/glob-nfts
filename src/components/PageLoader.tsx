import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';
import LoadingSpinner from './ui/LoadingSpinner';

interface PageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [mounted, setMounted] = useState(false);

  const loadingMessages = [
    'Loading Glob NFTs...',
    'Connecting to HyperLiquid...',
    'Preparing gallery...',
    'Almost ready...'
  ];

  // Ensure component is mounted before running effects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading || !mounted) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete?.(), 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random increment between 5-20
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
  }, [isLoading, mounted, onComplete]);

  // Don't render anything until mounted to prevent SSR issues
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-dark-900 flex items-center justify-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/20 rounded-full"></div>
            <div className="absolute top-3/4 right-1/4 w-48 h-48 border border-chaos-pink/20 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border border-primary/20 rounded-full"></div>
          </div>

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
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-2 border-chaos-pink/30 rounded-full absolute inset-2"
                />
                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/images/logo.jpg" alt="GlobNFTs Logo" className="w-full h-full object-cover" />
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

            {/* Loading Spinner */}
            <div className="mb-6">
              <LoadingSpinner size="lg" className="mx-auto" />
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

          {/* Animated Particles - Only render on client */}
          {mounted && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/20 rounded-full"
                  animate={{
                    x: [0, 300, 600, 300, 0],
                    y: [0, 200, 400, 600, 200],
                  }}
                  transition={{
                    duration: Math.random() * 8 + 12,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                  style={{
                    left: `${10 + (i * 20)}%`,
                    top: `${10 + (i * 15)}%`,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
