import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { wagmiChains, appkitNetworks } from './networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Use the correct network format for AppKit
export const networks = appkitNetworks;

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: wagmiChains
});

export const config = wagmiAdapter.wagmiConfig;
export { appkitNetworks, wagmiChains };
