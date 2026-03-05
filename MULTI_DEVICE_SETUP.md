# Women's Safety Quiz - Multi-Device Shared Leaderboard Setup

## 🎉 What's New?

Your quiz app now uses a **centralized backend server** that stores all leaderboard data. This means:

✅ **All devices sync to the same leaderboard**  
✅ **Quiz results are shared across PC, mobile, and all devices**  
✅ **Leaderboard data persists between sessions**  
✅ **Admin can manage responses from any device**  

## 📋 Project Structure

```
quiz-react/
├── server.js                 # Backend Express server (NEW!)
├── leaderboard.json          # Database file for leaderboard data
├── package.json              # Updated with new scripts
├── src/
│   ├── App.js               # Updated to use API calls
│   ├── index.js
│   └── index.css
└── public/
    └── index.html
```

## 🚀 How to Run

### For Development (with both servers):

```bash
npm run dev
```

This will start **both** servers simultaneously:
- **Backend Server**: http://localhost:5000 (http://your-ip:5000)
- **React App**: http://localhost:3000 (http://your-ip:3000)

### For Production React Only:
```bash
npm start
```

### For Backend Server Only:
```bash
npm run server
```

## 📱 Accessing from Multiple Devices

To access from your phone or another device on your local network:

1. **Find your PC's IP address**:
   - On Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" (usually looks like `192.168.x.x`)

2. **On your phone/other device**:
   - Open browser
   - Type: `http://192.168.x.x:3000` (replace with your actual IP)
   - Example: `http://192.168.5.1:3000`

3. **All devices will share the same leaderboard!**

## 🔄 Real-Time Data Sync

The app features **automatic real-time synchronization** across all devices:

✅ **Leaderboard auto-refreshes every 5 seconds** - See new quiz submissions instantly on all devices  
✅ **Admin dashboard auto-updates** - New responses appear without manual refresh  
✅ **Immediate sync on quiz submission** - When someone completes a quiz, the leaderboard updates immediately  
✅ **Instant delete updates** - Admin deletions reflect across all connected devices  

### How it works:
- When you view the **Leaderboard**, it automatically fetches fresh data every 5 seconds
- When you view the **Admin Dashboard**, it automatically polls for updates every 5 seconds
- When a quiz is **submitted**, the leaderboard immediately refreshes
- When responses are **deleted**, all devices see the update right away

**No manual refresh needed!** Just keep the page open and watch the leaderboard update as other users take the quiz.

## 🔧 How It Works

### Backend Server (server.js)
Runs on **port 5000** and provides these API endpoints:

- **GET** `/api/leaderboard` - Get all leaderboard entries
- **POST** `/api/submit` - Submit quiz results
- **DELETE** `/api/leaderboard` - Clear all responses
- **DELETE** `/api/leaderboard/:id` - Delete specific entry
- **POST** `/api/leaderboard/delete-multiple` - Delete multiple entries
- **GET** `/api/leaderboard/export` - Get data for Excel export

### Data Storage
All leaderboard data is stored in `leaderboard.json` file (auto-created on first run).

## 🎯 Admin Dashboard Access

1. Go to the registration page
2. Click **"🔐 Admin Login"** button
3. Enter password (options: `admin123` or `womensday_admin_2024`)
4. Access the admin dashboard to:
   - View all responses
   - Export to Excel
   - Delete responses
   - Select and delete multiple responses

## ⚠️ Important Notes

1. **Backend server must be running** for the app to work properly
2. Use `npm run dev` to start both servers automatically
3. All devices on your local network must be able to reach your PC on port 3000 and 5000
4. Data is stored in `leaderboard.json` - make sure not to delete it!

## 🌐 Network Requirements

- All devices must be on the same WiFi network
- Firewall should allow connections on ports 3000 and 5000
- Some networks (like corporate WiFi) may block these ports

## 🔄 Troubleshooting

### "Can't connect to server" error:
- Make sure backend is running (`npm run dev`)
- Check if port 5000 is available
- Verify all devices are on the same network

### "Leaderboard not updating on other devices":
- **This is normal!** The leaderboard auto-refreshes every 5 seconds
- Wait a few seconds and the data will update automatically
- No need to manually refresh - just keep the page open
- If it's not updating: Check browser console for errors and verify backend is running

### "Quiz results not showing immediately":
- After submitting a quiz, the leaderboard is updated immediately
- If using the leaderboard from another device, it will show within 5 seconds
- Close and reopen the leaderboard page to force an immediate refresh (optional)

### "Can't connect to server" on phone:
- Check if port 5000 is available
- Verify all devices are on the same WiFi network
- Make sure you're using the correct local IP (e.g., 192.168.x.x, not 127.0.0.1)
- Some firewalls block local network connections - check router settings

### "Admin dashboard not showing latest data":
- The admin dashboard also auto-refreshes every 5 seconds
- If you need to refresh immediately, reload the page (F5 or Cmd+R)
- Make sure backend server is running at port 5000

### Port already in use:
- Kill the process using that port
- Or wait a few seconds and try again
- Windows: `netstat -ano | findstr :5000` to find process ID, then `taskkill /PID [id] /F`

## 📊 Data Export

Admin can export all responses as Excel file:
1. Log into admin dashboard
2. Click **"📊 Export to Excel"**
3. File downloads automatically

## 🎓 Quiz Features

- 5 rounds with 4 random questions each
- 60 seconds per round (auto-advance)
- Real-time leaderboard updates
- Personalized messages after quiz
- Mobile-responsive design
- Works on all devices with local network access

---

**Happy Women's Day! 🌸** - Built for empowerment and awareness.
