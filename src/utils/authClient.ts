import { getAddress } from 'ethers';
/**
 * Client-side auth helper to produce signed headers for protected API routes.
 * It mirrors the server-side message format in src/utils/auth.ts
 */

export function buildAuthMessage(params: { wallet: string; method: string; path: string; timestamp: number }): string {
  const { wallet, method, path, timestamp } = params;
  return `Glob Auth
Wallet: ${wallet}
Method: ${String(method).toUpperCase()}
Path: ${path}
Timestamp: ${timestamp}`;
}

/**
 * Returns headers: x-wallet, x-timestamp, x-signature
 * Uses window.ethereum personal_sign to sign the canonical message.
 *
 * method: HTTP method, e.g., 'GET' | 'POST'
 * path: exact API path as used in fetch, e.g., '/api/validate-invite'
 */
export async function getAuthHeaders(wallet: string, method: string, path: string): Promise<Record<string, string>> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No Ethereum provider available');
  }
  // Get the active wallet from MetaMask (or wagmi/reown)
  let activeWallet = wallet;
  if ((window as any).ethereum.selectedAddress) {
    activeWallet = (window as any).ethereum.selectedAddress;
  }
  // Normalize both addresses
  let normalizedWallet, normalizedActiveWallet;
  try {
    normalizedWallet = getAddress(wallet);
    normalizedActiveWallet = getAddress(activeWallet);
  } catch (err) {
    console.error('[authClient] Invalid wallet address:', wallet, activeWallet);
    throw new Error('Invalid wallet address');
  }
  // Debug log
  console.log('[authClient] Wallet from wagmi/reown:', wallet);
  console.log('[authClient] Wallet from MetaMask:', activeWallet);
  console.log('[authClient] Normalized wallet:', normalizedWallet);
  console.log('[authClient] Normalized activeWallet:', normalizedActiveWallet);
  // Use normalizedActiveWallet for both signing and headers
  const timestamp = Math.floor(Date.now() / 1000); // epoch seconds
  const message = buildAuthMessage({ wallet: normalizedActiveWallet, method, path, timestamp });
  const signature = await (window as any).ethereum.request({
    method: 'personal_sign',
    params: [message, normalizedActiveWallet],
  });
  return {
    'x-wallet': normalizedActiveWallet,
    'x-timestamp': String(timestamp),
    'x-signature': signature,
  };
}

/**
 * Convenience wrapper around fetch that injects signed auth headers.
 * - inputPath must be a string path like '/api/my-invites'
 */
export async function fetchWithAuth(
  wallet: string,
  inputPath: string,
  init?: RequestInit
): Promise<Response> {
  const method = (init?.method || 'GET').toUpperCase();
  const authHeaders = await getAuthHeaders(wallet, method, inputPath);

  const mergedHeaders: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
    ...authHeaders,
  };

  return fetch(inputPath, {
    ...init,
    headers: mergedHeaders,
  });
}
