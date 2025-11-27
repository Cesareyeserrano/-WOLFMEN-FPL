/*************************************************************
 * 🐺 WOLFMEN FPL TOOLS — MAIN
 * UI Menu and main dispatcher functions
 *************************************************************/

/**
 * Creates custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  // Main menu
  ui.createMenu('🐺 FPL Tools')
    // UI submenu
    .addSubMenu(ui.createMenu('🎨 Interfaz')
      .addItem('📊 Abrir Dashboard', 'showDashboard')
      .addItem('📌 Mostrar Sidebar', 'showSidebar')
      .addSeparator()
      .addItem('⚙️ Configuración', 'showConfigDialog'))
    .addSeparator()
    // Update submenu
    .addSubMenu(ui.createMenu('🔄 Actualizar')
      .addItem('🏆 Clasificación', 'updateStandings')
      .addItem('👥 Ownership DXP', 'generateOwnershipDXP')
      .addItem('📈 Evolución', 'generateWolfmenEvolution')
      .addSeparator()
      .addItem('🚀 Actualizar Todo', 'updateAll'))
    .addSeparator()
    // Utilities submenu
    .addSubMenu(ui.createMenu('🛠️ Utilidades')
      .addItem('🧹 Limpiar Cache', 'clearAllCache')
      .addItem('📋 Copiar IDs', 'showIdsInfo')
      .addItem('ℹ️ Acerca de', 'showAbout'))
    .addToUi();

  console.log('✅ FPL Tools menu loaded with enhanced UI');
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

/**
 * Show IDs information dialog
 */
function showIdsInfo() {
  const ui = SpreadsheetApp.getUi();
  const message = `
📋 TUS IDs CONFIGURADOS

League ID: ${CONFIG.LEAGUE_ID || 'No configurado'}
Team ID: ${CONFIG.TEAM_ID || 'No configurado'}

Para cambiar estos valores, usa:
🎨 Interfaz → ⚙️ Configuración

O edita directamente:
src/config/config.gs
  `;

  ui.alert('📋 IDs de Configuración', message, ui.ButtonSet.OK);
}

/**
 * Show about information
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  const message = `
🐺 WOLFMEN FPL TOOLS v2.0

Una herramienta completa para gestionar tu mini-league de Fantasy Premier League.

✨ Características:
• Dashboard interactivo moderno
• Análisis de clasificación en tiempo real
• Ownership y diferenciales (DXP)
• Seguimiento de evolución
• Interfaz moderna con temas claro/oscuro

🛠️ Tecnología:
• Google Apps Script
• HTML5 / CSS3 / JavaScript
• FPL API oficial

👨‍💻 Desarrollado por: Wolfmen Team
📦 Repositorio: github.com/Cesareyeserrano/-WOLFMEN-FPL
📄 Licencia: MIT

Made with ❤️ for Fantasy Premier League fans
  `;

  ui.alert('🐺 Acerca de Wolfmen FPL Tools', message, ui.ButtonSet.OK);
}
