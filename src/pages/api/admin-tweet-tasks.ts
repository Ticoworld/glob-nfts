import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import TweetTask from '@/models/TweetTask';
import User from '@/models/User';
import { ethers } from 'ethers';

const ADMIN_WALLETS = process.env.ADMIN_WALLETS?.split(',').map(w => w.trim().toLowerCase()) || [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();


  // GET: List all pending tweets (for admin review)
  if (req.method === 'GET') {
    const pending = await TweetTask.find({ status: 'pending' }).sort({ createdAt: 1 });
    return res.status(200).json({ tweets: pending });
  }

  // POST: Update tweet status (verify or reject) - admin only
  if (req.method === 'POST') {
    const { tweetId, action, wallet, rejectionReason, pointsAwarded, bonus } = req.body;
    if (!tweetId || !['verified', 'rejected'].includes(action)) {
      return res.status(400).json({ error: 'Missing tweetId or invalid action' });
    }
    // Simple admin check (optional: check wallet against ADMIN_WALLETS)
    if (!wallet || !ADMIN_WALLETS.includes(wallet.toLowerCase())) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const tweet = await TweetTask.findOne({ tweetId });
    if (!tweet) return res.status(404).json({ error: 'Tweet not found' });
    if (tweet.status !== 'pending') {
      return res.status(409).json({ error: 'Tweet already reviewed' });
    }
    tweet.status = action;
    if (action === 'rejected' && rejectionReason) {
      tweet.rejectionReason = rejectionReason;
      tweet.pointsAwarded = 0;
      tweet.bonusPoints = 0;
    } else if (action === 'verified') {
      tweet.rejectionReason = undefined;
      tweet.pointsAwarded = typeof pointsAwarded === 'number' && pointsAwarded >= 1 && pointsAwarded <= 3 ? pointsAwarded : 1;
      tweet.bonusPoints = typeof bonus === 'number' && bonus > 0 ? bonus : 0;
    }
    await tweet.save();
    // Award points if verified
    if (action === 'verified') {
      const user = await User.findOne({ wallet: tweet.wallet });
      if (user) {
        user.points = (user.points || 0) + tweet.pointsAwarded + tweet.bonusPoints;
        await user.save();
      }
    }
    return res.status(200).json({ success: true, tweet });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
