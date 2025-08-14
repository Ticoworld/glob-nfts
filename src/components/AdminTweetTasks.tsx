import React, { useEffect, useState } from 'react';
import Loader from './ui/Loader';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/contexts/ToastContext';

const AdminTweetTasks: React.FC = () => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState<{ [tweetId: string]: string }>({});
  const [signing, setSigning] = useState(false);
  const [batchResults, setBatchResults] = useState<any[] | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  // Batch check tweets with Twitter API
  const handleBatchCheck = async () => {
    setBatchLoading(true);
    setError('');
    try {
      const res = await fetch('/api/batch-check-tweets', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setBatchResults(data.tweets);
        toast.success('Batch check complete!');
      } else {
        setError(data.error || 'Batch check failed.');
        setBatchResults(null);
      }
    } catch {
      setError('Server error');
      setBatchResults(null);
    } finally {
      setBatchLoading(false);
    }
  };
  const { isConnected, address, connect } = useWeb3();
  const toast = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Get admin wallets from env (injected at build time)
  const adminWallets = (process.env.NEXT_PUBLIC_ADMIN_WALLETS || '').split(',').map(w => w.trim().toLowerCase()).filter(Boolean);

  useEffect(() => {
    if (isConnected && address) {
      setIsAdmin(adminWallets.includes(address.toLowerCase()));
    } else {
      setIsAdmin(null);
    }
  }, [isConnected, address]);

  const fetchTweets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-tweet-tasks');
      const data = await res.json();
      if (res.ok) setTweets(data.tweets);
      else setError(data.error || 'Failed to fetch tweets');
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const [rejectionReasons, setRejectionReasons] = useState<{ [tweetId: string]: string }>({});
  const [tweetPoints, setTweetPoints] = useState<{ [tweetId: string]: number }>({});
  const [bonusPoints, setBonusPoints] = useState<{ [tweetId: string]: number }>({});
  const handleAction = async (tweetId: string, action: 'verified' | 'rejected') => {
    if (!isConnected || !address) {
      toast.error('Connect your admin wallet first.');
      return;
    }
    let rejectionReason = '';
    let pointsAwarded = tweetPoints[tweetId] || 1;
    let bonus = bonusPoints[tweetId] || 0;
    if (action === 'rejected') {
      rejectionReason = rejectionReasons[tweetId] || '';
      pointsAwarded = 0;
      bonus = 0;
    }
    setActionStatus(s => ({ ...s, [tweetId]: 'pending' }));
    try {
      const res = await fetch('/api/admin-tweet-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetId, action, wallet: address, rejectionReason, pointsAwarded, bonus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionStatus(s => ({ ...s, [tweetId]: action }));
        fetchTweets();
        toast.success('Action successful!');
      } else {
        setActionStatus(s => ({ ...s, [tweetId]: 'error' }));
        toast.error(data.error || 'Action failed.');
      }
    } catch (err: any) {
      setActionStatus(s => ({ ...s, [tweetId]: 'error' }));
      toast.error('Action failed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">Admin: Tweet Task Moderation</h2>
      <div className="mb-8 flex flex-col items-center gap-4">
        {!isConnected || !address ? (
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-500 transition"
            onClick={connect}
          >
            Connect Admin Wallet
          </button>
        ) : (
          <span className="text-green-400 font-mono text-sm bg-dark-700 px-3 py-1 rounded-full">Connected: {address.slice(0, 8)}...{address.slice(-4)}</span>
        )}
        {signing && <span className="text-yellow-400 text-xs">Awaiting signature...</span>}
      </div>

      {/* Show messages for wallet status */}
      {!isConnected || !address ? (
        <div className="text-center text-gray-400 text-lg">Please connect your admin wallet to access moderation tools.</div>
      ) : isAdmin === false ? (
        <div className="text-center text-red-400 text-lg font-semibold">This wallet is not authorized for admin moderation.</div>
      ) : isAdmin === true ? (
        loading ? (
          <div className="flex justify-center py-12"><Loader size="md" text="Loading tweet tasks..." /></div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : tweets.length === 0 ? (
          <div className="text-gray-400">No pending tweets to review.</div>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl shadow-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50"
                onClick={handleBatchCheck}
                disabled={batchLoading}
              >
                {batchLoading ? 'Checking Tweets...' : 'Check Tweets (Batch)'}
              </button>
            </div>
            {batchResults && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 text-primary">Batch Check Results</h3>
                <div className="space-y-4">
                  {batchResults.length === 0 ? (
                    <div className="text-gray-400">No pending tweets found in Twitter API.</div>
                  ) : (
                    batchResults.map((result: any) => (
                      <div key={result.tweetId} className="bg-dark-700 border border-dark-600 rounded p-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">ID: {result.tweetId}</span>
                          <span className="text-xs text-gray-400">{result.created_at ? new Date(result.created_at).toLocaleString() : ''}</span>
                        </div>
                        <div className="text-sm text-gray-300 mt-1">{result.text}</div>
                        <div className="flex gap-3 mt-2">
                          <span className={result.hasGlobNFT ? 'text-green-400' : 'text-red-400'}>
                            {result.hasGlobNFT ? '#GlobNFT found' : 'No #GlobNFT'}
                          </span>
                          <span className={result.hasGlobNftsMention ? 'text-green-400' : 'text-red-400'}>
                            {result.hasGlobNftsMention ? '@TheGlobNfts found' : 'No @TheGlobNfts'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="space-y-6">
              {tweets.map(tweet => (
                <div key={tweet._id} className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">{tweet.wallet}</span>
                    <span className="text-xs text-gray-400">{new Date(tweet.createdAt).toLocaleString()}</span>
                  </div>
                  <a href={tweet.tweetUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                    {tweet.tweetUrl}
                  </a>
                  <div className="flex gap-3 mt-2 items-center">
                    <label className="text-xs text-gray-300">Base Points:
                      <select
                        className="ml-2 px-2 py-1 rounded border border-dark-600 bg-dark-900 text-xs text-white focus:outline-none focus:border-green-400"
                        value={tweetPoints[tweet.tweetId] || 1}
                        onChange={e => setTweetPoints(tp => ({ ...tp, [tweet.tweetId]: Number(e.target.value) }))}
                        disabled={actionStatus[tweet.tweetId] === 'pending' || !isConnected || signing}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </label>
                    <label className="text-xs text-yellow-300 ml-4">Bonus:
                      <input
                        type="number"
                        min={0}
                        max={10}
                        className="ml-2 px-2 py-1 rounded border border-dark-600 bg-dark-900 text-xs text-white focus:outline-none focus:border-yellow-400"
                        value={typeof bonusPoints[tweet.tweetId] === 'number' && bonusPoints[tweet.tweetId] > 0 ? bonusPoints[tweet.tweetId] : ''}
                        placeholder="0"
                        onChange={e => {
                          const val = Number(e.target.value);
                          setBonusPoints(bp => ({ ...bp, [tweet.tweetId]: isNaN(val) ? 0 : val }));
                        }}
                        disabled={actionStatus[tweet.tweetId] === 'pending' || !isConnected || signing}
                        style={{ width: 60 }}
                      />
                    </label>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                      disabled={actionStatus[tweet.tweetId] === 'pending' || !isConnected || signing}
                      onClick={() => handleAction(tweet.tweetId, 'verified')}
                    >
                      {actionStatus[tweet.tweetId] === 'verified' ? 'Verified!' : 'Verify'}
                    </button>
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        className="px-2 py-1 rounded border border-dark-600 bg-dark-900 text-xs text-white focus:outline-none focus:border-red-400"
                        placeholder="Rejection reason (optional)"
                        value={rejectionReasons[tweet.tweetId] || ''}
                        onChange={e => setRejectionReasons(r => ({ ...r, [tweet.tweetId]: e.target.value }))}
                        disabled={actionStatus[tweet.tweetId] === 'pending' || !isConnected || signing}
                        style={{ minWidth: 120 }}
                      />
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-xs"
                        disabled={actionStatus[tweet.tweetId] === 'pending' || !isConnected || signing}
                        onClick={() => handleAction(tweet.tweetId, 'rejected')}
                      >
                        {actionStatus[tweet.tweetId] === 'rejected' ? 'Rejected!' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      ) : null}
    </div>
  );
};

export default AdminTweetTasks;
