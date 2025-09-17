import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyMessage, getAddress } from 'ethers';

export const AUTH_WINDOW_SECONDS = 120;

export function getPathFromReq(req: NextApiRequest): string {
  const url = req.url || '';
  const q = url.indexOf('?');
  return q >= 0 ? url.substring(0, q) : url;
}

export function buildAuthMessage(params: { wallet: string; method: string; path: string; timestamp: string | number }): string {
  const { wallet, method, path, timestamp } = params;
  return `Glob Auth
Wallet: ${wallet}
Method: ${String(method).toUpperCase()}
Path: ${path}
Timestamp: ${timestamp}`;
}

function normalizeAddress(addr: string): string | null {
  try {
    return getAddress(addr).toLowerCase();
  } catch {
    return null;
  }
}

function parseTimestampToSeconds(raw: string | string[] | undefined): number | null {
  if (!raw) return null;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v) return null;
  // If numeric string (epoch in sec or ms)
  if (/^\d+$/.test(v)) {
    const n = parseInt(v, 10);
    // ms epoch
    if (n > 1000000000000) return Math.floor(n / 1000);
    // sec epoch (10 digits) or smaller (tests)
    return n;
  }
  // Try ISO/date string
  const ms = Date.parse(v);
  if (!isNaN(ms)) return Math.floor(ms / 1000);
  return null;
}

type VerifyOk = { wallet: string; method: string; path: string; timestamp: number };
type VerifyErr = { error: string; status: number };

export function verifySignedRequest(req: NextApiRequest): VerifyOk | VerifyErr {
  const walletHeader = (req.headers['x-wallet'] as string) || '';
  const timestampHeader = (req.headers['x-timestamp'] as string) || '';
  const signature = (req.headers['x-signature'] as string) || '';

  console.log('[auth] verifySignedRequest headers:', { walletHeader, timestampHeader, signature });

  if (!walletHeader || !timestampHeader || !signature) {
    console.log('[auth] Missing auth headers');
    return { error: 'Missing auth headers', status: 401 };
  }
  const wallet = normalizeAddress(walletHeader);
  if (!wallet) {
    console.log('[auth] Invalid wallet address:', walletHeader);
    return { error: 'Invalid wallet address', status: 400 };
  }
  const method = (req.method || 'GET').toUpperCase();
  const path = getPathFromReq(req);
  const tsSec = parseTimestampToSeconds(timestampHeader);
  if (tsSec === null) {
    console.log('[auth] Invalid timestamp:', timestampHeader);
    return { error: 'Invalid timestamp', status: 400 };
  }
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - tsSec) > AUTH_WINDOW_SECONDS) {
    console.log('[auth] Stale or future timestamp:', tsSec, 'now:', nowSec);
    return { error: 'Stale or future timestamp', status: 401 };
  }
  const msg = buildAuthMessage({ wallet, method, path, timestamp: tsSec });
  console.log('[auth] Message to verify:', msg);
  let recovered: string;
  try {
    recovered = verifyMessage(msg, signature).toLowerCase();
    console.log('[auth] Recovered address:', recovered);
  } catch (err) {
    console.log('[auth] Invalid signature:', err);
    return { error: 'Invalid signature', status: 401 };
  }
  if (recovered !== wallet) {
    console.log('[auth] Signature wallet mismatch:', recovered, wallet);
    return { error: 'Signature wallet mismatch', status: 401 };
  }
  return { wallet, method, path, timestamp: tsSec };
}

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; resetTime: number }>();

function checkAuthRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = authAttempts.get(identifier);
  
  if (!limit || now > limit.resetTime) {
    authAttempts.set(identifier, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 10) { // Max 10 auth attempts per minute
    return false;
  }
  
  limit.count++;
  return true;
}

export function requireAuth(req: NextApiRequest, res: NextApiResponse): { wallet: string } | null {
  // Rate limiting based on IP
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const identifier = Array.isArray(clientIP) ? clientIP[0] : clientIP;
  
  if (!checkAuthRateLimit(identifier)) {
    res.status(429).json({ error: 'Too many authentication attempts. Please try again later.' });
    return null;
  }

  const vr = verifySignedRequest(req);
  if ((vr as VerifyErr).error) {
    const err = vr as VerifyErr;
    res.status(err.status).json({ error: err.error });
    return null;
  }
  const ok = vr as VerifyOk;
  return { wallet: ok.wallet };
}

function adminWallets(): string[] {
  const env = process.env.ADMIN_WALLETS || '';
  return env
    .split(',')
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
}

export function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): { wallet?: string; via: 'token' | 'wallet' } | null {
  const adminTokenEnv = process.env.ADMIN_TOKEN || '';
  const headerToken = (req.headers['x-admin-token'] as string) || '';
  if (adminTokenEnv && headerToken && headerToken === adminTokenEnv) {
    return { via: 'token' };
  }
  const auth = requireAuth(req, res);
  if (!auth) return null;
  const admins = adminWallets();
  if (!admins.includes(auth.wallet.toLowerCase())) {
    res.status(403).json({ error: 'Not authorized' });
    return null;
  }
  return { wallet: auth.wallet, via: 'wallet' };
}