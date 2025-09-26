
import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { ToastProvider } from '../contexts/ToastContext';
import { Web3Provider } from '../contexts/Web3Context';
import ErrorBoundary from '../components/ErrorBoundary';
import SimplePageLoader from '../components/SimplePageLoader';
import ContextProvider from '../context';

import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '../../wagmi.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';




export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Ensure component is mounted on client side
    setMounted(true)
    
    // Simulate initial loading for professional experience
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // 2.5 second minimum loading time

    // Also check if document is ready
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 800)
    }

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
      }
    }

    return () => {
      clearTimeout(timer)
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoad)
      }
    }
  }, [])

  // Lock body scroll while RainbowKit modal is open to avoid scroll-related disappearance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new MutationObserver(() => {
      const modalOpen = !!document.querySelector('.rk-modal__container, .rk-modal');
      document.body.classList.toggle('modal-open', modalOpen);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#FEC7A0',
            accentColorForeground: '#222',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
        >
            <ContextProvider>
              <Web3Provider>
                <ToastProvider>
                  <SimplePageLoader 
                    isLoading={isLoading} 
                    onComplete={() => setIsLoading(false)} 
                  />
                  {!isLoading && <Component {...pageProps} />}
                </ToastProvider>
              </Web3Provider>
            </ContextProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
