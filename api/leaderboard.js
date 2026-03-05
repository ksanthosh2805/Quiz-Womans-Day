const { kv } = require('@vercel/kv');

// Get all leaderboard entries
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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
  } else if (req.method === 'POST') {
    // Handle submit quiz results
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
  } else if (req.method === 'DELETE') {
    // Handle delete all responses
    try {
      await kv.set('leaderboard', []);
      console.log('All leaderboard entries cleared from KV');
      res.status(200).json({ success: true, message: 'All responses cleared' });
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.url === '/delete-multiple' && req.method === 'POST') {
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
}