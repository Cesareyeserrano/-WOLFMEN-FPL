/*************************************************************
 * 🐺 WOLFMEN FPL TOOLS — CONFIGURATION
 * Global settings and constants
 *************************************************************/

const CONFIG = {
  // IDs Configuration
  LEAGUE_ID: 371793,
  TEAM_ID: 3851196,
  MINI_LEAGUE_ID: 371793,  // Backwards compatibility
  YOUR_TEAM_ID: 3851196,    // Backwards compatibility
  TEAM_NAME: 'WOLFMEN FC',
  NOTIFY_EMAIL: 'cesareyeserrano@gmail.com',

  // Sheet Names
  SHEET_NAMES: {
    STANDINGS: 'Standings',
    OWNERSHIP: 'Ownership',
    EVOLUTION: 'Wolfmen Evolution'
  },
  SHEETS: {  // Backwards compatibility
    STANDINGS: 'Standings',
    OWNERSHIP: 'Ownership',
    EVOLUTION: 'Wolfmen Evolution'
  },

  // API Endpoints
  API: {
    BASE: 'https://fantasy.premierleague.com/api',
    BOOTSTRAP: 'https://fantasy.premierleague.com/api/bootstrap-static/',
    LEAGUE: 'https://fantasy.premierleague.com/api/leagues-classic',
    PICKS: 'https://fantasy.premierleague.com/api/entry',
    ENTRY: 'https://fantasy.premierleague.com/api/entry'
  },

  // Backwards compatibility for FPL_API
  FPL_API: {
    BASE_URL: 'https://fantasy.premierleague.com/api',
    BOOTSTRAP: '/bootstrap-static/',
    LEAGUE_STANDINGS: '/leagues-classic/{LEAGUE_ID}/standings/',
    TEAM_PICKS: '/entry/{TEAM_ID}/event/{GW}/picks/',
    TEAM_INFO: '/entry/{TEAM_ID}/',
  },

  // Cache TTL (Time To Live in seconds)
  CACHE: {
    TTL_BOOTSTRAP: 21600,    // 6 hours
    TTL_STANDINGS: 3600,     // 1 hour
    TTL_TEAM_PICKS: 1800,    // 30 minutes
  },

  // Colors Configuration
  COLORS: {
    HEADER: '#d9d9d9',
    SELF: {
      BG: '#000000',
      FONT: '#f6b26b'
    },
    DIFFERENTIAL: {
      DARK_GREEN: '#21f421',
      LIGHT_GREEN: '#ebfef0',
      DARK_RED: '#f66060',
      LIGHT_RED: '#fff6f6'
    }
  }
};

const INCLUDE_BENCH = true;

/***** BASE COLORS (Backwards compatibility) *****/
const COLORS_BASE = {
  header: '#d9d9d9',
  self_bg: '#000000',
  self_font: '#f6b26b',
  green_dark: '#21f421',
  green_light: '#ebfef0',
  red_dark: '#f66060',
  red_light: '#fff6f6',
};
