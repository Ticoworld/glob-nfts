
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const TwitterConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'fail'>('idle');
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check Twitter connection status from backend
  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }
      // Debug: log the wallet address being used
      console.log('TwitterConnect: Checking status for wallet', address);
      try {
        const res = await fetch(`/api/twitter/status?wallet=${address}`);
        if (!res.ok) throw new Error('Not connected');
        const data = await res.json();
        // Debug: log the response
        console.log('TwitterConnect: status response', data);
        if (data.twitterConnected && data.twitterHandle) {
          setConnected(true);
          setTwitterHandle(data.twitterHandle);
          setAvatar(data.avatarUrl || null);
        } else {
          setConnected(false);
          setTwitterHandle('');
          setAvatar(null);
        }
      } catch (err) {
        setConnected(false);
        setTwitterHandle('');
        setAvatar(null);
        // Debug: log the error
        console.error('TwitterConnect: status fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [isConnected, address]);
  // Disconnect Twitter (optional, backend should support this endpoint)
  const disconnectTwitter = async () => {
    setError('');
    try {
      const res = await fetch('/api/twitter/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address }),
      });
      if (res.ok) {
        setConnected(false);
        setTwitterHandle('');
        setAvatar(null);
        setStatus('idle');
      } else {
        setError('Failed to disconnect.');
      }
    } catch {
      setError('Server error.');
    }
  };

  // Start Twitter OAuth flow
  const startAuth = async () => {
    setError('');
    // Debug: log the wallet address being used for auth
    console.log('TwitterConnect: Starting auth for wallet', address);
    try {
      const res = await fetch(`/api/twitter/start-auth?wallet=${address}`);
      const data = await res.json();
      // Debug: log the response
      console.log('TwitterConnect: start-auth response', data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Could not start Twitter auth.');
      }
    } catch (err) {
      setError('Server error.');
      // Debug: log the error
      console.error('TwitterConnect: start-auth error', err);
    }
  };



  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mt-8 max-w-lg mx-auto flex flex-col gap-4">
      <h2 className="text-lg font-bold text-primary">Glob2Earn: Connect Twitter</h2>
      {loading ? (
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-8 h-8 bg-dark-700 rounded-full" />
          <div className="h-4 w-32 bg-dark-700 rounded" />
        </div>
      ) : !connected ? (
        <button
          onClick={startAuth}
          className="bg-primary text-dark-900 font-semibold rounded-lg px-4 py-2 hover:bg-primary/90 transition-all"
          disabled={!isConnected || !address}
          title={!isConnected ? 'Connect your wallet first' : 'Connect your Twitter account'}
        >
          {isConnected ? 'Connect Twitter' : 'Connect Wallet First'}
        </button>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {avatar && (
              <img src={avatar} alt="Twitter avatar" className="w-8 h-8 rounded-full border border-primary transition-all duration-300" title="Twitter avatar" />
            )}
            <div className="text-green-400 font-semibold" title="Your Twitter handle">@{twitterHandle}</div>
          </div>
          <div className="text-xs text-gray-400 break-all" title="Your connected wallet address">Wallet: {address}</div>
          <button
            className="bg-primary text-dark-900 font-semibold rounded-lg px-4 py-2 opacity-60 cursor-not-allowed"
            disabled
            title="Twitter already connected"
          >
            Twitter Connected
          </button>
          <button
            onClick={disconnectTwitter}
            className="bg-dark-700 text-red-400 border border-red-400 rounded-lg px-4 py-2 hover:bg-red-500 hover:text-white transition-all mt-2"
            title="Disconnect your Twitter account"
          >
            Disconnect Twitter
          </button>

        </>
      )}
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};

export default TwitterConnect;
