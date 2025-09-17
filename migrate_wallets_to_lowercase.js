// Migration script: migrate all User.wallet addresses to lowercase only (no merging)
// Usage: node migrate_wallets_to_lowercase.js

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

async function migrateWallets() {
  await mongoose.connect(MONGODB_URI);
  const users = await User.find({});
  let updated = 0, skipped = 0, errors = 0;

  for (const user of users) {
    const lowerWallet = user.wallet.toLowerCase();
    if (user.wallet !== lowerWallet) {
      try {
        user.wallet = lowerWallet;
        await user.save();
        updated++;
      } catch (err) {
        console.error(`Error updating user ${user._id}:`, err.message);
        errors++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`Migration complete. Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);
  mongoose.disconnect();
}

migrateWallets().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
