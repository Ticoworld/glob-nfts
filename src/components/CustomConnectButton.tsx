import React from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit';

const CustomConnectButton: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address, isConnected } = useAccount();

  const baseClass = "px-5 py-2 rounded-xl shadow graffiti-border transition-all flex items-center gap-2";
  const baseStyle = { fontFamily: 'cursive, graffiti, sans-serif', fontSize: '1.1rem', letterSpacing: '0.03em' } as const;

  if (!isConnected) {
    return (
      <button onClick={openConnectModal} className={`bg-orange-200 text-dark-900 font-bold hover:bg-orange-300 ${baseClass}`} style={baseStyle}>
        Connect Wallet
      </button>
    );
  }

  return (
    <button onClick={openAccountModal} className={`bg-dark-800 text-primary font-semibold hover:bg-dark-700 ${baseClass}`} style={baseStyle}>
      <span className="font-mono text-base bg-dark-900 px-3 py-1 rounded-lg">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <span className="ml-1">Manage</span>
    </button>
  );
};

export default CustomConnectButton;
