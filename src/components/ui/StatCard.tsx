import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  variant?: 'default' | 'success' | 'warning' | 'error';
  loading?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
  loading = false,
  className = ''
}) => {
  const variantClasses = {
    default: 'border-dark-600 bg-dark-800',
    success: 'border-green-500/20 bg-green-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5',
    error: 'border-red-500/20 bg-red-500/5'
  };

  const getChangeColor = (changeValue: number) => {
    if (changeValue > 0) return 'text-green-500';
    if (changeValue < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  const formatChange = (changeValue: number) => {
    const prefix = changeValue > 0 ? '+' : '';
    return `${prefix}${changeValue.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={`p-6 border rounded-xl ${variantClasses.default} ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-3"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`p-6 border rounded-xl transition-all hover:shadow-lg ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon size={20} className="text-primary" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {change && (
          <div className="flex items-center gap-1 text-sm">
            {change.value > 0 ? (
              <FiTrendingUp size={16} className="text-green-500" />
            ) : change.value < 0 ? (
              <FiTrendingDown size={16} className="text-red-500" />
            ) : null}
            <span className={getChangeColor(change.value)}>
              {formatChange(change.value)}
            </span>
            <span className="text-gray-500">vs {change.period}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
