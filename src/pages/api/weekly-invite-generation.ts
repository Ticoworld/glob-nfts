import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import InviteCode from '../../models/InviteCode';
import User from '../../models/User';

// Set your secret token here
const CRON_SECRET = process.env.CRON_SECRET || 'your-very-secret-token';

function generateCode() {
  return (
    'GLOB-' +
    Math.random().toString(36).substring(2, 8).toUpperCase() +
    '-' +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Allow GET and POST, require secret from body or query
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const secret = req.body?.secret || req.query?.secret;
  if (secret !== CRON_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const now = new Date();
  const users = await User.find({});
  let totalCreated = 0;
  for (const user of users) {
    const wallet = user.wallet;
    // Find active invites (not used, not expired)
    let invites = await InviteCode.find({ inviter: wallet, used: false, $or: [ { expiresAt: null }, { expiresAt: { $gt: now } } ] });
    // Strictly enforce max 2 active codes
    if (invites.length < 2) {
      const needed = 2 - invites.length;
      for (let i = 0; i < needed; i++) {
        // Always re-check actual count before creating
        const currentCount = await InviteCode.countDocuments({ inviter: wallet, used: false, $or: [ { expiresAt: null }, { expiresAt: { $gt: now } } ] });
        if (currentCount >= 2) break;
        const code = generateCode();
        const invite = await InviteCode.create({ code, inviter: wallet, used: false, createdAt: now, expiresAt: new Date(now.getTime() + 7*24*60*60*1000) });
        user.invites.push(invite._id);
        totalCreated++;
      }
      if (needed > 0) await user.save();
    }
    // If more than 2 active codes (shouldn't happen), do not create more
  }
  res.status(200).json({ message: `Weekly invite generation complete. Created ${totalCreated} new invites.` });
}
