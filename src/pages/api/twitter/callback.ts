import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const CALLBACK_URL = process.env.TWITTER_CALLBACK_URL;


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;
  if (!code) return res.status(400).send('Missing code');
  let wallet = '';
  if (typeof state === 'string' && state.includes(':')) {
    wallet = state.split(':')[1];
  }
  if (!wallet) {
    console.error('Missing wallet in callback');
    return res.status(400).send('Missing wallet');
  }

  try {
  await dbConnect();
  console.log('Twitter callback for wallet:', wallet);
    // Exchange code for access token
    const tokenRes = await axios.post('https://api.twitter.com/2/oauth2/token', new URLSearchParams({
      code: code as string,
      grant_type: 'authorization_code',
      client_id: CLIENT_ID!,
      redirect_uri: CALLBACK_URL!,
      code_verifier: 'challenge', // For PKCE, use a real verifier in production
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: { username: CLIENT_ID!, password: CLIENT_SECRET! },
    });

  const { access_token } = tokenRes.data;
  if (!access_token) throw new Error('No access token');
  console.log('Got Twitter access token');

    // Get user info (with profile image)
    const userRes = await axios.get('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const twitterHandle = userRes.data.data.username;
    const twitterId = userRes.data.data.id;
    const twitterAvatar = userRes.data.data.profile_image_url;
    console.log('Twitter user:', { twitterHandle, twitterId, twitterAvatar });

    // Store access_token, twitterHandle, twitterId, and avatar in DB for the user
    let updatedUser = await User.findOne({ wallet });
    let awardPoint = false;
    if (updatedUser && !updatedUser.twitterConnectedPointAwarded) {
      awardPoint = true;
    }
    updatedUser = await User.findOneAndUpdate(
      { wallet },
      {
        $set: {
          twitter: twitterHandle,
          twitterId: twitterId,
          twitterAccessToken: access_token,
          twitterAvatar: twitterAvatar,
          ...(awardPoint ? { twitterConnectedPointAwarded: true, points: (updatedUser?.points || 0) + 1 } : {})
        },
      },
      { new: true, upsert: true }
    );
    if (updatedUser) {
      if (awardPoint) {
        console.log('Awarded 1 point for Twitter connection');
      }
      console.log('User updated with Twitter info (findOneAndUpdate)');
    } else {
      console.error('User not found for wallet (findOneAndUpdate):', wallet);
    }

    // Redirect to profile with status
    res.redirect(`/profile?twitter=connected`);
  } catch (err: any) {
    res.redirect(`/profile?twitter=error`);
  }
}
