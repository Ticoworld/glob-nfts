import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'GET') {
    const users = await User.find({}, { wallet: 1, points: 1, twitter: 1, discord: 1, createdAt: 1 })
      .sort({ points: -1, createdAt: 1 })
      .limit(100)
      .lean();
    res.status(200).json({ users });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
