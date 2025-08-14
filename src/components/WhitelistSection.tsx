import React, { useRef } from 'react';
import { useAccount } from 'wagmi';

const WhitelistSection: React.FC = () => {
  const { address, isConnected } = useAccount();
  const handleConnect = () => {
    const btn = document.querySelector('appkit-button');
    if (btn) {
      (btn as HTMLElement).click();
    }
  };
  return (
    <section id="whitelist" className="py-24 bg-dark-900 text-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-primary">Join the Whitelist</h2>
        <p className="text-lg mb-8">
          Get early access to exclusive drops and community rewards. Connect your wallet and secure your spot in the chaos!
        </p>
        {isConnected && address ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-green-400 font-semibold text-lg">Wallet Connected!</div>
            <div className="bg-dark-800 px-4 py-2 rounded-lg text-gray-200 text-sm font-mono">
              {address}
            </div>
            <div className="text-primary text-md mt-2">You&apos;re whitelisted for early access.</div>
          </div>
        ) : (
          <button className="btn-secondary text-lg px-8 py-4 rounded-full shadow-lg" onClick={handleConnect}>
            Connect Wallet & Join
          </button>
        )}
      </div>
    </section>
  );
};

export default WhitelistSection;
