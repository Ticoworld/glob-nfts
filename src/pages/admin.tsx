
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
    // If not connected or not admin, redirect to home
    if (!isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <AdminTweetTasks />
    </div>
  );
};

export default AdminPage;
