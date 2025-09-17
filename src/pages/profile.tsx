
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import InviteDashboard from '../components/InviteDashboard';
import TweetSubmission from '../components/TweetSubmission';
import TwitterConnect from '../components/TwitterConnect';
import Glob2EarnDashboard from '../components/Glob2EarnDashboard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAccount } from 'wagmi';
import { SiweLoginButton } from '../components/SiweLoginButton';
import CustomConnectButton from '../components/CustomConnectButton';

const Profile: React.FC = () => {

  // SIWE login gate: show login button if not authenticated
  // You may want to check for a session cookie/JWT here
  // For demo, always show login button at top

  // TODO: Replace with session check for production
  const [siweLoggedIn, setSiweLoggedIn] = useState(false);

  useEffect(() => {
    // Example: check for SIWE session cookie
    setSiweLoggedIn(document.cookie.includes('sid='));
  }, []);

  if (!siweLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
  <CustomConnectButton />
        <SiweLoginButton />
        <div className="mt-4 text-primary text-lg">Sign in with your wallet to access your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-20 p-3">
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
