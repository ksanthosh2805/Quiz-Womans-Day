const fs = require('fs');
const path = require('path');

const LEADERBOARD_FILE = path.join(process.cwd(), 'leaderboard.json');

// Delete specific response by ID
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const id = parseInt(req.query.id);
      const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
      let leaderboard = JSON.parse(data);

      leaderboard = leaderboard.filter(entry => entry.id !== id);

      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
      console.log('Entry deleted:', id);
      res.status(200).json({ success: true, message: 'Entry deleted' });
    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}