import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiWifi, FiWifiOff, FiCheck, FiAlertCircle, FiLoader, FiChevronDown, FiLogOut } from 'react-icons/fi';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WalletStatusProps {
  status: ConnectionStatus;
  address?: string;
  balance?: string;
  network?: string;
  className?: string;
  onDisconnect?: () => void;
}

const WalletStatus: React.FC<WalletStatusProps> = ({
  status,
  address,
  balance,
  network,
  className = '',
  onDisconnect,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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

  // Only show dropdown for connected status
  const clickable = status === 'connected' && onDisconnect;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer ${config.bgColor} ${config.borderColor} ${clickable ? 'hover:bg-dark-700/40 transition' : ''}`}
        onClick={clickable ? () => setMenuOpen((v) => !v) : undefined}
        tabIndex={clickable ? 0 : -1}
      >
        <motion.div
          animate={config.animate ? { rotate: 360 } : {}}
          transition={config.animate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          className={config.color}
        >
          <Icon size={18} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm ${config.color}`}>{config.text}</div>
          {status === 'connected' && address && (
            <div className="text-xs text-gray-400 truncate">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>
        {status === 'connected' && (
          <FiChevronDown className="text-gray-400 ml-2" size={16} />
        )}
        {status === 'connected' && balance && (
          <div className="text-right ml-2">
            <div className="text-sm font-medium text-white">{balance} ETH</div>
            {network && <div className="text-xs text-gray-400">{network}</div>}
          </div>
        )}
      </motion.div>
      {/* Dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-dark-900 border border-dark-700 rounded-lg shadow-lg z-50"
          >
            <button
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-400 hover:bg-dark-700/60 rounded-lg transition-all"
              onClick={() => {
                setMenuOpen(false);
                onDisconnect && onDisconnect();
              }}
            >
              <FiLogOut size={16} /> Disconnect Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletStatus;
