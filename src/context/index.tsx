
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '../config';

const queryClient = new QueryClient();

function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  );
}

export default ContextProvider;


