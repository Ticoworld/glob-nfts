// Starts Twitter OAuth flow (placeholder)
import type { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CALLBACK_URL = process.env.TWITTER_CALLBACK_URL;
const SCOPE = 'tweet.read users.read follows.read offline.access';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { wallet } = req.query;
  if (!CLIENT_ID || !CALLBACK_URL) {
    return res.status(500).json({ error: 'Twitter OAuth not configured' });
  }
  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ error: 'Missing wallet' });
  }
  const state = `glob2earn:${wallet}`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    scope: SCOPE,
    state,
    code_challenge: 'challenge', // For PKCE, use a real challenge in production
    code_challenge_method: 'plain',
  });
  const url = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  res.status(200).json({ url });
}
