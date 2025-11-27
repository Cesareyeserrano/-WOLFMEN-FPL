/*************************************************************
 * 🐺 WOLFMEN FPL TOOLS — WEB APP
 * Web dashboard functions for public access
 *
 * @author Cesar Eye Serrano
 * @email cesareyeserrano@gmail.com
 *************************************************************/

/**
 * Serves the web app dashboard
 * This function is called when someone visits the deployed web app URL
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('src/web/dashboard')
    .setTitle('🐺 Wolfmen FPL Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Shows the dashboard in a sidebar within Google Sheets
 */
function showDashboard() {
  const html = HtmlService.createHtmlOutputFromFile('src/web/dashboard')
    .setTitle('🐺 Wolfmen FPL Dashboard')
    .setWidth(400);

  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Shows an about dialog with author information
 */
function showAbout() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .container {
        background: white;
        border-radius: 10px;
        padding: 20px;
        color: #333;
      }
      h2 {
        color: #667eea;
        margin-bottom: 15px;
      }
      .info-section {
        margin: 15px 0;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 8px;
      }
      .author {
        font-size: 1.2em;
        font-weight: bold;
        color: #764ba2;
        margin: 10px 0;
      }
      a {
        color: #667eea;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 0.9em;
        color: #999;
      }
    </style>
    <div class="container">
      <h2>🐺 Wolfmen FPL Tools</h2>

      <div class="info-section">
        <strong>Versión:</strong> 1.0.0<br>
        <strong>Última actualización:</strong> Noviembre 2024
      </div>

      <div class="info-section">
        <p><strong>Desarrollado por:</strong></p>
        <p class="author">Cesar Eye Serrano</p>
        <p>Full Stack Developer | FPL Enthusiast</p>
        <p>
          📧 <a href="mailto:cesareyeserrano@gmail.com">cesareyeserrano@gmail.com</a><br>
          💻 <a href="https://github.com/Cesareyeserrano" target="_blank">GitHub: @Cesareyeserrano</a>
        </p>
      </div>

      <div class="info-section">
        <p><strong>Repositorio:</strong></p>
        <p><a href="https://github.com/Cesareyeserrano/-WOLFMEN-FPL" target="_blank">
          github.com/Cesareyeserrano/-WOLFMEN-FPL
        </a></p>
      </div>

      <div class="footer">
        <p>Made with 🐺 for Wolfmen FC</p>
        <p>© 2024 - Todos los derechos reservados</p>
      </div>
    </div>
  `)
    .setWidth(450)
    .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, '📝 Acerca de');
}
