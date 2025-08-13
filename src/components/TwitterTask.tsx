import React, { useState } from 'react';

const TwitterTask: React.FC = () => {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'fail'>('idle');
  const [error, setError] = useState('');

  const checkFollow = async () => {
    setStatus('checking');
    setError('');
    try {
      const res = await fetch('/api/check-twitter-follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twitterHandle }),
      });
      const data = await res.json();
      if (data.follows) {
        setStatus('success');
      } else {
        setStatus('fail');
      }
    } catch {
      setError('Server error. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mt-8 max-w-lg mx-auto flex flex-col gap-4">
      <h2 className="text-lg font-bold text-primary">Glob2Earn: Twitter Task</h2>
      <label className="text-sm text-gray-400">Enter your Twitter handle:</label>
      <input
        type="text"
        value={twitterHandle}
        onChange={e => setTwitterHandle(e.target.value)}
        className="px-4 py-2 rounded-lg border border-dark-600 bg-dark-900 text-white focus:outline-none focus:border-primary"
  placeholder="e.g. TheGlobNfts"
        disabled={status === 'checking'}
      />
      <button
        onClick={checkFollow}
        className="bg-primary text-dark-900 font-semibold rounded-lg px-4 py-2 hover:bg-primary/90 transition-all"
        disabled={!twitterHandle || status === 'checking'}
      >
  {status === 'checking' ? 'Checking...' : 'Check if Following @TheGlobNfts'}
      </button>
  {status === 'success' && <div className="text-green-400">✅ You are following @TheGlobNfts! Points awarded.</div>}
  {status === 'fail' && <div className="text-red-400">❌ You are not following @TheGlobNfts.</div>}
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};

export default TwitterTask;
