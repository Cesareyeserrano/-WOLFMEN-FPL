/*************************************************************
 * 🐺 WOLFMEN FPL TOOLS — MAIN
 * UI Menu and main dispatcher functions
 *
 * @author Cesar Eye Serrano
 * @email cesareyeserrano@gmail.com
 * @github https://github.com/Cesareyeserrano
 *************************************************************/

/**
 * Creates custom menu when spreadsheet opens
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🐺 FPL Tools')
    .addItem('📊 Update Standings', 'updateStandings')
    .addItem('👥 Generate Ownership DXP', 'generateOwnershipDXP')
    .addItem('📈 Generate Wolfmen Evolution', 'generateWolfmenEvolution')
    .addSeparator()
    .addItem('🔄 Update All', 'updateAll')
    .addSeparator()
    .addItem('🧹 Clear Cache', 'clearAllCache')
    .addSeparator()
    .addItem('📱 Show Dashboard', 'showDashboard')
    .addItem('📝 About / Acerca de', 'showAbout')
    .addToUi();

  console.log('✅ FPL Tools menu loaded');
}

/**
 * Update all modules at once
 */
function updateAll() {
  try {
    console.log('🚀 Starting full update...');

    updateStandings();
    console.log('✅ Standings updated');

    generateOwnershipDXP();
    console.log('✅ Ownership updated');

    generateWolfmenEvolution();
    console.log('✅ Evolution updated');

    SpreadsheetApp.getActiveSpreadsheet().toast(
      'All data updated successfully!',
      '🐺 FPL Tools',
      5
    );
    console.log('✅ Full update completed');
  } catch (err) {
    console.error(`❌ updateAll failed: ${err.message}`);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `Error: ${err.message}`,
      '❌ Update Failed',
      10
    );
    throw err;
  }
}

/**
 * Clear all cache entries
 */
function clearAllCache() {
  try {
    CacheService.getScriptCache().removeAll(
      CacheService.getScriptCache().getAll(null)
    );
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Cache cleared successfully!',
      '🧹 Cache',
      3
    );
    console.log('✅ Cache cleared');
  } catch (err) {
    console.error(`❌ clearAllCache failed: ${err.message}`);
  }
}
