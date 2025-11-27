/**
 * UI Handlers for FPL Dashboard
 * Manages HTML UI components and data provision
 */

/**
 * Show the main dashboard
 */
function showDashboard() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('src/ui/dashboard')
      .setTitle('🐺 Wolfmen FPL Dashboard')
      .setWidth(1200)
      .setHeight(800);

    SpreadsheetApp.getUi().showModalDialog(html, 'Wolfmen FPL Dashboard');
    Logger.log('✅ Dashboard shown successfully');
  } catch (error) {
    Logger.log('❌ Error showing dashboard: ' + error.message);
    SpreadsheetApp.getUi().alert('Error al abrir el dashboard: ' + error.message);
  }
}

/**
 * Show the sidebar for quick navigation
 */
function showSidebar() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('src/ui/sidebar')
      .setTitle('🐺 FPL Tools');

    SpreadsheetApp.getUi().showSidebar(html);
    Logger.log('✅ Sidebar shown successfully');
  } catch (error) {
    Logger.log('❌ Error showing sidebar: ' + error.message);
    SpreadsheetApp.getUi().alert('Error al abrir el sidebar: ' + error.message);
  }
}

/**
 * Show configuration dialog
 */
function showConfigDialog() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('src/ui/config-dialog')
      .setTitle('⚙️ Configuración')
      .setWidth(600)
      .setHeight(500);

    SpreadsheetApp.getUi().showModalDialog(html, 'Configuración FPL');
    Logger.log('✅ Config dialog shown successfully');
  } catch (error) {
    Logger.log('❌ Error showing config dialog: ' + error.message);
    SpreadsheetApp.getUi().alert('Error al abrir configuración: ' + error.message);
  }
}

/**
 * Get current configuration
 */
function getConfig() {
  return {
    leagueId: CONFIG.LEAGUE_ID,
    teamId: CONFIG.TEAM_ID,
    sheetNames: {
      standings: CONFIG.SHEET_NAMES.STANDINGS,
      ownership: CONFIG.SHEET_NAMES.OWNERSHIP,
      evolution: CONFIG.SHEET_NAMES.EVOLUTION
    }
  };
}

/**
 * Update configuration
 */
function updateConfig(newConfig) {
  try {
    // Note: This updates the config in memory only
    // For persistent changes, users need to update config.gs directly
    if (newConfig.leagueId) CONFIG.LEAGUE_ID = newConfig.leagueId;
    if (newConfig.teamId) CONFIG.TEAM_ID = newConfig.teamId;

    Logger.log('✅ Configuration updated (in memory)');
    return { success: true, message: 'Configuración actualizada. Reinicia para aplicar cambios permanentes.' };
  } catch (error) {
    Logger.log('❌ Error updating config: ' + error.message);
    return { success: false, message: 'Error: ' + error.message };
  }
}

/**
 * Get dashboard data
 * Consolidates all data needed for the dashboard
 */
function getDashboardData() {
  try {
    Logger.log('ℹ️ Fetching dashboard data...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const standingsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.STANDINGS);
    const ownershipSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.OWNERSHIP);

    const data = {
      yourRank: null,
      totalPoints: null,
      gwPoints: null,
      differentialCount: null,
      standings: [],
      ownership: []
    };

    // Get standings data
    if (standingsSheet) {
      const standingsData = standingsSheet.getDataRange().getValues();
      if (standingsData.length > 1) {
        // Skip header row
        for (let i = 1; i < standingsData.length; i++) {
          const row = standingsData[i];
          const entry = {
            rank: row[0],
            teamName: row[1],
            managerName: row[2],
            gwPoints: row[3],
            totalPoints: row[4],
            isUser: false
          };

          // Check if this is the user's team
          const bgColor = standingsSheet.getRange(i + 1, 1).getBackground();
          if (bgColor === '#000000' || bgColor === '#000') {
            entry.isUser = true;
            data.yourRank = entry.rank;
            data.totalPoints = entry.totalPoints;
            data.gwPoints = entry.gwPoints;
          }

          data.standings.push(entry);
        }
      }
    }

    // Get ownership data
    if (ownershipSheet) {
      const ownershipData = ownershipSheet.getDataRange().getValues();
      if (ownershipData.length > 1) {
        let diffCount = 0;

        // Skip header row
        for (let i = 1; i < ownershipData.length; i++) {
          const row = ownershipData[i];
          const yours = row[5] === '✓' || row[5] === true;
          const dxp = parseFloat(row[6]) || 0;

          if (yours && Math.abs(dxp) > 20) {
            diffCount++;
          }

          data.ownership.push({
            name: row[0],
            team: row[1],
            position: row[2],
            ownership: parseFloat(row[3]) || 0,
            yours: yours,
            dxp: dxp
          });
        }

        data.differentialCount = diffCount;
      }
    }

    Logger.log('✅ Dashboard data fetched successfully');
    return data;

  } catch (error) {
    Logger.log('❌ Error fetching dashboard data: ' + error.message);
    return { error: error.message };
  }
}

/**
 * Update all data (called from dashboard)
 */
function updateAllData() {
  try {
    Logger.log('ℹ️ Updating all data from dashboard...');

    // Update standings
    updateStandings();

    // Update ownership
    generateOwnership();

    Logger.log('✅ All data updated successfully');
    return { success: true };

  } catch (error) {
    Logger.log('❌ Error updating data: ' + error.message);
    throw new Error(error.message);
  }
}

/**
 * Clear all caches
 */
function clearAllCaches() {
  try {
    clearCache();
    Logger.log('✅ All caches cleared');
    return { success: true, message: 'Cache limpiado exitosamente' };
  } catch (error) {
    Logger.log('❌ Error clearing cache: ' + error.message);
    return { success: false, message: 'Error: ' + error.message };
  }
}

/**
 * Get FPL API status
 */
function getApiStatus() {
  try {
    const bootstrap = fetchBootstrapData();

    if (bootstrap && bootstrap.events) {
      const currentGw = bootstrap.events.find(event => event.is_current);

      return {
        status: 'online',
        currentGameweek: currentGw ? currentGw.id : null,
        nextDeadline: currentGw ? currentGw.deadline_time : null,
        totalPlayers: bootstrap.elements ? bootstrap.elements.length : null
      };
    }

    return { status: 'unknown' };

  } catch (error) {
    Logger.log('❌ Error checking API status: ' + error.message);
    return { status: 'offline', error: error.message };
  }
}
