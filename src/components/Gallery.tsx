import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiGrid, FiList, FiEye, FiShare2, FiFilter, FiSearch } from 'react-icons/fi';
import SearchBar from './ui/SearchBar';
import OptimizedImage from './ui/OptimizedImage';
import { NFTCardSkeleton } from './ui/SkeletonLoaders';
import { useToast } from '../contexts/ToastContext';

const Gallery: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'popularity'>('name');
  const [isLoading, setIsLoading] = useState(false);
  const { success, info } = useToast();
  
  const categories = [
    { value: 'all', label: 'All Items', count: 12 },
    { value: 'genesis', label: 'Genesis', count: 3 },
    { value: 'legendary', label: 'Legendary', count: 3 },
    { value: 'rare', label: 'Rare', count: 3 },
    { value: 'digital-art', label: 'Digital Art', count: 3 }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Recently Added' },
    { value: 'popularity', label: 'Popularity' }
  ];
  
  // Professional NFT data - fixed values to prevent hydration errors
  const nfts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Genesis Collection #${String(i + 1).padStart(4, '0')}`,
    category: ['genesis', 'legendary', 'rare', 'digital-art'][i % 4],
    likes: 50 + (i * 15),
    views: 200 + (i * 87),
    rarity: ['Common', 'Rare', 'Epic', 'Legendary'][i % 4],
    creator: `Creator${String(i + 1).padStart(2, '0')}`,
    added: `Aug ${(i % 30) + 1}`
  }));
  
  // Enhanced filtering and search with useMemo for performance
  const filteredAndSortedNfts = useMemo(() => {
    let filtered = nfts;

    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(nft => nft.category === activeCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(query) ||
        nft.creator.toLowerCase().includes(query) ||
        nft.category.toLowerCase().includes(query) ||
        nft.rarity.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.likes + b.views) - (a.likes + a.views);
        case 'date':
          return b.id - a.id;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [nfts, activeCategory, searchQuery, sortBy]);

  const handleLike = (nftId: number) => {
    success(`Added NFT #${nftId} to favorites!`);
  };

  const handleShare = (nftId: number) => {
    navigator.clipboard.writeText(`${window.location.origin}#nft-${nftId}`);
    info('NFT link copied to clipboard!');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      case 'Rare': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'Epic': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'Legendary': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };
  
  return (
    <section id="gallery" className="py-20 lg:py-32 bg-dark-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl text-display mb-6"
          >
            <span className="text-gradient">Featured</span> Collection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Explore creative, community-driven NFTs. Discover unique digital art, meet the creators, and see what’s trending in the chaos!
          </motion.p>
        </div>
        
        {/* Enhanced Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="max-w-md mx-auto lg:mx-0">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search NFTs by name, creator, or rarity..."
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400" size={18} />
                <span className="text-gray-400 font-medium">Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setActiveCategory(category.value)}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 text-sm sm:text-base ${
                      activeCategory === category.value
                        ? 'bg-primary text-dark-900'
                        : 'bg-dark-700 hover:bg-dark-600 text-gray-300 border border-dark-600'
                    }`}
                  >
                    <span className="whitespace-nowrap">{category.label}</span>
                      <span className="text-xs opacity-75 bg-black/20 px-1.5 py-0.5 rounded">
                        {activeCategory === category.value ? filteredAndSortedNfts.length : category.count}
                      </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'popularity')}
                  className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-medium text-sm whitespace-nowrap">
                  {filteredAndSortedNfts.length} {filteredAndSortedNfts.length === 1 ? 'item' : 'items'}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setView('grid')}
                    className={`p-2 sm:p-3 rounded-lg transition-all ${
                      view === 'grid' 
                        ? 'bg-primary text-dark-900' 
                        : 'bg-dark-700 hover:bg-dark-600 border border-dark-600'
                    }`}
                    aria-label="Grid view"
                  >
                    <FiGrid size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button 
                    onClick={() => setView('list')}
                    className={`p-2 sm:p-3 rounded-lg transition-all ${
                      view === 'list' 
                        ? 'bg-primary text-dark-900' 
                        : 'bg-dark-700 hover:bg-dark-600 border border-dark-600'
                    }`}
                    aria-label="List view"
                  >
                    <FiList size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Grid View */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading 
              ? Array.from({ length: 8 }, (_, i) => <NFTCardSkeleton key={i} />)
              : filteredAndSortedNfts.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="nft-card group overflow-hidden"
                  id={`nft-${nft.id}`}
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-700 relative overflow-hidden">
                    {/* Use OptimizedImage with lazy loading */}
                    <OptimizedImage
                      src={`/images/nft${(nft.id % 5) + 1}.jpg`}
                      alt={nft.name}
                      className="group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc="/images/placeholder.jpg"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chaos-pink/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    {/* Rarity Badge */}
                    <div className={`absolute top-4 left-4 px-2 py-1 rounded-lg text-xs font-medium border ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity}
                    </div>
                    {/* Community hover actions */}
                    <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                      <button 
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                        aria-label="View NFT details"
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        onClick={() => handleLike(nft.id)}
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                        aria-label="Add to favorites"
                      >
                        <FiHeart size={18} />
                      </button>
                      <button 
                        onClick={() => handleShare(nft.id)}
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                        aria-label="Share NFT"
                      >
                        <FiShare2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{nft.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>by {nft.creator}</span>
                      <span className="capitalize">{nft.category}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <FiHeart size={14} />
                          <span>{nft.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <FiEye size={14} />
                          <span>{nft.views}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Added: {nft.added}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 6 }, (_, i) => <NFTCardSkeleton key={i} />)
              : filteredAndSortedNfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                className="nft-card p-4 sm:p-6 group"
              >
                {/* Desktop Layout */}
                <div className="hidden lg:flex gap-6 items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex-shrink-0 relative overflow-hidden">
                    <OptimizedImage
                      src={`/images/nft${(nft.id % 5) + 1}.jpg`}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      lazy={false}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{nft.name}</h3>
                    <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                      <span>by {nft.creator}</span>
                      <span className="capitalize">{nft.category}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getRarityColor(nft.rarity)}`}>
                        {nft.rarity}
                      </span>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <FiHeart size={16} />
                        <span>{nft.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <FiEye size={16} />
                        <span>{nft.views}</span>
                      </div>
                      <span className="text-xs text-gray-400">Added: {nft.added}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleShare(nft.id)}
                        className="p-2 hover:text-primary transition-colors"
                        aria-label="Share NFT"
                      >
                        <FiShare2 size={16} />
                      </button>
                      <button className="btn-primary px-6 py-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden">
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex-shrink-0 relative overflow-hidden">
                      <OptimizedImage
                        src={`/images/nft${(nft.id % 5) + 1}.jpg`}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        lazy={false}
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-lg sm:text-xl mb-1 group-hover:text-primary transition-colors truncate">{nft.name}</h3>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-400 mb-2">
                        <span>by {nft.creator}</span>
                        <span className="capitalize">{nft.category}</span>
                      </div>
                      <div className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getRarityColor(nft.rarity)}`}>
                        {nft.rarity}
                      </div>
                    </div>
                  </div>
                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FiHeart size={14} />
                        <span className="text-sm">{nft.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiEye size={14} />
                        <span className="text-sm">{nft.views}</span>
                      </div>
                      <span className="text-xs text-gray-400">Added: {nft.added}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleShare(nft.id)}
                        className="p-2 hover:text-primary transition-colors"
                        aria-label="Share NFT"
                      >
                        <FiShare2 size={16} />
                      </button>
                      <button className="btn-primary px-4 py-2 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
            }
          </div>
        )}
        
        {/* No Results State */}
        {!isLoading && filteredAndSortedNfts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="text-gray-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">No NFTs Found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                : 'No NFTs match your current filters. Try selecting a different category.'
              }
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
        
        {/* Load More */}
        {!isLoading && filteredAndSortedNfts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button className="btn-secondary px-8 py-4">
              Load More Items
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
