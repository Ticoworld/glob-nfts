import type { NextApiRequest, NextApiResponse } from 'next';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID; // Your server ID

async function exchangeCodeForToken(code: string) {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID!,
    client_secret: DISCORD_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    code,
    redirect_uri: DISCORD_REDIRECT_URI!,
    scope: 'identify guilds.join guilds.members.read guilds.channels.read',
  });
  const res = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  return res.json();
}

async function getUserInfo(token: string) {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function checkGuildMember(token: string, userId: string) {
  const res = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
  });
  return res.status === 200;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, wallet } = req.query;
  if (!code || !wallet) return res.status(400).send('Missing code or wallet');

  try {
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code as string);
    if (!tokenData.access_token) return res.status(400).send('Failed to get access token');

    // Get user info
    const userInfo = await getUserInfo(tokenData.access_token);
    if (!userInfo.id) return res.status(400).send('Failed to get user info');

    // Check if user is a member of your guild
    const isMember = await checkGuildMember(tokenData.access_token, userInfo.id);
    if (isMember) {
        // Link Discord ID to wallet and award points
        const dbConnect = (await import('@/utils/dbConnect')).default;
        await dbConnect();
        const User = (await import('@/models/User')).default;
        let user = await User.findOne({ wallet });
        if (!user) {
          user = await User.create({ wallet, points: 5, discord: userInfo.id });
        } else {
          user.discord = userInfo.id;
          user.points = (user.points || 0) + 5;
          await user.save();
        }
        return res.status(200).send('Discord join verified! Points awarded.');
    } else {
      return res.status(403).send('You must join the Discord server to earn points.');
    }
  } catch (err) {
    return res.status(500).send('Discord verification failed.');
  }
}
