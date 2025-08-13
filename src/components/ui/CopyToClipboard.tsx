import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  successMessage?: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
  className = '',
  showIcon = true,
  successMessage = 'Copied!'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {children}
      {showIcon && (
        <motion.div
          animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {copied ? (
            <FiCheck size={16} className="text-green-500" />
          ) : (
            <FiCopy size={16} />
          )}
        </motion.div>
      )}
      {copied && successMessage && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-sm text-green-500 font-medium"
        >
          {successMessage}
        </motion.span>
      )}
    </button>
  );
};

export default CopyToClipboard;
