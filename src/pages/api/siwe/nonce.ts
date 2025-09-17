import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const nonce = randomBytes(16).toString('hex');
  // store nonce in httpOnly cookie (or your session store)
  res.setHeader('Set-Cookie', serialize('siwe_nonce', nonce, {
    httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production'
  }));
  res.status(200).json({ nonce });
}
