import React from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiWifiOff, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WalletStatusProps {
  status: ConnectionStatus;
  address?: string;
  balance?: string;
  network?: string;
  className?: string;
}

const WalletStatus: React.FC<WalletStatusProps> = ({
  status,
  address,
  balance,
  network,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          icon: FiLoader,
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/20',
          borderColor: 'border-blue-400/30',
          text: 'Connecting...',
          animate: true
        };
      case 'connected':
        return {
          icon: FiCheck,
          color: 'text-green-400',
          bgColor: 'bg-green-400/20',
          borderColor: 'border-green-400/30',
          text: 'Connected',
          animate: false
        };
      case 'error':
        return {
          icon: FiAlertCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-400/20',
          borderColor: 'border-red-400/30',
          text: 'Connection Error',
          animate: false
        };
      default:
        return {
          icon: FiWifiOff,
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/20',
          borderColor: 'border-gray-400/30',
          text: 'Disconnected',
          animate: false
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <motion.div
        animate={config.animate ? { rotate: 360 } : {}}
        transition={config.animate ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        className={config.color}
      >
        <Icon size={18} />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm ${config.color}`}>
          {config.text}
        </div>
        
        {status === 'connected' && address && (
          <div className="text-xs text-gray-400 truncate">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>
      
      {status === 'connected' && balance && (
        <div className="text-right">
          <div className="text-sm font-medium text-white">
            {balance} ETH
          </div>
          {network && (
            <div className="text-xs text-gray-400">
              {network}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WalletStatus;
