import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTwitter, FiMessageSquare, FiUsers, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import StatCard from './ui/StatCard';
import Modal from './ui/Modal';
import Tooltip from './ui/Tooltip';
import CopyToClipboard from './ui/CopyToClipboard';

const CommunitySection: React.FC = () => {
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [showTwitterModal, setShowTwitterModal] = useState(false);

  const stats = [
    { 
      label: 'Community Members', 
      value: '12.5K', 
      icon: FiUsers,
      change: { value: 15.2, period: 'last month' }
    },
    { 
      label: 'Daily Active Users', 
      value: '2.1K', 
      icon: FiTrendingUp,
      change: { value: 8.7, period: 'last week' }
    },
    { 
      label: 'Discord Members', 
      value: '8.3K', 
      icon: FiMessageSquare,
      change: { value: 23.1, period: 'last month' }
    },
    { 
      label: 'Twitter Followers', 
      value: '15.2K', 
      icon: FiTwitter,
      change: { value: 12.4, period: 'last month' }
    },
  ];

  const features = [
    {
      title: 'Exclusive Access',
      description: 'Get early access to new drops and exclusive community-only collections.',
      icon: FiUsers
    },
    {
      title: 'Trading Insights',
      description: 'Share and discover trading strategies with fellow collectors and traders.',
      icon: FiTrendingUp
    },
    {
      title: 'Community Events',
      description: 'Join virtual meetups, AMAs, and exclusive showcases with creators.',
      icon: FiMessageSquare
    }
  ];

  return (
    <section id="community" className="py-20 bg-dark-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Join the <span className="text-primary">Community</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Connect with collectors, creators, and enthusiasts in our thriving community.
          </motion.p>
        </div>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Tooltip
              key={stat.label}
              content={`${stat.change?.value > 0 ? 'Growing' : 'Trending'} ${Math.abs(stat.change?.value || 0)}% vs ${stat.change?.period}`}
              position="top"
            >
              <StatCard
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                variant="default"
              />
            </Tooltip>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-dark-700 rounded-2xl p-8 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-dark-600">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-chaos-pink/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-3xl font-bold mb-4">Ready to Join?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with thousands of NFT enthusiasts, share your collections, and stay updated with the latest trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowDiscordModal(true)}
                className="px-8 py-3 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center"
              >
                <FiMessageSquare size={20} />
                Join Discord
              </button>
              <button 
                onClick={() => setShowTwitterModal(true)}
                className="px-8 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2 justify-center"
              >
                <FiTwitter size={20} />
                Follow on Twitter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Discord Modal */}
        <Modal
          isOpen={showDiscordModal}
          onClose={() => setShowDiscordModal(false)}
          title="Join Our Discord Community"
          size="md"
          variant="default"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Connect with thousands of NFT enthusiasts, get exclusive drops, and stay updated with the latest trends.
            </p>
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Discord Invite:</span>
                <CopyToClipboard 
                  text="https://discord.gg/glob-nfts"
                  className="text-primary hover:text-primary/80"
                >
                  <span className="font-mono text-sm">discord.gg/glob-nfts</span>
                </CopyToClipboard>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <a
                href="https://discord.gg/glob-nfts"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center"
              >
                <FiExternalLink size={16} />
                Open Discord
              </a>
              <button
                onClick={() => setShowDiscordModal(false)}
                className="px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        {/* Twitter Modal */}
        <Modal
          isOpen={showTwitterModal}
          onClose={() => setShowTwitterModal(false)}
          title="Follow Us on Twitter"
          size="md"
          variant="default"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Stay updated with the latest news, drops, and community highlights from Glob NFTs.
            </p>
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Twitter Handle:</span>
                <CopyToClipboard 
                  text="@GlobNFTs"
                  className="text-primary hover:text-primary/80"
                >
                  <span className="font-mono text-sm">@GlobNFTs</span>
                </CopyToClipboard>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <a
                href="https://twitter.com/GlobNFTs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center"
              >
                <FiExternalLink size={16} />
                Follow on Twitter
              </a>
              <button
                onClick={() => setShowTwitterModal(false)}
                className="px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
};

export default CommunitySection;
