import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import TweetTask from '@/models/TweetTask';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { wallet } = req.query;
  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ error: 'Missing wallet' });
  }
  await dbConnect();
  const tweets = await TweetTask.find({ wallet }).sort({ createdAt: -1 });
  res.status(200).json({ tweets });
}
