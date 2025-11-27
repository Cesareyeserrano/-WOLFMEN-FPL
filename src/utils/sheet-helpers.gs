/*************************************************************
 * 📊 SHEET HELPERS
 * Google Sheets utilities and formatting
 *
 * @author Cesar Eye Serrano
 *************************************************************/

/**
 * Create or retrieve a sheet by name
 * @param {string} name - Sheet name
 * @returns {Sheet} Google Sheets object
 */
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    console.log(`✨ Created new sheet: ${name}`);
  }
  return sheet;
}

/**
 * Apply header formatting
 * @param {Sheet} sheet - Target sheet
 * @param {number} cols - Number of columns
 */
function formatHeader(sheet, cols) {
  const range = sheet.getRange(1, 1, 1, cols);
  range.setFontWeight('bold')
       .setBackground(COLORS_BASE.header)
       .setHorizontalAlignment('center');
}

/**
 * Clear all formats in a sheet before repainting
 * @param {Sheet} sheet - Target sheet
 */
function clearFormatting(sheet) {
  const range = sheet.getDataRange();
  range.clearFormat();
}

/**
 * Auto-resize columns to fit content
 * @param {Sheet} sheet - Target sheet
 * @param {number} numCols - Number of columns to resize
 */
function autoResizeColumns(sheet, numCols) {
  for (let i = 1; i <= numCols; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Freeze header row
 * @param {Sheet} sheet - Target sheet
 */
function freezeHeader(sheet) {
  sheet.setFrozenRows(1);
}

/**
 * Clear sheet content but keep formatting
 * @param {Sheet} sheet - Target sheet
 */
function clearContent(sheet) {
  if (sheet.getLastRow() > 0) {
    sheet.getDataRange().clearContent();
  }
}

/**
 * Clear everything from a sheet
 * @param {Sheet} sheet - Target sheet
 */
function clearSheet(sheet) {
  sheet.clear();
}
