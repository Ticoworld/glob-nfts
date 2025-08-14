// ...removed invalid object literal and export...
// Wagmi/viem chain object
import { defineChain } from 'viem';

export const hyperEVMChain = defineChain({
  id: 999,
  name: 'Hyperliquid EVM',
  nativeCurrency: { name: 'Hyperliquid', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'Hyperliquid Explorer', url: 'https://hyperevmscan.io/' },
  },
  testnet: false,
});

// AppKit CAIP-2 network object
export const hyperEVMNetwork = {
  id: 999,
  chainId: '0x3e7',
  chainNamespace: 'eip155',
  chainType: 'evm',
  chainReference: '999',
  caipNetworkId: 'eip155:999',
  name: 'Hyperliquid EVM',
  nativeCurrency: { name: 'Hyperliquid', symbol: 'HYPE', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.hyperliquid.xyz/evm'] } },
  blockExplorers: { default: { name: 'Hyperliquid Explorer', url: 'https://hyperevmscan.io/' } },
  testnet: false,
};

export const wagmiChains = [hyperEVMChain];
export const appkitNetworks = [hyperEVMNetwork];