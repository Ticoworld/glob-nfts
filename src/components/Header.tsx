import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGlobe, FiExternalLink, FiUser } from 'react-icons/fi';
import LiquidButton from './ui/LiquidButton';



const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  const navItems = [
  { name: 'About', href: '#about' }, // Combines vision, roadmap, utility
  { name: 'Leaderboard', href: '#leaderboard' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Join Whitelist', href: '#whitelist' },
  ];



  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700/50' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo (clickable, links to landing page) */}
            <motion.a
              href="/"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
              title="Go to Home"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <img src="/images/logo.jpg" alt="GlobNFTs Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary">Glob</span>NFTs
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={`/#${item.href.replace('#', '')}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-300 hover:text-primary transition-colors font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </nav>

            {/* Desktop Profile & Connect Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex items-center gap-4"
            >
              <Link
                href="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-dark-600 text-gray-300 hover:text-primary hover:border-primary transition-all bg-dark-900"
                title="Profile"
              >
                <FiUser size={20} />
              </Link>
              <appkit-button />
            </motion.div>

            {/* Mobile Profile Icon & Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-dark-600 text-gray-300 hover:text-primary hover:border-primary transition-all bg-dark-900"
                title="Profile"
              >
                <FiUser size={20} />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-10 h-10 rounded-lg border border-dark-600 flex items-center justify-center text-white hover:border-primary hover:text-primary transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </header>

            {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-dark-900 border-l border-dark-700 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <img src="/images/logo.jpg" alt="GlobNFTs Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-bold">
                      <span className="text-primary">Glob</span>NFTs
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-8 h-8 rounded-lg border border-dark-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary transition-all"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 mb-8">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={`/#${item.href.replace('#', '')}`}
                      onClick={() => setIsMenuOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-dark-800 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <FiExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.a>
                  ))}
                </nav>

                {/* Profile Link (Mobile) - moved to header */}
                {/* Wallet Section */}
                <div className="border-t border-dark-700 pt-6">
                  <appkit-button />
                </div>

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-dark-700">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Live on HyperLiquid</div>
                    <div className="text-xs text-gray-500">
                      Community-driven NFT collection
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
