// Cleanup script to delete duplicate user with 0 points
// Usage: node cleanup_duplicate_user.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/globnfts';

const userSchema = new mongoose.Schema({
  wallet: String,
  points: Number,
});

const User = mongoose.model('User', userSchema);

async function cleanupDuplicate() {
  await mongoose.connect(MONGODB_URI);
  const idToDelete = '68a46afdb294c7fcd5d34d17';
  const result = await User.deleteOne({ _id: idToDelete });
  if (result.deletedCount === 1) {
    console.log(`Successfully deleted duplicate user: ${idToDelete}`);
  } else {
    console.log(`User not found or already deleted: ${idToDelete}`);
  }
  mongoose.disconnect();
}

cleanupDuplicate().catch(err => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
