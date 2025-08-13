import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { wallet } = req.body;
  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ error: 'Missing wallet' });
  }
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
