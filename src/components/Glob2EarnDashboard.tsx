import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'pending';
  points: number;
  action?: () => void;
}

const Glob2EarnDashboard: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [tweetCount, setTweetCount] = useState(0);
  const [discordJoined, setDiscordJoined] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) return;
    setLoading(true);
    // Fetch tweet count
    fetch(`/api/tweet-count?wallet=${address}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') setTweetCount(data.count);
      });
    // Fetch Discord join status (stub, replace with real API)
    fetch(`/api/check-discord?wallet=${address}`)
      .then(res => res.json())
      .then(data => {
        setDiscordJoined(!!data.joined);
      });
    // Fetch Twitter connect status (stub, replace with real API)
    fetch(`/api/twitter/status?wallet=${address}`)
      .then(res => res.json())
      .then(data => {
        setTwitterConnected(!!data.twitterConnected);
      })
      .finally(() => setLoading(false));
  }, [isConnected, address]);

  if (!isConnected) return null;

  const scrollToTweetSubmission = () => {
    const el = document.getElementById('tweet-submission-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
    
  const discordOAuthUrl = `https://discord.com/oauth2/authorize?client_id=1405178465443123220&response_type=code&redirect_uri=https%3A%2F%2Fx38rdtp2-3000.uks1.devtunnels.ms%2Fapi%2Fdiscord%2Fcallback&scope=identify+guilds.join&state=${address}`;

  const tasks: Task[] = [
    {
      id: 'twitter-connect',
      name: 'Connect Twitter',
      description: 'Connect your Twitter account to earn 1 point.',
      status: twitterConnected ? 'completed' : 'pending',
      points: twitterConnected ? 1 : 0,
      action: () => window.open('/profile', '_self'), // Replace with actual connect flow
    },
    {
  id: 'tweet',
  name: 'Tweet 5 Times',
  description: `Post up to 5 tweets this week to earn points. (${tweetCount}/5 tweets)\nEach approved tweet can earn 1–3 base points plus bonus for engagement.`,
  status: tweetCount >= 5 ? 'completed' : 'pending',
  points: tweetCount,
  action: tweetCount < 5 ? scrollToTweetSubmission : undefined,
    },
    // Discord tasks commented out for now
    // {
    //   id: 'discord-join',
    //   name: 'Join Discord',
    //   description: 'Step 1: Join our Discord server.',
    //   status: discordJoined ? 'completed' : 'pending',
    //   points: 0,
    //   action: () => window.open('https://discord.gg/J2zd8KR2', '_blank'),
    // },
    // {
    //   id: 'discord-verify',
    //   name: 'Verify Discord Join',
    //   description: 'Step 2: Verify your Discord join to earn 5 points.',
    //   status: discordJoined ? 'completed' : 'pending',
    //   points: discordJoined ? 5 : 0,
    //   action: () => window.open(discordOAuthUrl, '_blank'),
    // },
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mt-8 max-w-3xl mx-auto">
      <h2 className="text-lg font-bold mb-4 text-primary">Glob2Earn Tasks</h2>
      <div className="bg-dark-900 rounded-lg p-4 mb-6 border border-dark-700">
        <h3 className="text-base font-semibold text-green-400 mb-2">How to Earn More Points</h3>
        <ul className="list-disc ml-6 text-xs text-gray-300 mb-2">
          <li>Post creative, high-effort tweets about the project.</li>
          <li>Tag <span className="text-blue-400 font-mono">@TheGlobNfts</span> in your tweet.</li>
          <li>Include the hashtag <span className="text-blue-400 font-mono">#GlobNFT</span>.</li>
          <li>Engage your audience—likes, comments, and retweets may earn bonus points.</li>
          <li>Admins review tweets and award 1-3 points based on quality and engagement.</li>
        </ul>
        <div className="text-xs text-yellow-400">Tip: The more creative and engaging your tweet, the more points you can earn!</div>
      </div>
      {loading ? (
        <div className="text-gray-400">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tasks.map(task => (
            <div key={task.id} className="flex flex-col bg-dark-900 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">{task.name}</span>
                <span className={task.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
                  {task.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-2">{task.description}</div>
              <div className="text-xs text-blue-400 mb-2">Points: {task.points}</div>
              {task.status === 'pending' && task.action && (
                <button
                  className="text-xs text-primary underline focus:outline-none"
                  onClick={task.action}
                >
                  Do Task
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Glob2EarnDashboard;
