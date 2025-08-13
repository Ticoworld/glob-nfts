import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'GET') {
    const { wallet } = req.query;
    if (!wallet || typeof wallet !== 'string') {
      return res.status(400).json({ error: 'Missing wallet' });
    }
    const user = await User.findOne({ wallet });
    if (user) {
      return res.status(200).json({ registered: true });
    } else {
      return res.status(200).json({ registered: false });
    }
  }
  res.status(405).json({ error: 'Method not allowed' });
}
