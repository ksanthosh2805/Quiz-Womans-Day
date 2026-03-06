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
      const { name, email, answers, score, timestamp } = req.body;

      if (!name || !email || score === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Read current leaderboard from KV
      let leaderboard = (await kv.get('leaderboard')) || [];

      // Add new entry
      const newEntry = {
        id: Date.now(),
        name,
        email,
        score,
        date: timestamp || new Date().toISOString(),
        answers
      };

      leaderboard.push(newEntry);

      // Sort by score (descending)
      leaderboard.sort((a, b) => b.score - a.score);

      // Save updated leaderboard to KV
      await kv.set('leaderboard', leaderboard);

      console.log('Quiz submitted:', name, score);
      res.status(200).json({ success: true, entry: newEntry });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};