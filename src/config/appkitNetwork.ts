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

export const hyperEVMNetwork: LocalAppKitNetwork = {
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

export const appkitNetworks: [LocalAppKitNetwork] = [hyperEVMNetwork];
