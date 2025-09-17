import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import TweetTask from '@/models/TweetTask';
import { requireAuth } from '@/utils/auth';
import { rateLimit } from '@/utils/rateLimit';

// Helper to get start of week (Monday)
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rateLimit(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const auth = requireAuth(req, res);
  if (!auth) return;
  const wallet = auth.wallet;
  await dbConnect();
  const now = new Date();
  const weekStart = new Date(getStartOfWeek(now));
  const count = await TweetTask.countDocuments({
    wallet,
    status: 'verified',
    createdAt: { $gte: weekStart }
  });
  res.status(200).json({ count });
}
