/*************************************************************
 * 📊 STANDINGS MODULE
 * Updates and formats league standings table
 *
 * @author Cesar Eye Serrano
 *************************************************************/

/**
 * Main function to update standings sheet
 */
function updateStandings() {
  try {
    console.log('🔄 Updating standings...');

    // Get data
    const leagueData = getLeagueStandings_(CONFIG.MINI_LEAGUE_ID);
    const currentGW = getCurrentGameweek_();

    // Get or create sheet
    const sheet = getOrCreateSheet(CONFIG.SHEETS.STANDINGS);
    clearSheet(sheet);

    // Build headers
    const headers = ['Rank', 'Team', 'Manager', 'GW', 'Total'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeader(sheet, headers.length);

    // Process standings
    const standings = leagueData.standings.results;
    const data = standings.map(entry => [
      entry.rank,
      entry.entry_name,
      entry.player_name,
      entry.event_total,
      entry.total
    ]);

    // Write data
    if (data.length > 0) {
      sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }

    // Highlight own team
    highlightOwnTeam_(sheet, CONFIG.YOUR_TEAM_ID, standings);

    // Format
    freezeHeader(sheet);
    autoResizeColumns(sheet, headers.length);

    console.log(`✅ Standings updated (${data.length} teams, GW ${currentGW})`);
  } catch (err) {
    console.error(`❌ updateStandings failed: ${err.message}`);
    throw err;
  }
}

/**
 * Get current gameweek number
 * @private
 */
function getCurrentGameweek_() {
  const bootstrap = getBootstrapData_();
  const currentGW = bootstrap.events.find(e => e.is_current);
  return currentGW ? currentGW.id : 1;
}

/**
 * Highlight own team row
 * @private
 */
function highlightOwnTeam_(sheet, teamId, standings) {
  const ownTeamIndex = standings.findIndex(entry => entry.entry === teamId);
  if (ownTeamIndex === -1) return;

  const rowNum = ownTeamIndex + 2; // +1 for header, +1 for 0-index
  const numCols = sheet.getLastColumn();
  const range = sheet.getRange(rowNum, 1, 1, numCols);

  range.setBackground(COLORS_BASE.self_bg)
       .setFontColor(COLORS_BASE.self_font)
       .setFontWeight('bold');

  console.log(`✨ Highlighted own team at row ${rowNum}`);
}
