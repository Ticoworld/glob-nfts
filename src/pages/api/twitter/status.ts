import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { wallet } = req.query;
  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ error: 'Missing wallet' });
  }
  await dbConnect();
  const user = await User.findOne({ wallet });
  if (!user) {
    console.error('User not found for wallet:', wallet);
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json({
    twitterConnected: !!user.twitter && !!user.twitterAccessToken,
    twitterHandle: user.twitter || null,
    avatarUrl: user.twitterAvatar || null,
    debug: {
      twitter: user.twitter,
      twitterAccessToken: user.twitterAccessToken,
      twitterId: user.twitterId,
      twitterAvatar: user.twitterAvatar,
    }
  });
}
