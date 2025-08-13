import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUsers, FiTrendingUp, FiZap, FiAward, FiActivity } from 'react-icons/fi';

const Events: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Genesis Collection Drop',
      description: 'The inaugural NFT drop featuring 100 unique digital artworks from renowned creators',
      date: '2025-08-15',
      time: '18:00 UTC',
      status: 'upcoming',
      participants: 1247,
      type: 'drop',
      price: '0.08 ETH',
      icon: FiZap
    },
    {
      id: 2,
      title: 'Creator Tournament',
      description: 'Weekly competition showcasing the best digital artists. Win exclusive rewards and recognition.',
      date: '2025-08-12',
      time: '20:00 UTC',
      status: 'live',
      participants: 892,
      type: 'competition',
      prize: '5 ETH Pool',
      icon: FiAward
    },
    {
      id: 3,
      title: 'Community AMA',
      description: 'Ask the team about roadmap updates, technical developments, and future plans',
      date: '2025-08-10',
      time: '16:00 UTC',
      status: 'live',
      participants: 2134,
      type: 'ama',
      icon: FiUsers
    },
    {
      id: 4,
      title: 'Digital Art Showcase',
      description: 'Submit your artwork for community voting and potential inclusion in upcoming collections',
      date: '2025-08-20',
      time: '12:00 UTC',
      status: 'upcoming',
      participants: 456,
      type: 'contest',
      prize: '2 ETH + Featured',
      icon: FiActivity
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'upcoming': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'ended': return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  return (
    <section id="events" className="py-20 lg:py-32 bg-dark-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl text-display mb-6"
          >
            <span className="text-gradient">Upcoming</span> Events
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Join our community events, participate in drops, and connect with creators in the NFT ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Featured Event */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="gradient-border p-1">
              <div className="bg-dark-800 rounded-xl p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <FiZap className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-2">{events[0].title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(events[0].status)}`}>
                          {events[0].status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">{events[0].description}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="text-center">
                        <FiCalendar className="mx-auto mb-2 text-primary" size={20} />
                        <div className="text-sm text-gray-400 mb-1">Date</div>
                        <div className="font-semibold">{events[0].date}</div>
                      </div>
                      <div className="text-center">
                        <FiClock className="mx-auto mb-2 text-chaos-pink" size={20} />
                        <div className="text-sm text-gray-400 mb-1">Time</div>
                        <div className="font-semibold">{events[0].time}</div>
                      </div>
                      <div className="text-center">
                        <FiUsers className="mx-auto mb-2 text-chaos-blue" size={20} />
                        <div className="text-sm text-gray-400 mb-1">Registered</div>
                        <div className="font-semibold">{events[0].participants}</div>
                      </div>
                      <div className="text-center">
                        <FiZap className="mx-auto mb-2 text-chaos-purple" size={20} />
                        <div className="text-sm text-gray-400 mb-1">Price</div>
                        <div className="font-semibold">{events[0].price}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="btn-primary">
                        Register Now
                      </button>
                      <button className="btn-secondary">
                        Set Reminder
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-80 h-64 bg-gradient-to-br from-primary/10 to-chaos-pink/10 rounded-xl relative overflow-hidden border border-gray-800">
                    <img 
                      src="/images/banner.jpeg" 
                      alt="Featured Event"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other Events */}
          {events.slice(1).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="nft-card p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <event.icon className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{event.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Date & Time</div>
                  <div className="font-medium">{event.date} at {event.time}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Participants</div>
                  <div className="font-medium">{event.participants} registered</div>
                </div>
              </div>

              {event.prize && (
                <div className="mb-6">
                  <div className="text-gray-400 text-sm mb-1">Prize Pool</div>
                  <div className="font-semibold text-primary">{event.prize}</div>
                </div>
              )}

              <button className="w-full btn-primary">
                Join Event
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="text-center p-6 nft-card">
            <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">47</div>
            <div className="text-gray-400">Events Hosted</div>
          </div>
          <div className="text-center p-6 nft-card">
            <div className="text-2xl lg:text-3xl font-bold text-chaos-pink mb-2">12K+</div>
            <div className="text-gray-400">Participants</div>
          </div>
          <div className="text-center p-6 nft-card">
            <div className="text-2xl lg:text-3xl font-bold text-chaos-blue mb-2">28K</div>
            <div className="text-gray-400">Community</div>
          </div>
          <div className="text-center p-6 nft-card">
            <div className="text-2xl lg:text-3xl font-bold text-chaos-purple mb-2">156</div>
            <div className="text-gray-400">ETH Distributed</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
