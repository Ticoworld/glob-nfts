// wagmi.config.ts
import { http, createConfig } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'

// Setup RainbowKit connectors for Ethereum mainnet
const { connectors } = getDefaultWallets({
  appName: 'GlobNFTs',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
})

// Create wagmi config for Ethereum mainnet only
export const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})