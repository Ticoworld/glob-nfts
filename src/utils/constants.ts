// App constants
export const SITE_CONFIG = {
  name: 'GlobNFTs',
  description: 'Where chaos meets creativity on the HyperLiquid chain',
  url: 'https://globnfts.com',
  twitter: '@TheGlobNfts',
};

export const NAVIGATION_ITEMS = [
  { name: 'Gallery', href: '#gallery' },
  { name: 'Events', href: '#events' },
  { name: 'Community', href: '#community' },
];

export const SOCIAL_LINKS = {
  discord: '#',
  twitter: '#',
  github: '#',
  medium: '#',
};

export const NFT_CATEGORIES = [
  'all',
  'chaos',
  'hyper',
  'globbers',
  'exclusive',
];

export const RARITY_LEVELS = {
  COMMON: 'Common',
  RARE: 'Rare', 
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
} as const;

export const COLORS = {
  primary: '#FEC7A0',
  chaos: {
    pink: '#FF6BBD',
    blue: '#6BCEFF', 
    purple: '#B36BFF',
  },
  dark: {
    900: '#0A0A0A',
    800: '#121212',
    700: '#1A1A1A',
  },
};
