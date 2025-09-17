// Script to find and optionally merge duplicate wallet addresses in User collection
// Usage: node find_and_merge_wallet_duplicates.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/globnfts';

const userSchema = new mongoose.Schema({
  wallet: String,
  twitter: String,
  twitterId: String,
  twitterAccessToken: String,
  twitterAvatar: String,
  discord: String,
  points: Number,
  invites: Array,
  twitterConnectedPointAwarded: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);

async function findAndMergeDuplicates() {
  await mongoose.connect(MONGODB_URI);
  const users = await User.find({});
  const walletGroups = {};

  // Group users by lowercase wallet
  for (const user of users) {
    const lowerWallet = user.wallet.toLowerCase();
    if (!walletGroups[lowerWallet]) walletGroups[lowerWallet] = [];
    walletGroups[lowerWallet].push(user);
  }

  let totalDuplicates = 0;
  for (const [wallet, group] of Object.entries(walletGroups)) {
    if (group.length > 1) {
      totalDuplicates++;
      console.log(`Duplicate wallet: ${wallet}`);
      group.forEach(u => {
        console.log(`  User: ${u._id}, wallet: ${u.wallet}, points: ${u.points}, createdAt: ${u.createdAt}`);
      });
      // Optional: Merge logic (uncomment to enable)
      /*
      // Keep the user with the most points (or earliest createdAt)
      const keep = group.reduce((a, b) => (a.points > b.points ? a : b));
      for (const u of group) {
        if (u._id.toString() !== keep._id.toString()) {
          // Merge points/invites if needed
          keep.points += u.points;
          keep.invites = Array.from(new Set([...(keep.invites || []), ...(u.invites || [])]));
          await User.deleteOne({ _id: u._id });
        }
      }
      await keep.save();
      console.log(`  Merged into user: ${keep._id}`);
      */
    }
  }

  console.log(`Total duplicate wallets found: ${totalDuplicates}`);
  mongoose.disconnect();
}

findAndMergeDuplicates().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
