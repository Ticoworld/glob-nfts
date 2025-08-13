import React from 'react';
import { motion } from 'framer-motion';

export const NFTCardSkeleton: React.FC = () => {
  return (
    <div className="nft-card group overflow-hidden">
      <div className="aspect-square bg-gray-800 relative overflow-hidden">
        <motion.div 
          className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-5 bg-gray-700 rounded w-1/2 animate-pulse"></div>
          <div className="h-9 bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="nft-card p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-xl animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
        <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="text-center p-6 nft-card">
      <div className="h-8 bg-gray-700 rounded w-16 mx-auto mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-20 mx-auto animate-pulse"></div>
    </div>
  );
};
