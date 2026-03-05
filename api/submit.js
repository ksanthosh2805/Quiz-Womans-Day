// simple Vercel serverless function to receive quiz answers
module.exports = (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;
    console.log('received submission:', data);
    // in a real app you might persist to a database or send an email
    return res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};