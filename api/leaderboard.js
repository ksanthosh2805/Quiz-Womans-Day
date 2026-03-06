const { kv } = require('@vercel/kv');

// Get all leaderboard entries
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Removed POST, DELETE
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure leaderboard exists in KV
  try {
    const existing = await kv.get('leaderboard');
    if (!existing) {
      await kv.set('leaderboard', []);
    }
  } catch (err) {
    console.warn('Could not initialize KV leaderboard:', err.message);
  }

  if (req.method === 'GET') {
    try {
      const leaderboard = (await kv.get('leaderboard')) || [];
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error('Error reading leaderboard:', error);
      res.status(500).json([]);
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}