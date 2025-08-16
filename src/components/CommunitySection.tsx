import React from 'react';

const CommunitySection: React.FC = () => {
  return (
    <section id="community" className="py-20 bg-dark-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join the <span className="text-primary">Community</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect with collectors, creators, and enthusiasts in our real, growing community. No inflated stats—just genuine people and creative energy.
          </p>
        </div>
        <div className="flex flex-col items-center gap-8">
          <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
            <span>Join us on Discord</span>
          </a>
          <a href="https://twitter.com/TheGlobNfts" target="_blank" rel="noopener noreferrer" className="btn-secondary px-8 py-4 text-lg flex items-center gap-2">
            <span>Follow us on Twitter</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;