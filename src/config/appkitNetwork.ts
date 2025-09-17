// Local type for AppKit network object
type LocalAppKitNetwork = {
  id: number;
  chainId: string;
  chainNamespace: string;
  chainType: string;
  chainReference: string;
  caipNetworkId: string;
  name: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: { default: { http: string[] } };
  blockExplorers: { default: { name: string; url: string } };
  testnet: boolean;
};

import { mainnet } from 'wagmi/chains';

export const appkitNetworks: [LocalAppKitNetwork] = [{
  id: mainnet.id,
  chainId: `0x${mainnet.id.toString(16)}`,
  chainNamespace: 'eip155',
  chainType: 'evm',
  chainReference: String(mainnet.id),
  caipNetworkId: `eip155:${mainnet.id}`,
  name: mainnet.name,
  nativeCurrency: mainnet.nativeCurrency,
  rpcUrls: { default: { http: [...mainnet.rpcUrls.default.http] as string[] } },
  blockExplorers: { default: { name: mainnet.blockExplorers?.default.name || 'Etherscan', url: mainnet.blockExplorers?.default.url || 'https://etherscan.io' } },
  testnet: false,
}];
