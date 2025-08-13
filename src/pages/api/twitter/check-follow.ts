import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

const GLOB_NFTS_USER_ID = process.env.GLOB_NFTS_USER_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: 'Missing wallet' });

  await dbConnect();
  const user = await User.findOne({ wallet });
  if (!user || !user.twitterAccessToken || !user.twitterId) {
    return res.status(400).json({ error: 'Twitter not connected' });
  }

  if (!GLOB_NFTS_USER_ID) {
    return res.status(500).json({ error: 'GLOB_NFTS_USER_ID not set in environment' });
  }

  try {
    // Check if user follows @TheGlobNfts
    const followRes = await axios.get(`https://api.twitter.com/2/users/${user.twitterId}/following`, {
      headers: { Authorization: `Bearer ${user.twitterAccessToken}` },
      params: { max_results: 1000 },
    });
    // Debug output
    console.log('Twitter API response:', JSON.stringify(followRes.data, null, 2));
    if (Array.isArray(followRes.data.data)) {
      const ids = followRes.data.data.map((u: any) => u.id);
      console.log('User follows these IDs:', ids);
      console.log('Checking for GLOB_NFTS_USER_ID:', GLOB_NFTS_USER_ID);
      const follows = ids.includes(GLOB_NFTS_USER_ID);
      res.status(200).json({ follows });
    } else {
      console.log('No following data found for user.');
      res.status(200).json({ follows: false, debug: followRes.data });
    }
  } catch (err: any) {
    console.error('Twitter API error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message || 'Twitter API error', debug: err.response?.data });
  }
}
