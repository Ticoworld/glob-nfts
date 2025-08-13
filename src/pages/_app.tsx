import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { useState, useEffect } from 'react'
import { ToastProvider } from '../contexts/ToastContext'
import { Web3Provider } from '../contexts/Web3Context'
import ErrorBoundary from '../components/ErrorBoundary'
import SimplePageLoader from '../components/SimplePageLoader'


import ContextProvider from '../context';




export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

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

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <ErrorBoundary>
      <ContextProvider cookies={null}>
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
    </ErrorBoundary>
  )
}
