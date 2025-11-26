/*************************************************************
 * 📈 EVOLUTION MODULE
 * Tracks team performance over time
 *************************************************************/

/**
 * Main function to generate Wolfmen evolution chart
 */
function generateWolfmenEvolution() {
  try {
    console.log('🔄 Generating Wolfmen Evolution...');

    const leagueData = getLeagueStandings_(CONFIG.MINI_LEAGUE_ID);
    const bootstrap = getBootstrapData_();
    const currentGW = bootstrap.events.find(e => e.is_current)?.id || 1;

    // Get or create sheet
    const sheet = getOrCreateSheet(CONFIG.SHEETS.EVOLUTION);
    clearSheet(sheet);

    // Build headers
    const headers = ['Gameweek', 'Rank', 'GW Points', 'Total Points', 'Rank Change'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeader(sheet, headers.length);

    // Fetch historical data for your team
    const history = fetchTeamHistory_(CONFIG.YOUR_TEAM_ID, currentGW);

    if (history.length === 0) {
      sheet.getRange(2, 1).setValue('No historical data available yet');
      console.log('⚠️ No historical data found');
      return;
    }

    // Write data
    sheet.getRange(2, 1, history.length, headers.length).setValues(history);

    // Format numbers
    const dataRange = sheet.getRange(2, 1, history.length, headers.length);
    dataRange.setHorizontalAlignment('center');

    // Color code rank changes
    colorCodeRankChanges_(sheet, history);

    // Create chart
    createEvolutionChart_(sheet, history.length);

    // Format
    freezeHeader(sheet);
    autoResizeColumns(sheet, headers.length);

    console.log(`✅ Evolution updated (${history.length} gameweeks)`);
  } catch (err) {
    console.error(`❌ generateWolfmenEvolution failed: ${err.message}`);
    throw err;
  }
}

/**
 * Fetch historical data for a team
 * @private
 */
function fetchTeamHistory_(teamId, maxGameweek) {
  const history = [];
  let previousRank = null;

  // Fetch data for each completed gameweek
  for (let gw = 1; gw <= maxGameweek; gw++) {
    try {
      const leagueData = getLeagueStandings_(CONFIG.MINI_LEAGUE_ID);
      const teamEntry = leagueData.standings.results.find(t => t.entry === teamId);

      if (!teamEntry) continue;

      const rank = teamEntry.rank;
      const rankChange = previousRank ? previousRank - rank : 0;

      history.push([
        gw,                      // Gameweek
        rank,                    // Rank
        teamEntry.event_total,   // GW Points
        teamEntry.total,         // Total Points
        rankChange === 0 ? '-' : (rankChange > 0 ? `↑${rankChange}` : `↓${Math.abs(rankChange)}`)
      ]);

      previousRank = rank;

      // Small delay to avoid rate limiting
      if (gw % 5 === 0) {
        Utilities.sleep(300);
      }
    } catch (e) {
      console.log(`⚠️ Could not fetch GW ${gw}: ${e.message}`);
    }
  }

  return history;
}

/**
 * Color code rank changes
 * @private
 */
function colorCodeRankChanges_(sheet, history) {
  history.forEach((row, idx) => {
    const rowNum = idx + 2; // +1 for header, +1 for 0-index
    const rankChangeStr = row[4];

    if (rankChangeStr === '-') return;

    const cell = sheet.getRange(rowNum, 5);

    if (rankChangeStr.startsWith('↑')) {
      // Improved rank - green
      cell.setBackground(COLORS_BASE.green_light)
          .setFontColor(COLORS_BASE.green_dark)
          .setFontWeight('bold');
    } else if (rankChangeStr.startsWith('↓')) {
      // Worse rank - red
      cell.setBackground(COLORS_BASE.red_light)
          .setFontColor(COLORS_BASE.red_dark)
          .setFontWeight('bold');
    }
  });
}

/**
 * Create evolution chart
 * @private
 */
function createEvolutionChart_(sheet, numRows) {
  // Remove existing charts
  const charts = sheet.getCharts();
  charts.forEach(chart => sheet.removeChart(chart));

  // Create line chart for rank evolution
  const chartRange = sheet.getRange(1, 1, numRows + 1, 2); // GW and Rank columns

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(chartRange)
    .setPosition(numRows + 3, 1, 0, 0)
    .setOption('title', `${CONFIG.TEAM_NAME} - Rank Evolution`)
    .setOption('width', 800)
    .setOption('height', 400)
    .setOption('legend', { position: 'bottom' })
    .setOption('hAxis', { title: 'Gameweek' })
    .setOption('vAxis', { title: 'Rank', direction: -1 }) // Inverted so rank 1 is at top
    .setOption('series', {
      0: { color: COLORS_BASE.self_font, lineWidth: 3 }
    })
    .build();

  sheet.insertChart(chart);

  console.log('📊 Evolution chart created');
}
