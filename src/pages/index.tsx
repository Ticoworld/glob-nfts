
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import Events from '../components/Events';
import CommunitySection from '../components/CommunitySection';
import Footer from '../components/Footer';
import InviteGate from '../components/InviteGate';
import Leaderboard from '../components/Leaderboard';

const Home: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!isConnected || !address) {
        setAllowed(false);
        setChecking(false);
        return;
      }
      // Always check DB for registration before using localStorage
      const localKey = `glob_registered_${address}`;
      setChecking(true);
      try {
        const res = await fetch(`/api/check-user?wallet=${address}`);
        const data = await res.json();
        if (res.ok && data.registered) {
          setAllowed(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem(localKey, 'true');
          }
        } else {
          setAllowed(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(localKey);
          }
        }
      } catch {
        setAllowed(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(localKey);
        }
      } finally {
        setChecking(false);
      }
    };
    checkRegistration();
  }, [isConnected, address]);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-primary text-xl">Checking access...</div>;
  }

  if (!allowed) {
    return <InviteGate onSuccess={() => {
      setAllowed(true);
      if (typeof window !== 'undefined' && address) {
        localStorage.setItem(`glob_registered_${address}`, 'true');
      }
    }} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>GlobNFTs | World-Class NFT Marketplace on HyperLiquid</title>
        <meta name="description" content="Discover, collect, and trade unique NFTs on the HyperLiquid blockchain. Professional NFT marketplace featuring exclusive digital art, advanced trading tools, and vibrant community." />
        <meta name="keywords" content="NFT, HyperLiquid, Blockchain, NFT Marketplace, Digital Art, Collectibles, Crypto Art, Web3, DeFi, Trading" />
      </Head>
      <Header />
      <main className="flex-grow" role="main">
        <Hero />
        <Gallery />
        <Events />
        <CommunitySection />
        <Leaderboard />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

