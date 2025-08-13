import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface Web3ContextType {
  isConnected: boolean;
  address: string | undefined;
  balance: string | null;
  network: string | null;
  status: ConnectionStatus;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  
  const connect = async () => {
    try {
      setStatus('connecting');
      
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setStatus('connected');
          
          // Get balance
          try {
            const balanceWei = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest']
            });
            const balanceEth = (parseInt(balanceWei, 16) / 1e18).toFixed(4);
            setBalance(balanceEth);
          } catch (balanceError) {
            console.warn('Failed to fetch balance:', balanceError);
          }

          // Get network
          try {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId'
            });
            const networkName = getNetworkName(chainId);
            setNetwork(networkName);
          } catch (networkError) {
            console.warn('Failed to fetch network:', networkError);
          }

          localStorage.setItem('walletConnected', 'true');
        }
      } else {
        setStatus('error');
        console.log('Please install MetaMask!');
      }
    } catch (error) {
      setStatus('error');
      console.error('Connection error:', error);
    }
  };
  
  const disconnect = async () => {
    try {
      setAddress(undefined);
      setIsConnected(false);
      setBalance(null);
      setNetwork(null);
      setStatus('disconnected');
      localStorage.removeItem('walletConnected');
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  const getNetworkName = (chainId: string): string => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum',
      '0x89': 'Polygon',
      '0x38': 'BSC',
      '0xa86a': 'Avalanche',
      '0xa4b1': 'Arbitrum',
      '0x2105': 'Base'
    };
    return networks[chainId] || 'Unknown';
  };

  // Auto-connect on page load
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected && typeof window !== 'undefined' && window.ethereum) {
      connect();
    }
  }, []);

  return (
    <Web3Context.Provider value={{ 
      isConnected, 
      address, 
      balance,
      network,
      status,
      connect, 
      disconnect 
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
