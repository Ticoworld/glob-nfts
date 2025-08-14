import React from 'react';
import { motion } from 'framer-motion';
import { FiTwitter, FiMessageCircle, FiGithub, FiMail, FiGlobe } from 'react-icons/fi';

const Footer: React.FC = () => {
  const footerLinks = {
    community: [
      { name: 'Discord', href: '#', icon: FiMessageCircle },
      { name: 'Twitter', href: '#', icon: FiTwitter },
      { name: 'GitHub', href: '#', icon: FiGithub },
      { name: 'Newsletter', href: '#', icon: FiMail },
    ],
  // ...removed marketplace links...
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API', href: '#' },
      { name: 'Support', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
  };

  const stats = [
  { label: 'NFTs Created', value: '10K+' },
  { label: 'Artists', value: '500+' },
  { label: 'Collectors', value: '8K+' },
  ];

  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                    <img src="/images/logo.jpg" alt="GlobNFTs Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-2xl font-bold">
                    <span className="text-primary">Glob</span>NFTs
                  </span>
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Where chaos meets creativity on the HyperLiquid chain. Join the revolution of disorderly fun and discover unique NFTs created by the most chaotic minds.
                </p>
                
                {/* Social Links */}
                <div className="flex gap-4 mb-6">
                  {footerLinks.community.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(254, 199, 160, 0.1)' }}
                      className="p-3 bg-dark-800 rounded-full transition-all"
                    >
                      <link.icon size={20} />
                    </motion.a>
                  ))}
                </div>

                {/* Newsletter */}
                <div className="mb-6">
                  <h4 className="font-bold mb-3">Stay Updated</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <button className="px-4 py-2 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary/90 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Marketplace section removed */}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-bold mb-4 text-chaos-pink">Resources</h4>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-bold mb-4 text-chaos-blue">Company</h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="font-bold mb-4 text-chaos-purple">Stats</h4>
                  <div className="space-y-3">
                    {stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-dark-700 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span>© 2025 GlobNFTs. Made with passion on HyperLiquid</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
