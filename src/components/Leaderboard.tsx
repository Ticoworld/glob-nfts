import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'all-time'>('weekly');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load leaderboard');
        setLoading(false);
      });
  }, []);
  
  return (
    <section id="leaderboard" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="text-chaos-purple">CHAOS</span> Leaderboard
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            The most chaotic Globbers ruling the HyperLiquid chain. Will you be next?
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800 rounded-2xl overflow-hidden glass-effect max-w-4xl mx-auto"
        >
          {/* Tab Headers */}
          <div className="border-b border-dark-700 flex">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-4 font-bold transition-colors ${
                activeTab === 'weekly'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Weekly Chaos
            </button>
            <button
              onClick={() => setActiveTab('all-time')}
              className={`flex-1 py-4 font-bold transition-colors ${
                activeTab === 'all-time'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All-Time Legends
            </button>
          </div>
          
          <div className="p-6">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 py-4 font-bold border-b border-dark-700 text-gray-400">
              <div className="col-span-1">#</div>
              <div className="col-span-4">User</div>
              <div className="col-span-3">Points</div>
              <div className="col-span-4">Status</div>
            </div>
            
            {/* Leaderboard Entries */}
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">{error}</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No leaderboard data yet.</div>
            ) : (
              <div className="divide-y divide-dark-700">
                {users.map((user, idx) => {
                  let status = '';
                  let badgeClass = '';
                  if (idx < 50) {
                    status = 'Whitelist';
                    badgeClass = 'bg-green-900 text-green-400';
                  } else if (idx < 100) {
                    status = 'FCFS';
                    badgeClass = 'bg-yellow-900 text-yellow-400';
                  }
                  return (
                    <div key={user.wallet} className="grid grid-cols-12 gap-4 py-4 items-center">
                      <div className="col-span-1 font-bold text-primary">{idx + 1}</div>
                      <div className="col-span-4 font-mono text-white truncate">{user.wallet}</div>
                      <div className="col-span-3 text-green-400 font-bold">{user.points}</div>
                      <div className="col-span-4">
                        {status && (
                          <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${badgeClass}`}>{status}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-6 text-center border-t border-dark-700">
            <p className="text-gray-400 mb-4">
              Want to climb the ranks? Start collecting and trading to earn chaos points!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-6 py-3 bg-primary text-dark-900 font-bold rounded-full hover:bg-primary/90 transition-colors">
                Join the Chaos
              </button>
              <button className="px-6 py-3 bg-dark-700 hover:bg-chaos-purple font-bold rounded-full transition-colors">
                View All Rankings
              </button>
            </div>
          </div>
        </motion.div>

  {/* Removed floating/animated background and badges for a cleaner look */}
      </div>
    </section>
  );
};

export default Leaderboard;
