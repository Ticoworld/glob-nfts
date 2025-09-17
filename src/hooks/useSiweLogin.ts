import { useAccount, useSignMessage, useSwitchChain } from 'wagmi';
import { SiweMessage } from 'siwe';

export function useSiweLogin() {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();

  const login = async () => {
    if (!isConnected || !address) throw new Error('Connect wallet first');

    // 0) Ensure we're on Ethereum mainnet (chainId = 1)
    try {
      if (chainId !== 1 && switchChainAsync) {
        await switchChainAsync({ chainId: 1 });
      }
    } catch (switchErr: any) {
      console.warn('[SIWE] Failed to switch network automatically. Please switch to Ethereum mainnet and retry.', switchErr);
      throw new Error('Please switch to Ethereum mainnet in your wallet and try again.');
    }

    // 1) Get nonce from server
    const nonceRes = await fetch('/api/siwe/nonce');
    const { nonce } = await nonceRes.json();

    // 2) Build SIWE message (EIP-4361, using siwe lib)
    const domain = window.location.host;
    const origin = window.location.origin;
    const statement = 'Sign in to GlobNFTs';
    const siwe = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
  chainId: 1,
      nonce,
      issuedAt: new Date().toISOString(),
    });
    const message = siwe.prepareMessage();

    // 3) Sign with the connected account
    const signature = await signMessageAsync({ message });

    // 4) Verify on server
    const vRes = await fetch('/api/siwe/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });
    if (!vRes.ok) {
      const { error } = await vRes.json();
      throw new Error(error || 'SIWE verify failed');
    }
    return true;
  };

  return { login };
}
