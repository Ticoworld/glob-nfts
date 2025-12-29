"use client";

import React from "react";

import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ChaosBattleSection from "../components/ChaosBattleSection";
import WhitelistSection from "../components/WhitelistSection";
import Gallery from "../components/Gallery";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";
import Leaderboard from "../components/Leaderboard";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>
          GlobNFTs | Gamified Community-Driven NFT Platform on Ethereum
        </title>
        <meta
          name="description"
          content="GlobNFTs is a gamified, invite-only NFT community platform on Ethereum. Earn points through social engagement, climb the leaderboard, unlock whitelist access, and join creative chaos battles. Built with Next.js, RainbowKit, MongoDB, and Discord integration."
        />
        <meta
          name="keywords"
          content="gamified NFT platform, invite-only NFT, NFT leaderboard, earn points NFT, community NFT Ethereum, chaos NFT collection, Web3 gamification, NFT whitelist, Discord NFT community, RainbowKit wallet integration"
        />
        <meta
          property="og:title"
          content="GlobNFTs | Gamified NFT Community Platform"
        />
        <meta
          property="og:description"
          content="Invite-only NFT platform with points, leaderboards, and social engagement rewards on Ethereum."
        />
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
