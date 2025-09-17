import type { NextApiRequest, NextApiResponse } from 'next';
type RateLimitEntry = { count: number; start: number };
// Simple rate limiting middleware for Next.js API routes
// Usage: import and call rateLimit(req, res) at the top of your handler

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10); // 1 minute
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10); // 10 requests per window

const ipCache = new Map<string, RateLimitEntry>();

export function rateLimit(req: NextApiRequest, res: NextApiResponse): boolean {
  const ipHeader = req.headers['x-forwarded-for'];
  let ip = '';
  if (typeof ipHeader === 'string') {
    ip = ipHeader.split(',')[0];
  } else if (Array.isArray(ipHeader)) {
    ip = ipHeader[0];
  } else if (req.socket?.remoteAddress) {
    ip = req.socket.remoteAddress;
  }
  const now = Date.now();
  let entry = ipCache.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    entry = { count: 1, start: now };
  } else {
    entry.count++;
  }
  ipCache.set(ip, entry);
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }
  return true;
}
