/*************************************************************
 * 👥 OWNERSHIP MODULE
 * Generates differential ownership analysis (DXP)
 *************************************************************/

/**
 * Main function to generate ownership DXP sheet
 */
function generateOwnershipDXP() {
  try {
    console.log('🔄 Generating Ownership DXP...');

    // Get current gameweek
    const currentGW = getCurrentGameweek_();

    // Get league standings to get all team IDs
    const leagueData = getLeagueStandings_(CONFIG.MINI_LEAGUE_ID);
    const teamIds = leagueData.standings.results.map(t => t.entry);

    // Get bootstrap data for player names
    const bootstrap = getBootstrapData_();
    const playersMap = {};
    bootstrap.elements.forEach(p => {
      playersMap[p.id] = {
        name: p.web_name,
        team: bootstrap.teams[p.team - 1].short_name,
        position: ['GKP', 'DEF', 'MID', 'FWD'][p.element_type - 1]
      };
    });

    // Calculate ownership
    const ownershipData = calculateOwnership_(teamIds, currentGW, playersMap);

    // Get or create sheet
    const sheet = getOrCreateSheet(CONFIG.SHEETS.OWNERSHIP);
    clearSheet(sheet);

    // Build and write data
    writeOwnershipSheet_(sheet, ownershipData, teamIds.length, currentGW);

    console.log(`✅ Ownership DXP generated (GW ${currentGW}, ${teamIds.length} teams)`);
  } catch (err) {
    console.error(`❌ generateOwnershipDXP failed: ${err.message}`);
    throw err;
  }
}

/**
 * Calculate ownership statistics
 * @private
 */
function calculateOwnership_(teamIds, gameweek, playersMap) {
  const ownershipCount = {};
  const yourTeamPlayers = new Set();

  // Fetch all teams' picks
  teamIds.forEach((teamId, idx) => {
    console.log(`Fetching team ${idx + 1}/${teamIds.length}...`);
    const picks = getTeamPicks_(teamId, gameweek);

    picks.picks.forEach(pick => {
      const playerId = pick.element;
      ownershipCount[playerId] = (ownershipCount[playerId] || 0) + 1;

      if (teamId === CONFIG.YOUR_TEAM_ID) {
        yourTeamPlayers.add(playerId);
      }
    });
  });

  // Calculate differentials
  const players = [];
  for (const [playerId, count] of Object.entries(ownershipCount)) {
    const id = parseInt(playerId);
    const player = playersMap[id];
    if (!player) continue;

    const ownership = (count / teamIds.length) * 100;
    const inYourTeam = yourTeamPlayers.has(id);

    players.push({
      id,
      name: player.name,
      team: player.team,
      position: player.position,
      ownership,
      count,
      inYourTeam,
      differential: inYourTeam ? (100 - ownership) : -ownership
    });
  }

  return players;
}

/**
 * Write ownership data to sheet
 * @private
 */
function writeOwnershipSheet_(sheet, players, totalTeams, gameweek) {
  // Headers
  const headers = ['Player', 'Team', 'Pos', 'Own%', 'Count', 'Yours', 'DXP'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);

  // Sort by absolute differential
  players.sort((a, b) => Math.abs(b.differential) - Math.abs(a.differential));

  // Data rows
  const data = players.map(p => [
    p.name,
    p.team,
    p.position,
    p.ownership.toFixed(1) + '%',
    p.count,
    p.inYourTeam ? '✓' : '',
    p.differential.toFixed(1)
  ]);

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, headers.length).setValues(data);

    // Color code differentials
    colorCodeDifferentials_(sheet, players);
  }

  // Format
  freezeHeader(sheet);
  autoResizeColumns(sheet, headers.length);

  sheet.getRange(1, 1, sheet.getLastRow(), 1).setNote(`Updated: GW ${gameweek}`);
}

/**
 * Apply color coding to differential column
 * @private
 */
function colorCodeDifferentials_(sheet, players) {
  const maxAbsDiff = Math.max(...players.map(p => Math.abs(p.differential)));

  players.forEach((player, idx) => {
    const rowNum = idx + 2;
    const color = getColorForDifferential(player.differential, maxAbsDiff);

    // Color the DXP cell
    sheet.getRange(rowNum, 7).setBackground(color);

    // Highlight rows for your players
    if (player.inYourTeam) {
      sheet.getRange(rowNum, 1, 1, 7).setFontWeight('bold');
    }
  });
}
