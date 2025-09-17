import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { requireAuth } from '@/utils/auth';
import { rateLimit } from '@/utils/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rateLimit(req, res)) return;
  await dbConnect();
  if (req.method === 'GET') {
    console.log('[check-user] Headers:', req.headers);
    const auth = requireAuth(req, res);
    if (!auth) {
      console.log('[check-user] Auth failed');
      return;
    }
    const wallet = auth.wallet.toLowerCase();
    console.log('[check-user] Authenticated wallet:', wallet);
    // Query for wallet in lowercase
    const user = await User.findOne({ wallet });
    console.log('[check-user] User lookup result:', user);
    if (user) {
      return res.status(200).json({ registered: true });
    } else {
      // Try fallback: case-insensitive search (for legacy data)
      const userFallback = await User.findOne({ wallet: { $regex: `^${auth.wallet}$`, $options: 'i' } });
      console.log('[check-user] Fallback user lookup result:', userFallback);
      if (userFallback) {
        return res.status(200).json({ registered: true });
      }
      return res.status(200).json({ registered: false });
    }
  }
  res.status(405).json({ error: 'Method not allowed' });
}
