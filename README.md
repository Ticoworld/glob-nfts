# Glob NFT Platform

## Overview
Glob is an exclusive, invite-only NFT platform designed for viral growth and community engagement. Users earn points by completing social tasks and inviting others, with a leaderboard to track top contributors.

## Features
- **Invite-only access:** Users join via invite codes. New users receive 2 codes on registration; weekly cron job tops up to 2 active codes per user.
- **Social tasks:** Complete tasks (Discord join, tweet) to earn points.
- **Leaderboard:** Track top users and whitelist/FCFS status.
- **Admin controls:** (Optional) Manage invites and view stats.

## Getting Started
1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd glob-nfts
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.local.example` to `.env.local` and fill in your secrets:
     - `MONGODB_URI`
     - `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`, `DISCORD_GUILD_ID`, `DISCORD_BOT_TOKEN`
     - Any other required secrets
4. **Run locally:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

## API Endpoints
- `/api/validate-invite` — Register with invite code
- `/api/my-invites` — Get user's invite codes
- `/api/weekly-invite-generation` — Cron job to top up invites
- `/api/discord/callback` — Discord join verification
- `/api/leaderboard` — Get leaderboard data

## Notes
- Twitter follow verification is deferred due to API limitations.
- Discord join awards points if user is a member of the server.
- Admin panel is optional and can be added post-launch.

## License
MIT
