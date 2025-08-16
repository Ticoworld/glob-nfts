
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
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
  <title>GlobNFTs | Chaotic Community-Driven NFT Collection</title>
  <meta name="description" content="GlobNFTs is a chaotic, community-driven NFT collection on HyperLiquid. Make posts, earn points, climb the leaderboard, and unlock future utility as a holder." />
  <meta name="keywords" content="NFT, HyperLiquid, Blockchain, Digital Art, Collectibles, Community, Leaderboard, Creativity, Web3" />
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

