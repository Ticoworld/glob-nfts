'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { wagmiAdapter, projectId } from '../config';
import { appkitNetworks } from '../config/appkitNetwork';

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined - check your NEXT_PUBLIC_PROJECT_ID environment variable');
}

const metadata = {
  name: 'GlobNFTs',
  description: 'GlobNFTs Platform',
  url: 'https://yourdomain.com',
  icons: ['https://yourdomain.com/favicon.ico']
};

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: appkitNetworks,
  defaultNetwork: appkitNetworks[0],
  metadata,
  features: {
    analytics: true
  }
});

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;


