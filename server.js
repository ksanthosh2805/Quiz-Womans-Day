const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize leaderboard file if it doesn't exist
const initLeaderboard = () => {
  if (!fs.existsSync(LEADERBOARD_FILE)) {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([], null, 2));
  }
};

// Get all leaderboard entries
app.get('/api/leaderboard', (req, res) => {
  try {
    const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    const leaderboard = JSON.parse(data);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    res.json([]);
  }
});

// Submit quiz results
app.post('/api/submit', (req, res) => {
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
    res.json({ success: true, entry: newEntry });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard for export
app.get('/api/leaderboard/export', (req, res) => {
  try {
    const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    const leaderboard = JSON.parse(data);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error exporting leaderboard:', error);
    res.json([]);
  }
});

// Delete all responses
app.delete('/api/leaderboard', (req, res) => {
  try {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([], null, 2));
    console.log('All leaderboard entries cleared');
    res.json({ success: true, message: 'All responses cleared' });
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete specific response by ID
app.delete('/api/leaderboard/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    let leaderboard = JSON.parse(data);

    leaderboard = leaderboard.filter(entry => entry.id !== id);

    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
    console.log('Entry deleted:', id);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete multiple responses
app.post('/api/delete-multiple', (req, res) => {
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
    res.json({ success: true, message: `${ids.length} entries deleted` });
  } catch (error) {
    console.error('Error deleting entries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initialize and start server
initLeaderboard();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Backend server running at http://localhost:${PORT}`);
  console.log(`📱 Accessible on local network at http://<your-ip>:${PORT}\n`);
});
