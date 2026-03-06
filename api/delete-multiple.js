const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: 'Missing or invalid IDs array' });
      }

      let leaderboard = (await kv.get('leaderboard')) || [];
      leaderboard = leaderboard.filter(entry => !ids.includes(entry.id));

      await kv.set('leaderboard', leaderboard);
      res.status(200).json({ success: true, message: `${ids.length} responses deleted` });
    } catch (error) {
      console.error('Error deleting multiple requests:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
