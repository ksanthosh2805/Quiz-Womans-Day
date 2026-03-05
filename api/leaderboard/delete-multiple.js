const fs = require('fs');
const path = require('path');

const LEADERBOARD_FILE = path.join(process.cwd(), 'leaderboard.json');

// Delete multiple responses
export default function handler(req, res) {
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

      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'IDs must be an array' });
      }

      const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
      let leaderboard = JSON.parse(data);

      leaderboard = leaderboard.filter(entry => !ids.includes(entry.id));

      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
      console.log('Entries deleted:', ids);
      res.status(200).json({ success: true, message: `${ids.length} entries deleted` });
    } catch (error) {
      console.error('Error deleting entries:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}