import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { requireAuth } from '@/utils/auth';
import { rateLimit } from '@/utils/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rateLimit(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require cryptographic authentication
  const auth = requireAuth(req, res);
  if (!auth) return; // requireAuth already sent error response

  const { wallet } = auth;

  await dbConnect();
  const user = await User.findOne({ wallet });
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.twitter = undefined;
  user.twitterId = undefined;
  user.twitterAccessToken = undefined;
  user.twitterAvatar = undefined;
  await user.save();
  res.status(200).json({ success: true });
}
