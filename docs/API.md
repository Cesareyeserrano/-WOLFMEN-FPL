# 📚 API Documentation

Complete reference for the Wolfmen FPL Tools codebase.

## Table of Contents

- [Configuration](#configuration)
- [Core Functions](#core-functions)
- [API Utilities](#api-utilities)
- [Sheet Helpers](#sheet-helpers)
- [Color Utilities](#color-utilities)
- [Module Functions](#module-functions)

---

## Configuration

### CONFIG Object

Global configuration object defined in `src/config/config.gs`

```javascript
const CONFIG = {
  MINI_LEAGUE_ID: number,    // Your FPL mini-league ID
  YOUR_TEAM_ID: number,      // Your FPL team ID
  TEAM_NAME: string,         // Your team name
  NOTIFY_EMAIL: string,      // Email for notifications
  SHEETS: {
    STANDINGS: string,       // "Standings"
    OWNERSHIP: string,       // "Ownership"
    EVOLUTION: string        // "Wolfmen Evolution"
  },
  FPL_API: {
    BASE_URL: string,        // FPL API base URL
    BOOTSTRAP: string,       // Bootstrap endpoint
    LEAGUE_STANDINGS: string, // League standings endpoint
    TEAM_PICKS: string,      // Team picks endpoint
    TEAM_INFO: string        // Team info endpoint
  },
  CACHE: {
    TTL_BOOTSTRAP: number,   // 21600s (6 hours)
    TTL_STANDINGS: number,   // 3600s (1 hour)
    TTL_TEAM_PICKS: number   // 1800s (30 minutes)
  }
};
```

### COLORS_BASE Object

Color scheme for formatting

```javascript
const COLORS_BASE = {
  header: '#d9d9d9',      // Header background
  self_bg: '#000000',     // Own team background
  self_font: '#f6b26b',   // Own team font
  green_dark: '#21f421',  // Positive differential (dark)
  green_light: '#ebfef0', // Positive differential (light)
  red_dark: '#f66060',    // Negative differential (dark)
  red_light: '#fff6f6'    // Negative differential (light)
};
```

---

## Core Functions

### Main Menu Functions

Located in `src/main.gs`

#### `onOpen()`

Creates the custom menu when the spreadsheet opens.

```javascript
function onOpen()
```

**Called:** Automatically when spreadsheet opens

#### `updateAll()`

Updates all modules (Standings, Ownership, Evolution)

```javascript
function updateAll()
```

**Usage:**
```javascript
updateAll(); // Updates everything
```

**Throws:** Error if any module fails

#### `clearAllCache()`

Clears all cached API data

```javascript
function clearAllCache()
```

---

## API Utilities

Located in `src/utils/api.gs`

### `fetchJsonSafe_(url, cacheKey, ttlSec)`

Fetch JSON data with retry logic and optional caching

**Parameters:**
- `url` (string): URL to fetch
- `cacheKey` (string|null): Optional cache key
- `ttlSec` (number): Cache TTL in seconds (default: 21600)

**Returns:** Object (parsed JSON)

**Example:**
```javascript
const data = fetchJsonSafe_(
  'https://fantasy.premierleague.com/api/bootstrap-static/',
  'fpl_bootstrap',
  21600
);
```

### `getBootstrapData_()`

Get FPL bootstrap data (players, teams, gameweeks)

**Returns:** Object with bootstrap data

**Example:**
```javascript
const bootstrap = getBootstrapData_();
const currentGW = bootstrap.events.find(e => e.is_current);
```

### `getLeagueStandings_(leagueId)`

Get league standings data

**Parameters:**
- `leagueId` (number): Mini-league ID

**Returns:** Object with standings data

**Example:**
```javascript
const standings = getLeagueStandings_(371793);
const teams = standings.standings.results;
```

### `getTeamPicks_(teamId, gameweek)`

Get team picks for a specific gameweek

**Parameters:**
- `teamId` (number): Team ID
- `gameweek` (number): Gameweek number

**Returns:** Object with picks data

**Example:**
```javascript
const picks = getTeamPicks_(3851196, 15);
const players = picks.picks.map(p => p.element);
```

---

## Sheet Helpers

Located in `src/utils/sheet-helpers.gs`

### `getOrCreateSheet(name)`

Get existing sheet or create new one

**Parameters:**
- `name` (string): Sheet name

**Returns:** Sheet object

**Example:**
```javascript
const sheet = getOrCreateSheet('Standings');
```

### `formatHeader(sheet, cols)`

Apply header formatting to first row

**Parameters:**
- `sheet` (Sheet): Target sheet
- `cols` (number): Number of columns

**Example:**
```javascript
formatHeader(sheet, 5);
```

### `clearFormatting(sheet)`

Clear all formatting from a sheet

**Parameters:**
- `sheet` (Sheet): Target sheet

### `autoResizeColumns(sheet, numCols)`

Auto-resize columns to fit content

**Parameters:**
- `sheet` (Sheet): Target sheet
- `numCols` (number): Number of columns to resize

### `freezeHeader(sheet)`

Freeze the first row

**Parameters:**
- `sheet` (Sheet): Target sheet

### `clearSheet(sheet)`

Clear all content and formatting

**Parameters:**
- `sheet` (Sheet): Target sheet

---

## Color Utilities

Located in `src/utils/colors.gs`

### `interpolateHSL(hex1, hex2, t)`

Interpolate between two colors in HSL space

**Parameters:**
- `hex1` (string): Start color (hex)
- `hex2` (string): End color (hex)
- `t` (number): Interpolation factor (0-1)

**Returns:** string (hex color)

**Example:**
```javascript
const color = interpolateHSL('#ffffff', '#ff0000', 0.5);
// Returns: '#ff8080'
```

### `hexToHSL(hex)`

Convert hex color to HSL

**Parameters:**
- `hex` (string): Hex color code

**Returns:** Object {h, s, l}

### `hslToHex(h, s, l)`

Convert HSL to hex color

**Parameters:**
- `h` (number): Hue (0-1)
- `s` (number): Saturation (0-1)
- `l` (number): Lightness (0-1)

**Returns:** string (hex color)

### `getColorForDifferential(value, maxAbs)`

Get color for differential value (green/red gradient)

**Parameters:**
- `value` (number): Differential value
- `maxAbs` (number): Maximum absolute value for scaling

**Returns:** string (hex color)

**Example:**
```javascript
const color = getColorForDifferential(15, 100);
// Returns green shade for positive differential
```

---

## Module Functions

### Standings Module

Located in `src/modules/standings.gs`

#### `updateStandings()`

Main function to update standings sheet

**Example:**
```javascript
updateStandings();
```

**Creates:**
- Standings sheet with columns: Rank, Team, Manager, GW, Total
- Highlights own team row
- Formatted headers

---

### Ownership Module

Located in `src/modules/ownership.gs`

#### `generateOwnershipDXP()`

Generate differential ownership analysis

**Example:**
```javascript
generateOwnershipDXP();
```

**Creates:**
- Ownership sheet with columns: Player, Team, Pos, Own%, Count, Yours, DXP
- Color-coded differentials
- Sorted by absolute differential
- Bold highlighting for your players

---

### Evolution Module

Located in `src/modules/evolution.gs`

#### `generateWolfmenEvolution()`

Generate evolution tracking chart

**Status:** Not yet implemented

---

## FPL API Response Structures

### Bootstrap Data

```javascript
{
  events: [{
    id: number,              // Gameweek number
    name: string,            // "Gameweek 1"
    is_current: boolean,
    is_next: boolean,
    finished: boolean
  }],
  teams: [{
    id: number,
    name: string,
    short_name: string
  }],
  elements: [{
    id: number,              // Player ID
    web_name: string,        // Display name
    team: number,            // Team ID
    element_type: number,    // Position (1-4)
    now_cost: number,        // Price in 0.1m
    total_points: number
  }]
}
```

### League Standings

```javascript
{
  standings: {
    results: [{
      entry: number,         // Team ID
      entry_name: string,    // Team name
      player_name: string,   // Manager name
      rank: number,
      last_rank: number,
      event_total: number,   // GW points
      total: number          // Overall points
    }]
  }
}
```

### Team Picks

```javascript
{
  picks: [{
    element: number,         // Player ID
    position: number,        // Position in squad (1-15)
    is_captain: boolean,
    is_vice_captain: boolean,
    multiplier: number       // Captain multiplier (1, 2, or 3)
  }]
}
```

---

## Error Handling

All functions include try-catch error handling:

```javascript
try {
  // Function logic
  console.log('✅ Success message');
} catch (err) {
  console.error(`❌ Error message: ${err.message}`);
  throw err;
}
```

## Logging

Use console.log for debugging:

```javascript
console.log('🔄 Starting process...');
console.log('✅ Success!');
console.error('❌ Error!');
console.log(`ℹ️ Info: ${variable}`);
```

View logs: **🐺 FPL Tools → Logs** (or `npm run logs`)

---

## Rate Limits

FPL API rate limits:
- ~50 requests per minute
- Use caching to minimize requests
- Retry logic handles 429 (Too Many Requests)

---

**Need more details? Check the source code or open an issue!**
