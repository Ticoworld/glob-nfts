import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { rateLimit } from '@/utils/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rateLimit(req, res)) return;
  await dbConnect();
  if (req.method === 'GET') {
    let users = await User.find({}, { wallet: 1, points: 1, twitter: 1, discord: 1, createdAt: 1 })
      .sort({ points: -1, createdAt: 1 })
      .limit(100)
      .lean();
    // Ensure all wallets are lowercase for consistency
    users = users.map(u => ({ ...u, wallet: u.wallet?.toLowerCase() }));
    res.status(200).json({ users });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
