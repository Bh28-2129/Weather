# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your API Key (2 minutes)
1. Go to https://openweathermap.org/api
2. Click "Sign Up" and create a free account
3. Go to API Keys tab
4. Copy your API Key

### Step 2: Install Dependencies (1 minute)
Open terminal/command prompt in the `weather` folder:
```bash
npm install
```

### Step 3: Configure API Key (1 minute)
Edit `.env` file and update:
```
OPENWEATHER_API_KEY=paste_your_key_here
PORT=5000
```

### Step 4: Run the Server (1 minute)
```bash
npm start
```

### Step 5: Open Your Browser
Go to: `http://localhost:5000`

---

## 📋 What You'll See

✅ **On First Load:**
- Browser asks for location permission
- Current weather of your city displays
- 7-day forecast loads automatically
- Popular cities in sidebar

✅ **Interactive Features:**
- 🔍 Search any city
- ⭐ Click popular cities to switch
- 📍 "Current Location" button for geolocation
- All weather details and icons

---

## 🛠️ Development Mode (Optional)

For auto-reload while coding:
```bash
npm install --save-dev nodemon
npm run dev
```

---

## ❌ Troubleshooting

**API Key not working?**
- Double-check it's pasted correctly in `.env`
- Wait a few minutes after creating the key
- Verify at https://openweathermap.org (you should see "valid")

**Port 5000 already in use?**
- Change PORT in `.env` to another number (e.g., 5001)
- Or kill the process using port 5000

**"City not found" error?**
- Check spelling (often needs full city name)
- Try searching for a famous city first

**Location not working?**
- Check browser doesn't have location blocked
- Allow location permission when prompted
- Try "Current Location" button

---

## 📚 Full Documentation

See `README.md` for complete documentation, features, and troubleshooting.

---

**Ready to go! Enjoy your weather app! 🌤️**
