import React from 'react';
import OptimizedImage from './ui/OptimizedImage';

const Gallery: React.FC = () => {
  // Only show the 3 correct Genesis NFTs
  const nfts = [
    { id: 1, image: '/images/nft1.jpg' },
    { id: 2, image: '/images/nft4.jpg' },
    { id: 3, image: '/images/nft5.jpg' }
  ];

  return (
    <section id="gallery" className="py-20 lg:py-32 bg-dark-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl text-display mb-6">
            <span className="text-gradient">Featured</span> Collection
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore creative, community-driven NFTs. Only the Genesis collection is shown below.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map(nft => (
            <div key={nft.id} className="nft-card group overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-700 relative overflow-hidden">
                <OptimizedImage
                  src={nft.image}
                  alt={`Genesis NFT #${nft.id}`}
                  className="group-hover:scale-105 transition-transform duration-300"
                  fallbackSrc="/images/placeholder.jpg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

