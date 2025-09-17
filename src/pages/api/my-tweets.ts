import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import TweetTask from '@/models/TweetTask';
import { requireAuth } from '@/utils/auth';
import { rateLimit } from '@/utils/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rateLimit(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const auth = requireAuth(req, res);
  if (!auth) return;
  const wallet = auth.wallet;
  await dbConnect();
  const tweets = await TweetTask.find({ wallet }).sort({ createdAt: -1 });
  res.status(200).json({ tweets });
}
