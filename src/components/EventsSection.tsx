import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiExternalLink } from 'react-icons/fi';

const Events: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const events = [
    {
      id: 1,
      title: 'HyperLiquid NFT Drop',
      date: '2024-08-15',
      time: '14:00 UTC',
      type: 'launch',
      status: 'upcoming',
      description: 'Exclusive NFT collection launch on HyperLiquid chain featuring 1000 unique digital assets.',
      participants: 156,
      location: 'Virtual Event'
    },
    {
      id: 2,
      title: 'Collectors Showcase',
      date: '2024-08-20',
      time: '18:00 UTC',
      type: 'showcase',
      status: 'live',
      description: 'Community showcase featuring top collections and rare finds from our collectors.',
      participants: 89,
      location: 'Discord Stage'
    },
    {
      id: 3,
      title: 'Trading Workshop',
      date: '2024-08-25',
      time: '16:00 UTC',
      type: 'education',
      status: 'upcoming',
  description: 'Join community events and learn from fellow collectors.',
      participants: 234,
      location: 'Virtual Workshop'
    }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.type === activeFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/20';
      case 'upcoming': return 'text-blue-400 bg-blue-400/20';
      case 'ended': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <section id="events" className="py-20 bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Upcoming <span className="text-primary">Events</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Stay updated with the latest drops, showcases, and community events.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {['all', 'launch', 'showcase', 'education'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full capitalize transition-all ${
                activeFilter === filter
                  ? 'bg-primary text-dark-900 font-bold'
                  : 'bg-dark-800 hover:bg-dark-700 text-gray-300'
              }`}
            >
              {filter === 'all' ? 'All Events' : filter}
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-dark-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-dark-700"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                  <button className="text-gray-400 hover:text-primary transition-colors">
                    <FiExternalLink size={18} />
                  </button>
                </div>

                <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">
                  {event.title}
                </h3>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FiCalendar size={16} className="text-primary" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FiMapPin size={16} className="text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FiUsers size={16} className="text-primary" />
                    <span>{event.participants} interested</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary/90 transition-colors">
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-dark-800 rounded-2xl p-8 max-w-2xl mx-auto border border-dark-700">
            <h3 className="text-2xl font-bold mb-4">Never Miss an Event</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter to get notified about upcoming drops and exclusive events.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:border-primary outline-none transition-colors"
              />
              <button className="px-8 py-3 bg-primary text-dark-900 font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
