/*************************************************************
 * 🐺 WOLFMEN FPL TOOLS — CONFIGURATION
 * Global settings and constants
 *
 * @author Cesar Eye Serrano
 * @email cesareyeserrano@gmail.com
 *************************************************************/

const CONFIG = {
  MINI_LEAGUE_ID: 371793,
  YOUR_TEAM_ID: 3851196,
  TEAM_NAME: 'WOLFMEN FC',
  NOTIFY_EMAIL: 'cesareyeserrano@gmail.com',
  SHEETS: {
    STANDINGS: 'Standings',
    OWNERSHIP: 'Ownership',
    EVOLUTION: 'Wolfmen Evolution'
  },
  FPL_API: {
    BASE_URL: 'https://fantasy.premierleague.com/api',
    BOOTSTRAP: '/bootstrap-static/',
    LEAGUE_STANDINGS: '/leagues-classic/{LEAGUE_ID}/standings/',
    TEAM_PICKS: '/entry/{TEAM_ID}/event/{GW}/picks/',
    TEAM_INFO: '/entry/{TEAM_ID}/',
  },
  CACHE: {
    TTL_BOOTSTRAP: 21600,    // 6 hours
    TTL_STANDINGS: 3600,     // 1 hour
    TTL_TEAM_PICKS: 1800,    // 30 minutes
  }
};

const INCLUDE_BENCH = true;

/***** BASE COLORS *****/
const COLORS_BASE = {
  header: '#d9d9d9',
  self_bg: '#000000',
  self_font: '#f6b26b',
  green_dark: '#21f421',
  green_light: '#ebfef0',
  red_dark: '#f66060',
  red_light: '#fff6f6',
};
