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
        <title>GlobNFTs | Chaotic Community-Driven NFT Collection</title>
        <meta
          name="description"
          content="GlobNFTs is a chaotic, community-driven NFT collection on Ethereum. Make posts, earn points, climb the leaderboard, and unlock future utility as a holder."
        />
        <meta
          name="keywords"
          content="NFT, Ethereum, Blockchain, Digital Art, Collectibles, Community, Leaderboard, Creativity, Web3"
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
