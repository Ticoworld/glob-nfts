"use client";

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { SiweLoginButton } from '../components/SiweLoginButton';
import CustomConnectButton from '../components/CustomConnectButton';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ChaosBattleSection from '../components/ChaosBattleSection';
import WhitelistSection from '../components/WhitelistSection';
import Gallery from '../components/Gallery';
import Events from '../components/Events';
import CommunitySection from '../components/CommunitySection';
import Footer from '../components/Footer';
import InviteGate from '../components/InviteGate';
import Leaderboard from '../components/Leaderboard';

const Home: React.FC = () => {

  // SIWE login gate: show login button if not authenticated
  // You may want to check for a session cookie/JWT here
  // For demo, always show login button at top

  // TODO: Replace with session check for production
  const [siweLoggedIn, setSiweLoggedIn] = useState(false);

  useEffect(() => {
    // Example: check for SIWE session cookie
    setSiweLoggedIn(document.cookie.includes('sid='));
  }, []);

  const { address, isConnected } = useAccount();
  const handleLogout = () => {
    document.cookie = 'sid=; Max-Age=0; path=/;';
    window.location.reload();
  };

  // Gate: must have wallet connected and SIWE session cookie
  if (!isConnected || !address || !siweLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-col items-center gap-2 w-full max-w-md">
          <CustomConnectButton />
          {isConnected && address && (
            <div className="w-full bg-dark-800 rounded-lg px-4 py-2 text-center text-primary font-mono text-base break-all border border-dark-700 mt-2">
              {address}
            </div>
          )}
        </div>
        {/* Show SIWE sign-in only if wallet is connected */}
        {isConnected && address && <SiweLoginButton />}
        <div className="mt-4 text-primary text-lg text-center">Sign in with your wallet to continue.</div>
  {/* Invite gate appears AFTER SIWE; InviteGate itself will auto-skip registered users */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>GlobNFTs | Chaotic Community-Driven NFT Collection</title>
  <meta name="description" content="GlobNFTs is a chaotic, community-driven NFT collection on Ethereum. Make posts, earn points, climb the leaderboard, and unlock future utility as a holder." />
  <meta name="keywords" content="NFT, Ethereum, Blockchain, Digital Art, Collectibles, Community, Leaderboard, Creativity, Web3" />
      </Head>
      <Header />
      <main className="flex-grow" role="main">
        <Hero />
        <AboutSection />
        <ChaosBattleSection />
        <WhitelistSection />
        <Leaderboard />
        <Gallery />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

