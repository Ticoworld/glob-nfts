import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'success', duration });
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'error', duration });
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'warning', duration });
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'info', duration });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return <FiCheck size={20} />;
      case 'error': return <FiX size={20} />;
      case 'warning': return <FiAlertCircle size={20} />;
      case 'info': return <FiInfo size={20} />;
    }
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500/90 border-green-400/50 text-white';
      case 'error': return 'bg-red-500/90 border-red-400/50 text-white';
      case 'warning': return 'bg-yellow-500/90 border-yellow-400/50 text-dark-900';
      case 'info': return 'bg-blue-500/90 border-blue-400/50 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm max-w-sm ${getToastStyles(toast.type)}`}
          >
            {getToastIcon(toast.type)}
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
