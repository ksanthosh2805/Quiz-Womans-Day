const fs = require('fs');
const path = require('path');

const LEADERBOARD_FILE = path.join(process.cwd(), 'leaderboard.json');

// Initialize leaderboard file if it doesn't exist
const initLeaderboard = () => {
  if (!fs.existsSync(LEADERBOARD_FILE)) {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([], null, 2));
  }
};

// Get all leaderboard entries
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  initLeaderboard();

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
      const leaderboard = JSON.parse(data);
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

      // Read current leaderboard
      const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
      let leaderboard = JSON.parse(data);

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

      // Save updated leaderboard
      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));

      console.log('Quiz submitted:', name, score);
      res.status(200).json({ success: true, entry: newEntry });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // Handle delete all responses
    try {
      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([], null, 2));
      console.log('All leaderboard entries cleared');
      res.status(200).json({ success: true, message: 'All responses cleared' });
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}