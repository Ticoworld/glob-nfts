import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import InviteCode from '../../models/InviteCode';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  const { rateLimit } = require('../../utils/rateLimit');
  if (!rateLimit(req, res)) return;
  await dbConnect();

  if (req.method === 'POST') {
    let { code, wallet } = req.body;
    if (!code || !wallet) {
      return res.status(400).json({ error: 'Missing code or wallet' });
    }
    wallet = wallet.toLowerCase();
    // Find invite code
    const invite = await InviteCode.findOne({ code: code.trim().toUpperCase(), used: false });
    if (!invite) {
      return res.status(404).json({ error: 'Invalid or used invite code' });
    }
    // Check if user already exists (lowercase, fallback for legacy)
    let existingUser = await User.findOne({ wallet });
    if (!existingUser) {
      existingUser = await User.findOne({ wallet: { $regex: `^${wallet}$`, $options: 'i' } });
    }
    if (existingUser) {
      return res.status(409).json({ error: 'User already registered' });
    }
    // Mark invite as used
    invite.used = true;
    invite.usedBy = wallet;
    await invite.save();
    // Award points to inviter if exists
    let inviterWallet = invite.inviter ? invite.inviter.toLowerCase() : null;
    if (inviterWallet) {
      let inviterUser = await User.findOne({ wallet: inviterWallet });
      if (!inviterUser) {
        inviterUser = await User.findOne({ wallet: { $regex: `^${inviterWallet}$`, $options: 'i' } });
      }
      if (inviterUser) {
        inviterUser.points = (inviterUser.points || 0) + 10; // 10 points per referral
        await inviterUser.save();
      }
    }
    // Create user (store wallet in lowercase)
    const user = await User.create({ wallet, invites: [] });
    // Immediately create 2 invite codes for the new user
    const now = new Date();
    let newInvites = [];
    for (let i = 0; i < 2; i++) {
      const code =
        'GLOB-' +
        Math.random().toString(36).substring(2, 8).toUpperCase() +
        '-' +
        Math.random().toString(36).substring(2, 6).toUpperCase();
      const invite = await InviteCode.create({
        code,
        inviter: wallet,
        used: false,
        createdAt: now,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
      });
      user.invites.push(invite._id);
      newInvites.push(invite);
    }
    await user.save();
    return res.status(200).json({ success: true, user, invites: newInvites });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
