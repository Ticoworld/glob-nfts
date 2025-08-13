import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const TweetSubmission: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [tweetUrl, setTweetUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'limit'>('idle');
  const [error, setError] = useState('');
  const [tweetCount, setTweetCount] = useState<number>(0);
  const [myTweets, setMyTweets] = useState<any[]>([]);
  const [loadingTweets, setLoadingTweets] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;
    // Fetch this week's verified tweet count
    fetch(`/api/tweet-count?wallet=${address}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') setTweetCount(data.count);
      });
    // Fetch all my tweet submissions
    setLoadingTweets(true);
    fetch(`/api/my-tweets?wallet=${address}`)
      .then(res => res.json())
      .then(data => {
        setMyTweets(Array.isArray(data.tweets) ? data.tweets : []);
      })
      .finally(() => setLoadingTweets(false));
  }, [isConnected, address, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/submit-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address, tweetUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setTweetUrl('');
      } else if (res.status === 429) {
        setStatus('limit');
        setError(data.error || 'Weekly tweet limit reached');
      } else {
        setStatus('error');
        setError(data.error || 'Submission failed');
      }
    } catch {
      setStatus('error');
      setError('Server error. Please try again.');
    }
  };

  if (!isConnected) return null;

  return (
    <div id="tweet-submission-section" className="bg-dark-800 border border-dark-700 rounded-xl p-6 mt-8 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-primary">Glob2Earn: Tweet Task</h2>
      <div className="text-gray-400 text-sm mb-2">You can submit up to <b>2 tweets per week</b> for points.</div>
      <div className="text-green-400 font-semibold mb-2">Tweets submitted this week: {tweetCount} / 2</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={tweetUrl}
          onChange={e => setTweetUrl(e.target.value)}
          className="px-4 py-2 rounded-lg border border-dark-600 bg-dark-900 text-white focus:outline-none focus:border-primary"
          placeholder="Paste your tweet link here"
          disabled={status === 'submitting' || tweetCount >= 2}
        />
        <button
          type="submit"
          className="bg-primary text-dark-900 font-semibold rounded-lg px-4 py-2 hover:bg-primary/90 transition-all"
          disabled={!tweetUrl || status === 'submitting' || tweetCount >= 2}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Tweet'}
        </button>
      </form>
      {status === 'success' && <div className="text-green-400">✅ Tweet submitted! Pending verification.</div>}
      {status === 'limit' && error && (
        <div className="text-yellow-400">⚠️ {error}</div>
      )}
      {status === 'error' && <div className="text-red-400">{error}</div>}

      {/* Tweet submission history/status */}
      <div className="mt-6">
        <h3 className="text-primary text-base font-bold mb-2">Your Tweet Submissions</h3>
        {loadingTweets ? (
          <div className="text-gray-400">Loading...</div>
        ) : myTweets.length === 0 ? (
          <div className="text-gray-400">No tweets submitted yet.</div>
        ) : (
          <div className="space-y-2">
            {myTweets.map((tweet) => (
              <div key={tweet._id} className="flex flex-col md:flex-row md:items-center gap-2 bg-dark-900 border border-dark-700 rounded px-3 py-2">
                <a href={tweet.tweetUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all text-xs md:text-sm">
                  {tweet.tweetUrl}
                </a>
                <span className="text-xs md:text-sm font-mono">
                  {tweet.status === 'pending' && <span className="text-yellow-400">Pending</span>}
                  {tweet.status === 'verified' && <span className="text-green-400">Approved</span>}
                  {tweet.status === 'rejected' && <span className="text-red-400">Rejected</span>}
                </span>
                <span className="text-xs text-gray-500">{tweet.createdAt ? new Date(tweet.createdAt).toLocaleString() : ''}</span>
                {tweet.status === 'rejected' && tweet.rejectionReason && (
                  <span className="text-xs text-red-300 italic">Reason: {tweet.rejectionReason}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetSubmission;
