import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import TweetTask from '@/models/TweetTask';

// Helper to fetch tweet data from Twitter API
async function fetchTweetData(tweetIds: string[], bearerToken: string) {
  // Twitter API v2 batch endpoint: https://api.twitter.com/2/tweets?ids=...
  // Docs: https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets
  const idsParam = tweetIds.join(',');
  const url = `https://api.twitter.com/2/tweets?ids=${idsParam}&tweet.fields=author_id,created_at,text`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  if (!res.ok) throw new Error('Twitter API error');
  const data = await res.json();
  return data.data || [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) return res.status(500).json({ error: 'No Twitter API token' });

  await dbConnect();
  // Get all pending tweets
  const pending = await TweetTask.find({ status: 'pending' }).lean();
  if (!pending.length) return res.status(200).json({ tweets: [] });

  // Batch in groups of 100 (Twitter API limit)
  const allResults = [];
  for (let i = 0; i < pending.length; i += 100) {
    const batch = pending.slice(i, i + 100);
    const tweetIds = batch.map(t => t.tweetId);
    try {
      const tweets = await fetchTweetData(tweetIds, bearerToken);
      // Map results to include keyword/mention checks
      for (const tweet of tweets) {
        const text = tweet.text || '';
        allResults.push({
          tweetId: tweet.id,
          text,
          author_id: tweet.author_id,
          created_at: tweet.created_at,
          hasGlobNFT: /#?globnft/i.test(text),
          hasOfficialMention: /@OfficialGlobNFT/i.test(text),
        });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Twitter API error' });
    }
  }
  return res.status(200).json({ tweets: allResults });
}
