import React from 'react';
import { useSiweLogin } from '../hooks/useSiweLogin';
import { useToast } from '../contexts/ToastContext';
import { useAccount } from 'wagmi';

export function SiweLoginButton() {
  const { login } = useSiweLogin();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { isConnected } = useAccount();
  const { success, error: toastError } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
      success('Successfully signed in!');
      window.location.reload();
    } catch (e: any) {
      setError(e.message);
      toastError(e.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogin}
        disabled={loading || !isConnected}
        style={{
          backgroundColor: '#FEC7A0',
          color: '#222',
          borderRadius: '8px',
          padding: '0.75rem 2rem',
          fontWeight: 600,
          fontSize: '1rem',
          border: 'none',
          boxShadow: loading ? '0 0 0 2px #FEC7A0' : '0 2px 8px rgba(0,0,0,0.08)',
          opacity: loading || !isConnected ? 0.6 : 1,
          cursor: loading || !isConnected ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
  {loading ? 'Signing in...' : 'Sign-In with Ethereum'}
      </button>
      {!isConnected && <div style={{ color: '#F87171', marginTop: '0.5rem' }}>Connect wallet first</div>}
      {error && <div style={{ color: '#F87171', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
}
