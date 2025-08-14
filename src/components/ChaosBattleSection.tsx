import React from 'react';
import Link from 'next/link';

const ChaosBattleSection: React.FC = () => (
  <section id="chaos-battle" className="py-24 bg-dark-800 text-gray-100">
    <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
      <h2 className="text-3xl font-bold mb-6 text-chaos-pink">Join the Chaos Battle</h2>
      <p className="text-lg mb-8">
        Make posts about GlobNFTs, earn points, and climb the leaderboard. Showcase your creativity and compete for top ranks in the community!
      </p>
      <Link href="/profile" passHref legacyBehavior>
        <a className="btn-primary text-lg px-8 py-4 rounded-full shadow-lg">
          Start Globing & Earn Points
        </a>
      </Link>
    </div>
  </section>
);

export default ChaosBattleSection;
