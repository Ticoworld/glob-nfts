import React from 'react';

const AboutSection: React.FC = () => (
  <section id="about" className="py-24 bg-dark-900 text-gray-100">
    <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-primary">About GlobNFTs</h2>
      <p className="text-lg mb-6">
        GlobNFTs is a chaotic, community-driven NFT collection built for creative engagement. Our vision is to reward participation, foster fun competition, and build a vibrant digital art community.
      </p>
      <h3 className="text-xl font-semibold mb-2 text-chaos-pink">Roadmap & Utility</h3>
      <ul className="list-disc pl-6 mb-6">
        <li>Phase 1: Launch the core collection and leaderboard system.</li>
        <li>Phase 2: Introduce bonus points and utility for NFT holders.</li>
        <li>Phase 3: Expand community features and creative competitions.</li>
      </ul>
      <p className="text-md text-gray-300">
        Holders will unlock future benefits, including multiplied points for engagement and exclusive access to new features. Join us as we redefine NFT community participation!
      </p>
    </div>
  </section>
);

export default AboutSection;
