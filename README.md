# 🐺 Wolfmen FPL Tools

> Fantasy Premier League automation tools for the Wolfmen mini-league, powered by Google Apps Script.

## 📋 Features

- **📊 Standings Tracker**: Real-time league standings with automatic updates
- **👥 Ownership Analysis**: Differential ownership calculator (DXP) to identify unique picks
- **📈 Evolution Chart**: Historical performance tracking over gameweeks
- **🎨 Smart Formatting**: Color-coded differentials and highlighted own team
- **⚡ Caching**: Intelligent API caching for faster updates

## 🚀 Quick Start

### Prerequisites

- Google Account with access to Google Sheets
- Node.js 14+ (for development)
- [clasp](https://github.com/google/clasp) CLI tool

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/Cesareyeserrano/-WOLFMEN-FPL.git
   cd -WOLFMEN-FPL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure clasp**
   ```bash
   # Login to Google
   npx clasp login

   # Create a new Google Sheets project or link existing
   npx clasp create --type sheets --title "Wolfmen FPL Tools"

   # This will create .clasp.json with your script ID
   ```

4. **Configure your settings**
   - Edit `src/config/config.gs`
   - Update `MINI_LEAGUE_ID`, `YOUR_TEAM_ID`, `TEAM_NAME`, and `NOTIFY_EMAIL`

5. **Deploy to Google Apps Script**
   ```bash
   npm run push
   ```

6. **Open your spreadsheet**
   ```bash
   npm run open
   ```

## 📖 Usage

Once deployed, open your Google Sheet and you'll see a custom menu **"🐺 FPL Tools"** with the following options:

- **📊 Update Standings**: Refresh league standings table
- **👥 Generate Ownership DXP**: Calculate differential ownership
- **📈 Generate Wolfmen Evolution**: Update historical performance chart
- **🔄 Update All**: Run all updates at once
- **🧹 Clear Cache**: Clear all cached API data

## 🏗️ Project Structure

```
-WOLFMEN-FPL/
├── src/
│   ├── config/
│   │   └── config.gs           # Configuration and constants
│   ├── utils/
│   │   ├── api.gs              # FPL API and fetch utilities
│   │   ├── colors.gs           # Color interpolation helpers
│   │   └── sheet-helpers.gs    # Google Sheets utilities
│   ├── modules/
│   │   ├── standings.gs        # League standings module
│   │   ├── ownership.gs        # Ownership analysis module
│   │   └── evolution.gs        # Evolution tracking module
│   └── main.gs                 # Menu and main dispatcher
├── docs/                       # Documentation
├── tests/                      # Test files
├── appsscript.json            # Apps Script manifest
├── package.json               # npm configuration
└── README.md                  # This file
```

## ⚙️ Configuration

Edit `src/config/config.gs`:

```javascript
const CONFIG = {
  MINI_LEAGUE_ID: 371793,              // Your FPL mini-league ID
  YOUR_TEAM_ID: 3851196,               // Your FPL team ID
  TEAM_NAME: 'WOLFMEN FC',             // Your team name
  NOTIFY_EMAIL: 'your@email.com',      // Email for notifications
  // ...
};
```

### Finding Your IDs

- **Mini-League ID**: Visit your league page, the ID is in the URL:
  `https://fantasy.premierleague.com/leagues/371793/standings/c`

- **Team ID**: Visit your team page, the ID is in the URL:
  `https://fantasy.premierleague.com/entry/3851196/event/1`

## 🔧 Development

### Available Scripts

```bash
npm run push    # Push code to Google Apps Script
npm run pull    # Pull code from Google Apps Script
npm run open    # Open the spreadsheet in browser
npm run deploy  # Create a new deployment
npm run logs    # View execution logs
```

### Adding New Features

1. Create a new module in `src/modules/`
2. Add utility functions to `src/utils/` if needed
3. Register menu items in `src/main.gs`
4. Test in the Apps Script editor
5. Push changes with `npm run push`

## 📊 API Reference

### FPL API Endpoints Used

- `GET /api/bootstrap-static/` - Bootstrap data (players, teams, gameweeks)
- `GET /api/leagues-classic/{id}/standings/` - League standings
- `GET /api/entry/{id}/event/{gw}/picks/` - Team picks for a gameweek
- `GET /api/entry/{id}/` - Team information

## 🎨 Color Scheme

The tool uses a custom color scheme for differentials:

- **Green gradient**: Positive differentials (players you own that others don't)
- **Red gradient**: Negative differentials (popular players you don't own)
- **Black/Orange**: Your team highlighting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Cesar Eye Serrano**
- Email: cesareyeserrano@gmail.com
- GitHub: [@Cesareyeserrano](https://github.com/Cesareyeserrano)

## 🙏 Acknowledgments

- Fantasy Premier League for the excellent API
- Google Apps Script for the automation platform
- The Wolfmen mini-league members for the competition!

---

**Made with 🐺 for Wolfmen FC**
