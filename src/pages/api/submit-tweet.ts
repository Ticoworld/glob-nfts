
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import TweetTask from '@/models/TweetTask';
import User from '@/models/User';

// Helper that returns a Date object for start-of-week (Monday) at UTC midnight
function getStartOfWeekUTC(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 (Sun) - 6 (Sat)
  const shift = day === 0 ? 6 : day - 1; // Monday -> 0, Sunday -> 6
  d.setUTCDate(d.getUTCDate() - shift);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let { wallet, tweetUrl } = req.body;
  if (!wallet || !tweetUrl) return res.status(400).json({ error: 'Missing wallet or tweetUrl' });

  tweetUrl = tweetUrl.split('?')[0].replace(/\/$/, '');
  const urlMatch = tweetUrl.match(/^https?:\/\/(x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)/);
  if (!urlMatch) return res.status(400).json({ error: 'Invalid tweet URL. Must be from x.com or twitter.com and include username.' });

  const usernameFromUrl = urlMatch[2].toLowerCase();
  const tweetId = urlMatch[3];

  await dbConnect();

  // duplicate tweet check
  const existingTweet = await TweetTask.findOne({ tweetId });
  if (existingTweet) {
    if (existingTweet.status === 'rejected') {
      return res.status(409).json({ error: 'This tweet was previously rejected and cannot be resubmitted.' });
    }
    return res.status(409).json({ error: 'This tweet has already been submitted.' });
  }

  const user = await User.findOne({ wallet });
  if (!user || !user.twitter) return res.status(400).json({ error: 'User not found or Twitter not connected.' });

  const userTwitter = user.twitter.toLowerCase();
  if (user.twitter !== userTwitter) { user.twitter = userTwitter; await user.save(); }
  if (userTwitter !== usernameFromUrl) return res.status(400).json({ error: 'Tweet URL does not belong to your connected Twitter account.' });

  // --- NEW: compute starts using UTC-safe helper
  const now = new Date();
  const dayStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)); // today UTC midnight
  const weekStartUTC = getStartOfWeekUTC(now);

  // Only count pending + verified
  const statusFilter = { $in: ['pending', 'verified'] };

  // Debugging: show which docs match (remove logs when done)
  const weekQuery = { wallet, status: statusFilter, createdAt: { $gte: weekStartUTC } };
  const dayQuery  = { wallet, status: statusFilter, createdAt: { $gte: dayStartUTC } };

  const weekMatches = await TweetTask.find(weekQuery).lean();
  const dayMatches  = await TweetTask.find(dayQuery).lean();

  const tweetCountThisWeek = weekMatches.length;
  const tweetCountToday = dayMatches.length;

  // Check daily first (so user sees daily-limit when applicable)
  if (tweetCountToday >= 1) {
    return res.status(429).json({ error: 'Daily tweet submission limit reached (1 per day)' });
  }
  if (tweetCountThisWeek >= 2) {
    return res.status(429).json({ error: 'Weekly tweet submission limit reached (2 per week)' });
  }

  const tweetTask = await TweetTask.create({
    wallet,
    tweetId,
    tweetUrl,
    status: 'pending',
    createdAt: now
  });

  return res.status(200).json({ success: true, tweetTask });
}
