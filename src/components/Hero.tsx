import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiUsers, FiBarChart } from 'react-icons/fi';

const Hero: React.FC = () => {
  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  // No fake stats or fictional numbers. Only honest messaging below.

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chaos-pink/5" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Featured NFT Showcase - Community Focused */}
            <div className="lg:col-span-5 lg:order-2 order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative max-w-lg mx-auto mb-8 lg:mb-0"
              >
                <div className="gradient-border p-1">
                  <div className="bg-dark-800 rounded-xl overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-700 relative">
                      {/* Use actual NFT image */}
                      <img 
                        src="/images/nft1.jpg" 
                        alt="Featured NFT"
                        className="w-full h-full object-cover"
                      />
                      {/* Community badge */}
                      <div className="absolute top-4 left-4 bg-chaos-pink/80 backdrop-blur px-3 py-1.5 rounded-lg">
                        <span className="text-white font-semibold text-sm">Featured Chaos NFT</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Chaos Manifestation #001</h3>
                          <p className="text-gray-400 text-sm">by GlobberArtist</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 btn-primary"
                          onClick={() => document.getElementById('chaos-battle')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          Join Chaos Battle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content - Mobile Second */}
            <div className="lg:col-span-7 lg:order-1 order-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center px-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                  Live on HyperLiquid
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-display mb-6 leading-tight">
                  Where <span className="text-gradient">Chaos</span>
                  <br />
                  Meets <span className="text-gradient">Creativity</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  GlobNFTs is a chaotic, community-driven NFT collection. Make posts about the project, earn points, and climb the leaderboard. Join the chaos, showcase your creativity, and unlock future utility as a holder!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <button 
                    onClick={() => document.getElementById('chaos-battle')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
                  >
                    Join Chaos Battle
                    <FiArrowRight size={18} />
                  </button>
                  <button 
                    onClick={scrollToGallery}
                    className="btn-secondary inline-flex items-center justify-center gap-2 text-lg"
                  >
                    Explore Collection
                  </button>
                </div>

                {/* Stats */}
                {/* Honest messaging only. No stats or numbers displayed. */}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
