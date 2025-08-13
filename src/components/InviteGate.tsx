

import { useToast } from '../contexts/ToastContext';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import LoadingSpinner from './ui/LoadingSpinner';


const InviteGate: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isConnected, address } = useAccount();
  const { success, error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isConnected || !address) {
      setError('Please connect your wallet first.');
      toastError('Please connect your wallet first.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/validate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, wallet: address }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('glob_invite', code.trim().toUpperCase());
        setError('');
        success('Invite code accepted! Welcome.');
        onSuccess();
      } else {
        setError(data.error || 'Invalid invite code.');
        toastError(data.error || 'Invalid invite code.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      toastError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90">
      <form onSubmit={handleSubmit} className="bg-dark-800 p-8 rounded-xl shadow-xl w-full max-w-sm flex flex-col gap-4 border border-dark-700">
        <h2 className="text-xl font-bold text-center text-primary mb-2">Enter Invite Code</h2>
        <div className="flex flex-col gap-2 items-center">
          <appkit-button />
          {isConnected && address && (
            <div className="text-xs text-gray-400 mt-1">Connected: <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span></div>
          )}
        </div>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          className="px-4 py-3 rounded-lg border border-dark-600 bg-dark-900 text-white focus:outline-none focus:border-primary"
          placeholder="Your invite code"
          autoFocus
          disabled={loading || !isConnected}
        />
        <button type="submit" className="bg-primary text-dark-900 font-semibold rounded-lg px-4 py-3 hover:bg-primary/90 transition-all flex items-center justify-center gap-2" disabled={loading || !isConnected}>
          {loading && <LoadingSpinner size="sm" />}
          {loading ? 'Checking...' : 'Enter'}
        </button>
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      </form>
    </div>
  );
};

export default InviteGate;
