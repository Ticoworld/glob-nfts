import type { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { parse, serialize } from 'cookie';

const ETHEREUM_CHAIN_ID = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { message, signature } = req.body || {};
  if (!message || !signature) return res.status(400).json({ error: 'Missing params' });

  try {
    const cookies = parse(req.headers.cookie || '');
    const expectedNonce = cookies['siwe_nonce'];
    if (!expectedNonce) return res.status(401).json({ error: 'Missing nonce' });

    const siwe = new SiweMessage(message);
    const { data, success } = await siwe.verify({
      signature,
      domain: req.headers.host,
      nonce: expectedNonce,
    });
    if (!success) return res.status(401).json({ error: 'Invalid SIWE' });

    if (Number(data.chainId) !== ETHEREUM_CHAIN_ID) {
      return res.status(401).json({ error: 'Wrong chain' });
    }

    // Set session cookie (sid) for frontend login detection
    // In production, use a secure session id or JWT
    const sessionId = data.address; // For demo, use address as session id
    res.setHeader('Set-Cookie', [
      serialize('sid', sessionId, {
        httpOnly: false, // frontend needs to read it
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
      serialize('siwe_nonce', '', {
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
      })
    ]);

    return res.status(200).json({ address: data.address });
  } catch (e: any) {
    return res.status(401).json({ error: e?.message || 'Verify failed' });
  }
}
