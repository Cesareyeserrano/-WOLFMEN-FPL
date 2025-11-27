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

    const bootstrap = fetchBootstrapData();
    const currentEvent = bootstrap.events.find(e => e.is_current);

    if (!currentEvent) {
      throw new Error('No current gameweek found');
    }

    const sheet = getOrCreateSheet(CONFIG.SHEET_NAMES.EVOLUTION);
    sheet.clear();

    // Set up headers with styling
    const headers = [
      'Gameweek',
      'Puntos GW',
      'Total',
      'Ranking',
      'Cambio Rank',
      'Promedio GW',
      'vs Promedio',
      'Puntos Banco',
      'Transferencias'
    ];

    sheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setBackground(CONFIG.COLORS.HEADER)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    sheet.setFrozenRows(1);

    // Fetch evolution data for all completed gameweeks
    const evolutionData = [];
    let previousRank = null;

    for (let gw = 1; gw <= currentEvent.id; gw++) {
      try {
        console.log(`ℹ️ Fetching data for GW${gw}...`);

        // Get team picks and info for this GW
        const picksUrl = `${CONFIG.API.PICKS}/${CONFIG.TEAM_ID}/event/${gw}/picks/`;
        const picksResponse = fetchWithRetry(picksUrl);

        if (!picksResponse || !picksResponse.entry_history) {
          console.log(`⚠️ No data for GW${gw}, skipping`);
          continue;
        }

        const history = picksResponse.entry_history;
        const picks = picksResponse.picks || [];

        // Calculate bench points
        let benchPoints = 0;
        picks.forEach(pick => {
          if (pick.position > 11) { // Players on bench
            const player = bootstrap.elements.find(p => p.id === pick.element);
            if (player && player.event_points) {
              benchPoints += player.event_points;
            }
          }
        });

        // Get league standings for this GW to find rank
        let rank = '-';
        try {
          const leagueUrl = `${CONFIG.API.LEAGUE}/${CONFIG.LEAGUE_ID}/standings/?page_new_entries=1&page_standings=1`;
          const leagueData = fetchWithRetry(leagueUrl);

          if (leagueData && leagueData.standings && leagueData.standings.results) {
            const entry = leagueData.standings.results.find(e => e.entry === CONFIG.TEAM_ID);
            if (entry) {
              rank = entry.rank;
            }
          }
        } catch (e) {
          console.log(`⚠️ Could not fetch rank for GW${gw}: ${e.message}`);
        }

        // Calculate rank change
        let rankChange = '-';
        if (rank !== '-' && previousRank !== null && previousRank !== '-') {
          rankChange = previousRank - rank; // Positive = improved
        }
        previousRank = rank;

        // Get average points for this GW
        const gwEvent = bootstrap.events.find(e => e.id === gw);
        const averageScore = gwEvent ? gwEvent.average_score : 0;
        const vsAverage = history.points - averageScore;

        evolutionData.push([
          gw,
          history.points,
          history.total_points,
          rank,
          rankChange === '-' ? '-' : (rankChange > 0 ? `+${rankChange}` : rankChange),
          Math.round(averageScore),
          vsAverage > 0 ? `+${vsAverage}` : vsAverage,
          benchPoints,
          history.event_transfers || 0
        ]);

      } catch (err) {
        console.log(`⚠️ Error fetching GW${gw}: ${err.message}`);
      }

      // Rate limiting - wait between requests
      if (gw < currentEvent.id) {
        Utilities.sleep(500);
      }
    }

    // Write data to sheet
    if (evolutionData.length > 0) {
      const dataRange = sheet.getRange(2, 1, evolutionData.length, headers.length);
      dataRange.setValues(evolutionData);

      // Format columns
      sheet.autoResizeColumns(1, headers.length);

      // Apply conditional formatting for rank changes
      const rankChangeCol = 5;
      for (let i = 0; i < evolutionData.length; i++) {
        const row = i + 2;
        const cell = sheet.getRange(row, rankChangeCol);
        const value = evolutionData[i][rankChangeCol - 1];

        if (value !== '-') {
          const numValue = parseInt(value);
          if (numValue > 0) {
            cell.setBackground(CONFIG.COLORS.DIFFERENTIAL.LIGHT_GREEN)
              .setFontColor(CONFIG.COLORS.DIFFERENTIAL.DARK_GREEN)
              .setFontWeight('bold');
          } else if (numValue < 0) {
            cell.setBackground(CONFIG.COLORS.DIFFERENTIAL.LIGHT_RED)
              .setFontColor(CONFIG.COLORS.DIFFERENTIAL.DARK_RED)
              .setFontWeight('bold');
          }
        }
      }

      // Apply conditional formatting for vs average
      const vsAvgCol = 7;
      for (let i = 0; i < evolutionData.length; i++) {
        const row = i + 2;
        const cell = sheet.getRange(row, vsAvgCol);
        const value = evolutionData[i][vsAvgCol - 1];

        if (typeof value === 'number' || (typeof value === 'string' && value.includes('+'))) {
          const numValue = typeof value === 'number' ? value : parseInt(value);
          if (numValue > 0) {
            cell.setFontWeight('bold')
              .setFontColor(CONFIG.COLORS.DIFFERENTIAL.DARK_GREEN);
          } else if (numValue < 0) {
            cell.setFontWeight('bold')
              .setFontColor(CONFIG.COLORS.DIFFERENTIAL.DARK_RED);
          }
        }
      }

      // Create charts
      createEvolutionCharts(sheet, evolutionData.length);

      console.log(`✅ Evolution data populated with ${evolutionData.length} gameweeks`);
    }

    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Evolution data updated successfully!',
      '📈 Evolution',
      3
    );

    console.log('✅ Wolfmen Evolution generated');
  } catch (err) {
    console.error(`❌ generateWolfmenEvolution failed: ${err.message}`);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `Error: ${err.message}`,
      '❌ Evolution Failed',
      10
    );
    throw err;
  }
}

/**
 * Create evolution charts
 */
function createEvolutionCharts(sheet, dataRows) {
  try {
    // Remove existing charts
    const charts = sheet.getCharts();
    charts.forEach(chart => sheet.removeChart(chart));

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Chart 1: Points per GW (Line Chart)
    const pointsChart = sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sheet.getRange(1, 1, dataRows + 1, 1)) // Gameweek
      .addRange(sheet.getRange(1, 2, dataRows + 1, 1)) // Points GW
      .addRange(sheet.getRange(1, 6, dataRows + 1, 1)) // Average GW
      .setPosition(2, 10, 0, 0)
      .setOption('title', '📊 Puntos por Gameweek')
      .setOption('width', 600)
      .setOption('height', 300)
      .setOption('legend', { position: 'bottom' })
      .setOption('hAxis', { title: 'Gameweek' })
      .setOption('vAxis', { title: 'Puntos' })
      .setOption('series', {
        0: { color: '#37003c', lineWidth: 3 },
        1: { color: '#e90052', lineWidth: 2, lineDashStyle: [4, 4] }
      })
      .build();

    sheet.insertChart(pointsChart);

    // Chart 2: Total Points Evolution (Area Chart)
    const totalChart = sheet.newChart()
      .setChartType(Charts.ChartType.AREA)
      .addRange(sheet.getRange(1, 1, dataRows + 1, 1)) // Gameweek
      .addRange(sheet.getRange(1, 3, dataRows + 1, 1)) // Total Points
      .setPosition(18, 10, 0, 0)
      .setOption('title', '📈 Evolución Puntos Totales')
      .setOption('width', 600)
      .setOption('height', 300)
      .setOption('legend', { position: 'none' })
      .setOption('hAxis', { title: 'Gameweek' })
      .setOption('vAxis', { title: 'Puntos Totales' })
      .setOption('series', {
        0: { color: '#00ff87', areaOpacity: 0.3 }
      })
      .build();

    sheet.insertChart(totalChart);

    // Chart 3: Rank Evolution (Line Chart, inverted)
    const rankChart = sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sheet.getRange(1, 1, dataRows + 1, 1)) // Gameweek
      .addRange(sheet.getRange(1, 4, dataRows + 1, 1)) // Rank
      .setPosition(34, 10, 0, 0)
      .setOption('title', '🏆 Evolución Ranking')
      .setOption('width', 600)
      .setOption('height', 300)
      .setOption('legend', { position: 'none' })
      .setOption('hAxis', { title: 'Gameweek' })
      .setOption('vAxis', { title: 'Ranking', direction: -1 }) // Inverted so up is better
      .setOption('series', {
        0: { color: '#f6b26b', lineWidth: 3 }
      })
      .build();

    sheet.insertChart(rankChart);

    console.log('✅ Evolution charts created');
  } catch (err) {
    console.log(`⚠️ Error creating charts: ${err.message}`);
  }
}
