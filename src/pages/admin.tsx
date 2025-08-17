
import { useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useRouter } from 'next/router';
import AdminTweetTasks from '@/components/AdminTweetTasks';

const AdminPage: React.FC = () => {
  const { isConnected, address } = useWeb3();
  const router = useRouter();
  // Get admin wallets from env (injected at build time)
  const adminWallets = (process.env.NEXT_PUBLIC_ADMIN_WALLETS || '').split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
  const isAdmin = isConnected && address && adminWallets.includes(address.toLowerCase());

  useEffect(() => {
    if (!isAdmin) {
      // Show a message for 2 seconds before redirecting
      const timer = setTimeout(() => {
        router.replace('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 text-white">
        <div className="p-8 rounded-lg bg-dark-800 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">Admin Access Required</h2>
          <p className="mb-2">You must connect your wallet to access the admin dashboard.</p>
          <p className="text-sm text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <AdminTweetTasks />
    </div>
  );
};

export default AdminPage;
