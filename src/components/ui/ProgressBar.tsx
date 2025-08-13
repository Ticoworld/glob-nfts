import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 'md', 
  variant = 'primary',
  showPercentage = false,
  className = '' 
}) => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-dark-700 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <motion.div
          className={`${heightClasses[height]} rounded-full ${variantClasses[variant]}`}
          initial={{ width: '0%' }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="text-right text-sm text-gray-400 mt-1">
          {clampedProgress.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
