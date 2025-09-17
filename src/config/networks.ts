import { mainnet } from 'wagmi/chains';

// For now we only target Ethereum mainnet
export const wagmiChains = [mainnet];
// If an AppKit network list is required elsewhere, mirror Ethereum mainnet
export const appkitNetworks = [
  {
    id: mainnet.id,
    chainId: `0x${mainnet.id.toString(16)}`,
    chainNamespace: 'eip155',
    chainType: 'evm',
    chainReference: String(mainnet.id),
    caipNetworkId: `eip155:${mainnet.id}`,
    name: mainnet.name,
    nativeCurrency: mainnet.nativeCurrency,
    rpcUrls: { default: { http: mainnet.rpcUrls.default.http } },
    blockExplorers: { default: { name: mainnet.blockExplorers?.default.name || 'Etherscan', url: mainnet.blockExplorers?.default.url || 'https://etherscan.io' } },
    testnet: false,
  },
];