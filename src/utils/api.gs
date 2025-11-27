/*************************************************************
 * 🌐 API & FETCH UTILITIES
 * HTTP requests, caching, and API helpers
 *
 * @author Cesar Eye Serrano
 *************************************************************/

/**
 * Fetch JSON with retry and optional cache
 * @param {string} url - The URL to fetch
 * @param {string} cacheKey - Optional cache key
 * @param {number} ttlSec - Cache TTL in seconds (default 6 hours)
 * @returns {Object} Parsed JSON response
 */
function fetchJsonSafe_(url, cacheKey = null, ttlSec = 21600) {
  try {
    // Check cache first
    if (cacheKey) {
      const cache = CacheService.getScriptCache().get(cacheKey);
      if (cache) {
        console.log(`✅ Cache hit for ${cacheKey}`);
        return JSON.parse(cache);
      }
    }

    const params = {
      method: 'get',
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json, text/plain, */*',
      },
    };

    // Retry logic for resilience
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

    // Store in cache
    if (cacheKey) {
      const text = JSON.stringify(json);
      if (text.length < 95000) {
        CacheService.getScriptCache().put(cacheKey, text, ttlSec);
        console.log(`💾 Cached ${cacheKey} (${text.length} chars, ${ttlSec}s TTL)`);
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

/**
 * Get FPL Bootstrap data (players, teams, gameweeks)
 * @returns {Object} Bootstrap static data
 */
function getBootstrapData_() {
  const url = CONFIG.FPL_API.BASE_URL + CONFIG.FPL_API.BOOTSTRAP;
  return fetchJsonSafe_(url, 'fpl_bootstrap', CONFIG.CACHE.TTL_BOOTSTRAP);
}

/**
 * Get league standings
 * @param {number} leagueId - Mini-league ID
 * @returns {Object} League standings data
 */
function getLeagueStandings_(leagueId) {
  const url = CONFIG.FPL_API.BASE_URL +
              CONFIG.FPL_API.LEAGUE_STANDINGS.replace('{LEAGUE_ID}', leagueId);
  return fetchJsonSafe_(url, `league_${leagueId}`, CONFIG.CACHE.TTL_STANDINGS);
}

/**
 * Get team picks for a specific gameweek
 * @param {number} teamId - Team ID
 * @param {number} gameweek - Gameweek number
 * @returns {Object} Team picks data
 */
function getTeamPicks_(teamId, gameweek) {
  const url = CONFIG.FPL_API.BASE_URL +
              CONFIG.FPL_API.TEAM_PICKS
                .replace('{TEAM_ID}', teamId)
                .replace('{GW}', gameweek);
  return fetchJsonSafe_(url, `team_${teamId}_gw${gameweek}`, CONFIG.CACHE.TTL_TEAM_PICKS);
}
