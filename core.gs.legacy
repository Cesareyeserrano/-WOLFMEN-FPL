/*************************************************************
 * 🐺 WOLFMEN FPL TOOLS — CORE MODULE
 * Global config, caching, fetch, utilities, and UI menu.
 *************************************************************/

/***** CONFIGURATION *****/
const CONFIG = {
  MINI_LEAGUE_ID: 371793,
  YOUR_TEAM_ID: 3851196,
  TEAM_NAME: 'WOLFMEN FC',
  NOTIFY_EMAIL: 'cesareyeserrano@gmail.com',   // 👈 añadir esto
  SHEETS: { STANDINGS: 'Standings', OWNERSHIP: 'Ownership' },
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

/*************************************************************
 * ⚙️ GENERAL HELPERS
 *************************************************************/

/** Fetch JSON with retry and optional cache */
function fetchJsonSafe_(url, cacheKey = null, ttlSec = 21600) {
  try {
    if (cacheKey) {
      const cache = CacheService.getScriptCache().get(cacheKey);
      if (cache) return JSON.parse(cache);
    }

    const params = {
      method: 'get',
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json, text/plain, */*',
      },
    };

    let res, code;
    for (let i = 0; i < 3; i++) {
      res = UrlFetchApp.fetch(url, params);
      code = res.getResponseCode();
      if (code === 200) break;
      if ([403, 429, 500].includes(code)) {
        console.log(`↻ Retry (${i + 1}) due to ${code}: ${url}`);
        Utilities.sleep(500 + i * 500);
      } else {
        throw new Error(`HTTP ${code} - ${url}`);
      }
    }

    if (code !== 200) throw new Error(`HTTP ${code} - ${url}`);
    const json = JSON.parse(res.getContentText());
    if (cacheKey)
      if (cacheKey) {
  const text = JSON.stringify(json);
  if (text.length < 95000) {
    CacheService.getScriptCache().put(cacheKey, text, ttlSec);
  } else {
    console.log(`⚠️ Skipping cache for ${cacheKey} (too large: ${text.length} chars)`);
  }
}

    return json;
  } catch (e) {
    console.log(`❌ Fetch error for ${url}: ${e.message}`);
    throw e;
  }
}

/** Create or retrieve a sheet by name */
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

/** Apply header formatting */
function formatHeader(sheet, cols) {
  const range = sheet.getRange(1, 1, 1, cols);
  range.setFontWeight('bold').setBackground(COLORS_BASE.header);
}

/** Clear all formats in a sheet before repainting */
function clearFormatting(sheet) {
  const range = sheet.getDataRange();
  range.clearFormat();
}

/*************************************************************
 * 🎨 COLOR UTILITIES
 *************************************************************/

/**
 * Interpolate two hex colors in HSL space
 * t ∈ [0, 1] where 0 = dark/close, 1 = light/far
 */
function interpolateHSL(hex1, hex2, t) {
  const c1 = hexToHSL(hex1);
  const c2 = hexToHSL(hex2);
  const h = c1.h + (c2.h - c1.h) * t;
  const s = c1.s + (c2.s - c1.s) * t;
  const l = c1.l + (c2.l - c1.l) * t;
  return hslToHex(h, s, l);
}

function hexToHSL(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToHex(h, s, l) {
  function f(n) {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  }
  return `#${f(0)}${f(8)}${f(4)}`;
}

/*************************************************************
 * 🧭 UI MENU + DISPATCHER
 *************************************************************/

function updateAll() {
  try {
    updateStandings();
    generateOwnershipDXP();
    generateWolfmenEvolution(); // ✅ ahora incluido
    console.log('✅ Standings, Ownership y Evolution actualizados.');
  } catch (err) {
    console.log(`❌ updateAll failed: ${err.message}`);
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🐺 FPL Tools')
    .addItem('Update Standings', 'updateStandings')
    .addItem('Generate Ownership DXP', 'generateOwnershipDXP')
    .addItem('Generate Wolfmen Evolution', 'generateWolfmenEvolution')
    .addSeparator()
    .addItem('Update All', 'updateAll')
    .addToUi();
}
