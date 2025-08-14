
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import InviteDashboard from '../components/InviteDashboard';
import TweetSubmission from '../components/TweetSubmission';
import TwitterConnect from '../components/TwitterConnect';
import Glob2EarnDashboard from '../components/Glob2EarnDashboard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

const Profile: React.FC = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!isConnected || !address) {
        setAllowed(false);
        setChecking(false);
        return;
      }
      try {
        const res = await fetch(`/api/check-user?wallet=${address}`);
        const data = await res.json();
        if (res.ok && data.registered) {
          setAllowed(true);
        } else {
          setAllowed(false);
          router.replace('/');
        }
      } catch {
        setAllowed(false);
        router.replace('/');
      } finally {
        setChecking(false);
      }
    };
    checkRegistration();
  }, [isConnected, address, router]);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-primary text-xl">Checking access...</div>;
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Back to Home button under logo & sticky */}
      <div className="sticky md:left-20 left-10 top-24 z-30 self-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base sm:text-lg text-primary font-semibold rounded-lg px-4 py-2 bg-dark-800/70 shadow-sm transition-colors duration-200 hover:bg-chaos-pink/20 hover:text-chaos-pink focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ boxShadow: 'none' }}
          title="Back to Home"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

  <Glob2EarnDashboard />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center w-full">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 justify-center my-20 md:mt-20 lg:mt-24">
              <InviteDashboard />
              <TwitterConnect />
              <TweetSubmission />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
