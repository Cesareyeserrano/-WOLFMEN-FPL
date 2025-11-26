# 🔧 Setup Guide

Complete setup instructions for Wolfmen FPL Tools.

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Google Account
- ✅ Access to Google Sheets
- ✅ Node.js 14 or higher ([Download](https://nodejs.org/))
- ✅ Your FPL mini-league ID
- ✅ Your FPL team ID

## 🚀 Step-by-Step Setup

### 1. Install Node.js and npm

```bash
# Check if you have Node.js installed
node --version

# Check if you have npm installed
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### 2. Clone the Repository

```bash
git clone https://github.com/Cesareyeserrano/-WOLFMEN-FPL.git
cd -WOLFMEN-FPL
```

### 3. Install Dependencies

```bash
npm install
```

This will install:
- `@google/clasp` - Google Apps Script CLI
- `@types/google-apps-script` - TypeScript definitions

### 4. Setup Google Apps Script

#### 4.1 Login to Google

```bash
npx clasp login
```

This will:
1. Open a browser window
2. Ask you to authorize clasp
3. Save credentials locally

#### 4.2 Create New Script Project

```bash
npx clasp create --type sheets --title "Wolfmen FPL Tools"
```

This creates:
- A new Google Sheets file
- An Apps Script project linked to the sheet
- `.clasp.json` file with your script ID

**Alternative**: Link to existing spreadsheet

```bash
# Find your script ID from Tools > Script editor > Project Settings
npx clasp clone YOUR_SCRIPT_ID
```

### 5. Configure Your Settings

Edit `src/config/config.gs`:

```javascript
const CONFIG = {
  MINI_LEAGUE_ID: 371793,              // 👈 Replace with your league ID
  YOUR_TEAM_ID: 3851196,               // 👈 Replace with your team ID
  TEAM_NAME: 'WOLFMEN FC',             // 👈 Replace with your team name
  NOTIFY_EMAIL: 'your@email.com',      // 👈 Replace with your email
  // ...
};
```

#### Finding Your IDs

**Mini-League ID:**
1. Go to https://fantasy.premierleague.com/
2. Navigate to your league standings
3. Look at the URL: `/leagues/371793/standings/c`
4. The number `371793` is your league ID

**Team ID:**
1. Go to your team page
2. Look at the URL: `/entry/3851196/event/1`
3. The number `3851196` is your team ID

### 6. Deploy to Google Apps Script

```bash
npm run push
```

This uploads all files from `src/` to Google Apps Script.

### 7. Open Your Spreadsheet

```bash
npm run open
```

Or manually: Go to [Google Drive](https://drive.google.com/) and open "Wolfmen FPL Tools"

### 8. First Run

1. In the spreadsheet, you should see a new menu: **🐺 FPL Tools**
2. Click **🐺 FPL Tools → Update All**
3. First time: You'll need to authorize the script:
   - Click "Continue"
   - Select your Google account
   - Click "Advanced" → "Go to Wolfmen FPL Tools (unsafe)"
   - Click "Allow"

4. Wait for the data to load (30-60 seconds for first run)

## ✅ Verification

After setup, you should see:

- ✅ Menu "🐺 FPL Tools" in your spreadsheet
- ✅ Three sheets: Standings, Ownership, Wolfmen Evolution
- ✅ Data populated in Standings and Ownership
- ✅ Your team highlighted in the standings

## 🔄 Updating the Code

After making changes to the code:

```bash
# Push changes to Google Apps Script
npm run push

# Refresh your spreadsheet
# Changes will take effect immediately
```

## 🐛 Troubleshooting

### "clasp: command not found"

Install clasp globally:
```bash
npm install -g @google/clasp
```

### "Script file not found"

Make sure you're in the project directory:
```bash
cd -WOLFMEN-FPL
```

### "Access not granted or expired"

Re-authenticate:
```bash
npx clasp login --creds credentials.json
```

### "Execution failed: Authorization required"

1. Open the script editor: Tools → Script editor
2. Run any function manually
3. Complete the authorization flow
4. Try again in the spreadsheet

### API Rate Limits

If you hit FPL API rate limits:
1. Click **🧹 Clear Cache** to reset
2. Wait 60 seconds
3. Try **🔄 Update All** again

## 🎯 Next Steps

- Read the [API Documentation](API.md)
- Customize colors in `src/config/config.gs`
- Add triggers for automatic updates
- Explore the code in `src/modules/`

## 🆘 Need Help?

- Check the [FAQ](FAQ.md)
- Open an issue on [GitHub](https://github.com/Cesareyeserrano/-WOLFMEN-FPL/issues)
- Contact: cesareyeserrano@gmail.com

---

**Happy FPL managing! 🐺⚽**
