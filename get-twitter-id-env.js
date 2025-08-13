// get-twitter-id.js
require('dotenv').config({ path: '.env.local' });

// Fetch API is built-in in Node 18+, else uncomment this:
// const fetch = require('node-fetch');

const username = process.argv[2];

if (!username) {
  console.error("❌ Please provide a Twitter username (without @). Example: node get-twitter-id.js TheGlobNfts");
  process.exit(1);
}

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
if (!BEARER_TOKEN) {
  console.error("❌ Missing TWITTER_BEARER_TOKEN in .env.local");
  process.exit(1);
}

(async () => {
  try {
    const res = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`
      }
    });

    if (!res.ok) {
      throw new Error(`Twitter API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`✅ Twitter ID for @${username}: ${data.data?.id || "Not found"}`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error fetching Twitter ID:", err.message);
  }
})();
