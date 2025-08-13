import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import InviteCode from '../../models/InviteCode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'POST') {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Missing code' });
    // Check if code exists
    const exists = await InviteCode.findOne({ code });
    if (exists) return res.status(409).json({ error: 'Code already exists' });
    // Create admin invite code
    await InviteCode.create({ code, used: false, inviter: 'admin', createdAt: new Date() });
    res.status(200).json({ success: true, code });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
