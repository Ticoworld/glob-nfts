import { buildAuthMessage } from './auth';

/**
 * Signs an authentication message for backend verification using window.ethereum.
 * @param wallet Wallet address (string)
 * @param method HTTP method (string)
 * @param path API path (string)
 * @returns Promise<Record<string, string>>
 */
export async function getAuthHeaders(wallet: string, method: string, path: string): Promise<Record<string, string>> {
	if (typeof window === 'undefined' || !(window as any).ethereum) {
		throw new Error('No Ethereum provider available');
	}
	const timestamp = Math.floor(Date.now() / 1000);
	const message = buildAuthMessage({ wallet, method, path, timestamp });
	const signature = await (window as any).ethereum.request({
		method: 'personal_sign',
		params: [message, wallet],
	});
	return {
		'x-wallet': wallet,
		'x-timestamp': String(timestamp),
		'x-signature': signature,
	};
}
