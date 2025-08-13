import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select option',
  onSelect,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-left flex items-center justify-between transition-all ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25'
        }`}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && <selectedOption.icon size={16} />}
          <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full px-4 py-3 text-left hover:bg-dark-600 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  {option.icon && <option.icon size={16} />}
                  <span>{option.label}</span>
                </div>
                {value === option.value && (
                  <FiCheck size={16} className="text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
