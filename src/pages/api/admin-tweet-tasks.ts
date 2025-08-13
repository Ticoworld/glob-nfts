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
    const { tweetId, action, wallet, message, signature, rejectionReason } = req.body;
    if (!tweetId || !['verified', 'rejected'].includes(action)) {
      return res.status(400).json({ error: 'Missing tweetId or invalid action' });
    }
    // Admin signature verification
    if (!wallet || !message || !signature) {
      return res.status(401).json({ error: 'Missing admin signature' });
    }
    let recovered;
    try {
      recovered = ethers.verifyMessage(message, signature).toLowerCase();
    } catch {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    if (recovered !== wallet.toLowerCase() || !ADMIN_WALLETS.includes(recovered)) {
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
    } else if (action === 'verified') {
      tweet.rejectionReason = undefined;
    }
    await tweet.save();
    // Award point if verified
    if (action === 'verified') {
      const user = await User.findOne({ wallet: tweet.wallet });
      if (user) {
        user.points = (user.points || 0) + 1;
        await user.save();
      }
    }
    return res.status(200).json({ success: true, tweet });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
