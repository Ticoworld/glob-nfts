import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMessageCircle, FiTwitter, FiGithub, FiExternalLink, FiTrendingUp } from 'react-icons/fi';

const Community: React.FC = () => {
  const communityStats = [
    { icon: FiUsers, label: 'Discord Members', value: '12.7K', color: 'text-chaos-blue' },
    { icon: FiTwitter, label: 'Twitter Followers', value: '28.3K', color: 'text-primary' },
    { icon: FiTrendingUp, label: 'Daily Active', value: '3.2K', color: 'text-chaos-pink' },
    { icon: FiGithub, label: 'Contributors', value: '89', color: 'text-chaos-purple' },
  ];

  const socialLinks = [
    { 
      name: 'Discord', 
      icon: FiMessageCircle, 
      href: '#', 
      members: '12.7K', 
      description: 'Join our vibrant Discord community for real-time discussions, alpha calls, and exclusive drops.',
      color: 'bg-indigo-600' 
    },
    { 
      name: 'Twitter', 
      icon: FiTwitter, 
      href: '#', 
      members: '28.3K', 
      description: 'Follow us for the latest updates, market insights, and community highlights.',
      color: 'bg-blue-500' 
    },
    { 
      name: 'GitHub', 
      icon: FiGithub, 
      href: '#', 
      members: '89', 
      description: 'Contribute to our open-source ecosystem and help shape the future of NFTs.',
      color: 'bg-gray-800' 
    },
  ];

  const features = [
    {
      icon: FiUsers,
      title: 'Exclusive Access',
      description: 'Get early access to new drops, private sales, and community-only features.',
    },
    {
      icon: FiTrendingUp,
      title: 'Market Insights',
      description: 'Access real-time analytics, floor price tracking, and trading recommendations.',
    },
    {
      icon: FiMessageCircle,
      title: 'Direct Communication',
      description: 'Connect directly with artists, developers, and fellow collectors.',
    },
  ];

  return (
    <section id="community" className="py-20 lg:py-32 bg-dark-800">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl text-display mb-6"
          >
            Join the <span className="text-gradient">Community</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with creators, collectors, and innovators. Be part of the decentralized future of digital art and creativity.
          </motion.p>
        </div>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20"
        >
          {communityStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="nft-card p-6 text-center"
            >
              <stat.icon className={`mx-auto mb-3 ${stat.color}`} size={32} />
              <div className="text-2xl lg:text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm lg:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Platforms */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-20"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="nft-card p-6 lg:p-8 block group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${social.color}`}>
                    <social.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">{social.name}</h3>
                    <p className="text-gray-400 text-sm">{social.members} members</p>
                  </div>
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-gray-300 leading-relaxed">
                {social.description}
              </p>
            </motion.a>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            Community <span className="text-gradient">Benefits</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h4 className="font-semibold text-xl mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center gradient-border p-1"
        >
          <div className="bg-dark-900 rounded-xl p-8 lg:p-12">
            <h3 className="text-3xl lg:text-4xl text-display mb-6">
              Ready to join the future of <span className="text-gradient">NFTs</span>?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with thousands of creators and collectors building the next generation of digital art.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Join Discord
              </button>
              <button className="btn-secondary">
                Follow on Twitter
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Community;
