import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import InviteCode from '@/models/InviteCode';
import User from '@/models/User';
import { requireAuth } from '@/utils/auth';

// Helper to generate a random invite code
function generateCode() {
  return (
    'GLOB-' +
    Math.random().toString(36).substring(2, 8).toUpperCase() +
    '-' +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  const { rateLimit } = require('@/utils/rateLimit');
  if (!rateLimit(req, res)) return;
  await dbConnect();

  if (req.method === 'POST') {
    // Require cryptographic authentication
    const auth = requireAuth(req, res);
    if (!auth) return; // requireAuth already sent error response

    let { wallet } = auth;
    wallet = wallet.toLowerCase();
    // Find user (lowercase, fallback for legacy)
    let user = await User.findOne({ wallet });
    if (!user) {
      user = await User.findOne({ wallet: { $regex: `^${wallet}$`, $options: 'i' } });
    }
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find all invites by this user (lowercase)
    const now = new Date();
    let invites = await InviteCode.find({ inviter: wallet });

  // Calculate status and points earned for each invite
  let invitePoints = 0;
  const inviteList = invites.map(i => {
    let status = 'Active';
    if (i.used) status = 'Used';
    else if (i.expiresAt && i.expiresAt < now) status = 'Expired';
    let pointsEarned = 0;
    if (i.used) pointsEarned = 10; // 10 points per referral (match validate-invite)
    invitePoints += pointsEarned;
    return {
      code: i.code,
      expiresAt: i.expiresAt,
      status,
      pointsEarned,
    };
  });

  // Sort invites: active first, then used, then expired
  const statusOrder = { 'Active': 0, 'Used': 1, 'Expired': 2 };
  const sortedInvites = inviteList.sort((a, b) => {
    return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
  });

  res.status(200).json({ invites: sortedInvites, points: user.points || 0, invitePoints });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
