# GlobNFTs - Gamified NFT Community Platform

🔗 **Live Demo**: [https://glob-nfts.vercel.app](https://glob-nfts.vercel.app)

## 📋 Project Overview

**GlobNFTs** is a full-stack Web3 application built for a gamified, invite-only NFT community platform on Ethereum. The platform incentivizes user engagement through a points-based leaderboard system, social task completion, and exclusive invite code mechanics.

> **Project Type**: Client Project (Freelance)  
> **Role**: Full Stack Developer  
> **Status**: Completed & Deployed

---

## 🚀 Key Features Implemented

### 1. **Invite-Only Access System**

- Secure invite code generation and validation
- Each user receives 2 invite codes upon registration
- Weekly cron job to replenish invite codes automatically
- Referral tracking and points attribution

### 2. **Gamified Points & Leaderboard System**

- Real-time leaderboard with user rankings
- Points earned through social engagement (Discord joins, tweet tasks)
- Whitelist/FCFS status tracking based on leaderboard position
- Admin-controllable point multipliers for NFT holders

### 3. **Web3 Wallet Integration**

- RainbowKit + Wagmi integration for seamless wallet connection
- Multi-wallet support (MetaMask, WalletConnect, Coinbase, etc.)
- SIWE (Sign-In with Ethereum) authentication
- Secure session management with HTTP-only cookies

### 4. **Social Task Verification**

- Discord OAuth integration with server membership verification
- Twitter/X task completion tracking (tweet verification)
- Automated point rewards upon task completion

### 5. **Admin Dashboard**

- User management and statistics
- Invite code oversight
- Leaderboard manipulation controls
- Task management system

---

## 🛠️ Tech Stack

| Category           | Technologies                                                  |
| ------------------ | ------------------------------------------------------------- |
| **Frontend**       | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion |
| **Backend**        | Next.js API Routes, Node.js                                   |
| **Database**       | MongoDB with Mongoose ODM                                     |
| **Web3**           | Wagmi v2, Viem, RainbowKit, Ethers.js, SIWE                   |
| **Authentication** | SIWE (Sign-In with Ethereum), Discord OAuth, JWT              |
| **Styling**        | Tailwind CSS, Custom CSS, Responsive Design                   |
| **Animation**      | Framer Motion                                                 |
| **Deployment**     | Vercel                                                        |

---

## 🏗️ Architecture Highlights

### Security Implementation

- Rate limiting on API endpoints to prevent abuse
- Input validation with Zod schemas
- Secure session handling with HTTP-only cookies
- Wallet address normalization (case-insensitive matching)
- Protection against duplicate account creation

### Database Design

- User model with wallet address as primary identifier
- Invite code tracking with usage limits and expiry
- Task completion records with timestamps
- Leaderboard caching for performance

### API Endpoints

```
POST /api/validate-invite     - Register with invite code
GET  /api/my-invites          - Retrieve user's invite codes
POST /api/weekly-invite-generation - Cron: replenish invites
GET  /api/discord/callback    - Discord OAuth verification
GET  /api/leaderboard         - Fetch leaderboard data
POST /api/verify-tweet        - Verify tweet task completion
GET  /api/user-stats          - Get authenticated user stats
```

---

## 📸 Features Showcase

- **Hero Section**: Dynamic NFT showcase with animated gradients
- **Chaos Battle Section**: Gamified engagement mechanics
- **Gallery**: NFT collection display with hover effects
- **Leaderboard**: Real-time ranking with pagination
- **Whitelist Section**: Status tracking and progress indicators

---

## 🧩 Challenges Solved

1. **Wallet Duplicate Detection**: Implemented case-insensitive wallet matching to prevent duplicate registrations with different capitalization
2. **Rate Limiting**: Built custom rate limiter to prevent API abuse without external dependencies
3. **Discord Bot Integration**: Automated server membership verification for point rewards
4. **Session Persistence**: Solved wallet connection persistence across page reloads with proper hydration handling

---

## 📦 Project Structure

```
glob-nfts/
├── src/
│   ├── components/     # React components (Hero, Gallery, Leaderboard, etc.)
│   ├── contexts/       # React contexts (Web3, Toast notifications)
│   ├── pages/          # Next.js pages and API routes
│   │   └── api/        # Backend API endpoints
│   ├── styles/         # Global CSS and Tailwind config
│   └── utils/          # Helper functions, auth, rate limiting
├── public/             # Static assets (images, favicon)
└── wagmi.config.ts     # Wagmi Web3 configuration
```

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Fill in: MONGODB_URI, DISCORD_* secrets, etc.

# Start development server
npm run dev
```

---

## 📄 License

MIT

---

## 👤 Developer Notes

This project demonstrates proficiency in:

- Full-stack Web3 development with Next.js
- Ethereum wallet integration (RainbowKit, Wagmi, SIWE)
- MongoDB database design and Mongoose ODM
- OAuth integration (Discord)
- Gamification mechanics (points, leaderboards, invite systems)
- Responsive UI with Tailwind CSS and Framer Motion
- API security (rate limiting, input validation, session management)
