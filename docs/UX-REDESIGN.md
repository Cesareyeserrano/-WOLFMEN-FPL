# 🎨 Rediseño UX - Wolfmen FPL Tools v2.0

## 📋 Resumen

Este documento describe el rediseño completo de la experiencia de usuario (UX) de Wolfmen FPL Tools, transformando la herramienta de un simple script de Google Sheets a una aplicación moderna e interactiva.

---

## ✨ Nuevas Características

### 1. 📊 Dashboard Interactivo Web

**Ubicación:** `src/ui/dashboard.html`

Un dashboard moderno y responsive con las siguientes características:

#### Características Principales:
- **Diseño Moderno**: Interfaz limpia con gradientes y sombras suaves
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Tema Claro/Oscuro**: Cambio dinámico entre temas
- **Tiempo Real**: Actualización de datos con feedback visual
- **Estadísticas Destacadas**: Cards con métricas clave
  - Tu Posición en la liga
  - Puntos Totales
  - Puntos del Gameweek actual
  - Número de Diferenciales

#### Secciones del Dashboard:
1. **Clasificación**: Tabla ordenada con tu posición destacada
2. **Ownership**: Análisis de propiedad y diferenciales (DXP)
3. **Evolución**: Visualización de tendencias históricas

#### Características Visuales:
- Badges de ranking (oro, plata, bronce)
- Códigos de color para diferenciales positivos/negativos
- Animaciones suaves en hover y transiciones
- Barra de progreso para operaciones largas
- Overlay de carga con spinner animado

#### Cómo Acceder:
```
🐺 FPL Tools → 🎨 Interfaz → 📊 Abrir Dashboard
```

---

### 2. 📌 Sidebar de Navegación Rápida

**Ubicación:** `src/ui/sidebar.html`

Una barra lateral persistente para acceso rápido a todas las funciones.

#### Características:
- **Acciones Rápidas**: Botones para dashboard y actualización total
- **Actualizaciones Individuales**: Acceso directo a cada módulo
- **Estado del Sistema**:
  - Estado de la API FPL (Online/Offline)
  - Gameweek actual
  - Última actualización
- **Utilidades**: Configuración y limpieza de cache
- **Auto-refresh**: Actualización automática del estado cada 5 minutos

#### Cómo Acceder:
```
🐺 FPL Tools → 🎨 Interfaz → 📌 Mostrar Sidebar
```

---

### 3. ⚙️ Diálogo de Configuración

**Ubicación:** `src/ui/config-dialog.html`

Interfaz gráfica para configurar IDs sin editar código.

#### Características:
- **Formulario Intuitivo**: Campos claros para League ID y Team ID
- **Guías Visuales**: Instrucciones paso a paso para encontrar tus IDs
- **Validación**: Verificación de datos antes de guardar
- **Feedback Visual**: Alertas de éxito/error
- **Vista de Configuración Actual**: Muestra los valores actuales antes de cambiar

#### Nota Importante:
Los cambios en el diálogo son **temporales** (solo para la sesión actual). Para cambios permanentes, edita `src/config/config.gs`.

#### Cómo Acceder:
```
🐺 FPL Tools → 🎨 Interfaz → ⚙️ Configuración
```

---

### 4. 📈 Módulo Evolution Completo

**Ubicación:** `src/modules/evolution.gs`

Implementación completa del seguimiento histórico de rendimiento.

#### Datos Rastreados:
- **Puntos por Gameweek**: Tu rendimiento cada semana
- **Puntos Totales**: Acumulado histórico
- **Ranking**: Posición en la liga
- **Cambio de Rank**: Mejoras o caídas respecto a la semana anterior
- **Promedio GW**: Puntuación promedio de todos los managers
- **vs Promedio**: Diferencia con el promedio
- **Puntos de Banco**: Puntos dejados en el banquillo
- **Transferencias**: Número de transferencias realizadas

#### Gráficos Automáticos:
1. **📊 Puntos por Gameweek**: Línea comparativa con el promedio
2. **📈 Evolución Puntos Totales**: Gráfico de área del acumulado
3. **🏆 Evolución Ranking**: Línea invertida (arriba = mejor)

#### Formato Visual:
- **Colores Condicionales**:
  - Verde: Mejoras de ranking o rendimiento superior al promedio
  - Rojo: Caídas de ranking o rendimiento inferior
- **Resaltado**: Cambios significativos en negrita

---

### 5. 🎨 Menú Rediseñado

**Ubicación:** `src/main.gs`

Menú reorganizado en submenús temáticos.

#### Estructura Nueva:

```
🐺 FPL Tools
├── 🎨 Interfaz
│   ├── 📊 Abrir Dashboard
│   ├── 📌 Mostrar Sidebar
│   └── ⚙️ Configuración
│
├── 🔄 Actualizar
│   ├── 🏆 Clasificación
│   ├── 👥 Ownership DXP
│   ├── 📈 Evolución
│   └── 🚀 Actualizar Todo
│
└── 🛠️ Utilidades
    ├── 🧹 Limpiar Cache
    ├── 📋 Copiar IDs
    └── ℹ️ Acerca de
```

#### Ventajas:
- Organización lógica por tipo de acción
- Menos saturación visual
- Fácil acceso a funciones específicas
- Nuevas opciones de utilidad

---

## 🎨 Sistema de Diseño

### Paleta de Colores

#### Tema Claro:
```css
--primary-color: #37003c      (FPL Purple)
--secondary-color: #00ff87    (FPL Green)
--accent-color: #f6b26b       (Orange)
--success-color: #21f421      (Green)
--danger-color: #f66060       (Red)
--bg-primary: #ffffff         (White)
--bg-secondary: #f8f9fa       (Light Gray)
--bg-card: #ffffff            (White)
--text-primary: #212529       (Dark Gray)
--text-secondary: #6c757d     (Medium Gray)
--border-color: #dee2e6       (Light Border)
```

#### Tema Oscuro:
```css
--primary-color: #00ff87      (FPL Green)
--secondary-color: #37003c    (FPL Purple)
--accent-color: #f6b26b       (Orange)
--bg-primary: #1a1a1a         (Very Dark)
--bg-secondary: #2d2d2d       (Dark)
--bg-card: #242424            (Card Dark)
--text-primary: #ffffff       (White)
--text-secondary: #b0b0b0     (Light Gray)
--border-color: #404040       (Dark Border)
```

### Tipografía:
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Line Height**: 1.6 para legibilidad
- **Font Weights**:
  - Regular (400): Texto normal
  - Semi-bold (600): Labels y subtítulos
  - Bold (700): Títulos y valores destacados

### Espaciado:
- **Padding Cards**: 1.5rem
- **Gap Grid**: 1.5rem
- **Margins**: Sistema de 0.5rem increments

### Sombras:
```css
--shadow-sm: 0 2px 4px rgba(0,0,0,0.1)
--shadow-md: 0 4px 6px rgba(0,0,0,0.15)
--shadow-lg: 0 8px 16px rgba(0,0,0,0.2)
```

---

## 🚀 Funcionalidades Backend

### Nuevas Funciones (`src/ui/ui-handlers.gs`)

#### `showDashboard()`
Muestra el dashboard principal en un modal de 1200x800px.

#### `showSidebar()`
Muestra la barra lateral de navegación rápida.

#### `showConfigDialog()`
Abre el diálogo de configuración.

#### `getDashboardData()`
Consolida todos los datos necesarios para el dashboard:
- Estadísticas del usuario
- Clasificación completa
- Datos de ownership
- Cuenta de diferenciales

#### `updateAllData()`
Actualiza todos los módulos desde el dashboard.

#### `getApiStatus()`
Verifica el estado de la API FPL y retorna:
- Estado (online/offline)
- Gameweek actual
- Próximo deadline
- Número total de jugadores

#### `getConfig()` / `updateConfig()`
Lee y actualiza la configuración del sistema.

---

## 📊 Mejoras en Visualización de Datos

### Clasificación (Standings)
- **Badges Visuales**: Medallas para top 3
- **Resaltado Usuario**: Fondo especial y borde para tu equipo
- **Hover Effects**: Información al pasar el mouse

### Ownership/DXP
- **Gradientes de Color**: Verde para tus diferenciales, rojo para jugadores populares que no tienes
- **Badge de Propiedad**: Checkmark (✓) para jugadores en tu equipo
- **Ordenamiento**: Por valor absoluto del diferencial
- **Formato Numérico**: +/- para claridad visual

### Evolución
- **Gráficos Interactivos**: 3 gráficos automáticos
- **Colores Condicionales**: En tabla de datos
- **Formato de Cambios**: +/- para mejoras/caídas
- **Comparación con Promedio**: En tiempo real

---

## 🔧 Configuración Mejorada

### Archivo de Configuración Actualizado

**Nueva Estructura** (`src/config/config.gs`):

```javascript
const CONFIG = {
  // IDs
  LEAGUE_ID: 371793,
  TEAM_ID: 3851196,

  // Sheet Names
  SHEET_NAMES: {
    STANDINGS: 'Standings',
    OWNERSHIP: 'Ownership',
    EVOLUTION: 'Wolfmen Evolution'
  },

  // API Endpoints
  API: {
    BASE: 'https://fantasy.premierleague.com/api',
    BOOTSTRAP: '...',
    LEAGUE: '...',
    PICKS: '...',
    ENTRY: '...'
  },

  // Colors
  COLORS: {
    HEADER: '#d9d9d9',
    SELF: { BG: '#000000', FONT: '#f6b26b' },
    DIFFERENTIAL: {
      DARK_GREEN: '#21f421',
      LIGHT_GREEN: '#ebfef0',
      DARK_RED: '#f66060',
      LIGHT_RED: '#fff6f6'
    }
  }
};
```

#### Características:
- **Nombres Consistentes**: API, SHEET_NAMES, LEAGUE_ID
- **Retrocompatibilidad**: Mantiene nombres antiguos
- **Organización Clara**: Agrupación lógica
- **Colores Estructurados**: Jerarquía clara

---

## 📱 Responsive Design

### Breakpoints:
- **Desktop**: > 768px - Layout completo
- **Mobile**: ≤ 768px - Layout adaptado
  - Grid de stats: 1 columna
  - Tabs compactos
  - Fuentes más pequeñas
  - Padding reducido

### Optimizaciones Móviles:
- Header apilado verticalmente
- Botones de ancho completo
- Tablas con scroll horizontal
- Fuentes responsivas

---

## ⚡ Performance

### Mejoras Implementadas:

1. **Caching Inteligente**:
   - Bootstrap: 6 horas
   - Standings: 1 hora
   - Team Picks: 30 minutos

2. **Rate Limiting**:
   - 500ms entre requests de Evolution
   - Previene bloqueos de la API FPL

3. **Lazy Loading**:
   - Dashboard carga datos bajo demanda
   - Tabs solo cargan contenido cuando se activan

4. **Optimización de Requests**:
   - Consolidación de datos en `getDashboardData()`
   - Una sola llamada para todo el dashboard

---

## 🎯 Experiencia de Usuario

### Feedback Visual:

1. **Toasts Informativos**:
   - Confirmación de acciones
   - Mensajes de error claros
   - Duración apropiada (3-10s)

2. **Loading States**:
   - Spinner animado
   - Barra de progreso
   - Overlay con mensaje descriptivo
   - Botones deshabilitados durante operaciones

3. **Hover Effects**:
   - Cards elevan ligeramente
   - Cambios de color suaves
   - Cursor pointer en elementos clicables

4. **Transiciones Suaves**:
   - 0.3s ease para la mayoría
   - Tema cambia sin parpadeos
   - Tabs con fade

### Accesibilidad:

- **Contraste**: WCAG AA compliant
- **Fuentes**: Tamaños legibles (min 0.75rem)
- **Navegación**: Teclado-friendly
- **Semántica**: HTML5 apropiado
- **Alt Text**: Para iconos importantes

---

## 🔄 Flujo de Trabajo Mejorado

### Antes:
```
1. Abrir Google Sheet
2. Click menú "FPL Tools"
3. Click función específica
4. Esperar sin feedback visual
5. Revisar hoja actualizada
```

### Ahora:
```
1. Abrir Google Sheet
2. Click "FPL Tools" → "Interfaz" → "Mostrar Sidebar"
   (O "Abrir Dashboard" para vista completa)
3. Sidebar permanece visible
4. Click cualquier acción con feedback inmediato
5. Ver resultados en dashboard interactivo
6. Cambiar entre tabs sin recargar
7. Alternar tema según preferencia
```

---

## 📈 Roadmap Futuro

### Próximas Mejoras Sugeridas:

#### v2.1
- [ ] Notificaciones push antes del deadline
- [ ] Comparación con competidores específicos
- [ ] Predicciones de puntos basadas en fixtures
- [ ] Export de datos a PDF/Excel

#### v2.2
- [ ] PWA (Progressive Web App) independiente
- [ ] API propia para datos históricos
- [ ] Machine Learning para recomendaciones
- [ ] Integración con Twitter/Social media

#### v2.3
- [ ] Multi-liga support
- [ ] Head-to-head tracking
- [ ] Custom leagues ranking
- [ ] Premium features (si se requiere)

---

## 🐛 Troubleshooting

### Problemas Comunes:

#### 1. Dashboard no carga
**Solución**:
- Verifica que todos los archivos en `src/ui/` existan
- Revisa permisos de Google Apps Script
- Comprueba console logs en el navegador

#### 2. Datos no actualizan
**Solución**:
- Limpia el cache: `🛠️ Utilidades → 🧹 Limpiar Cache`
- Verifica conexión a internet
- Comprueba que IDs sean correctos

#### 3. Gráficos de Evolution no aparecen
**Solución**:
- Asegúrate de tener datos para al menos 2 gameweeks
- Verifica que la función `createEvolutionCharts()` se ejecute
- Revisa permisos de creación de gráficos

#### 4. Sidebar desaparece
**Solución**:
- La sidebar se cierra si recargas la hoja
- Vuélvela a abrir desde el menú
- Considera usar el Dashboard en su lugar

---

## 📝 Notas de Desarrollo

### Estructura de Archivos Creada:

```
src/
├── ui/
│   ├── dashboard.html        (Dashboard principal)
│   ├── sidebar.html          (Sidebar de navegación)
│   ├── config-dialog.html    (Diálogo de configuración)
│   └── ui-handlers.gs        (Backend para UI)
│
├── modules/
│   └── evolution.gs          (Módulo Evolution completo)
│
├── config/
│   └── config.gs             (Configuración mejorada)
│
└── main.gs                   (Menú rediseñado)
```

### Dependencias:
- **Google Apps Script**: V8 Runtime
- **Google Sheets API**: Para manipulación de hojas
- **HTML Service**: Para UIs personalizadas
- **Charts Service**: Para gráficos de Evolution

### Compatibilidad:
- ✅ Google Chrome (latest)
- ✅ Mozilla Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (responsive)

---

## 🎓 Guía de Uso Rápida

### Para Usuarios Nuevos:

1. **Primer Uso**:
   ```
   1. Abre tu Google Sheet con Wolfmen FPL Tools
   2. Click: 🐺 FPL Tools → 🎨 Interfaz → ⚙️ Configuración
   3. Ingresa tu League ID y Team ID
   4. Guarda cambios
   5. Click: 🎨 Interfaz → 📊 Abrir Dashboard
   6. Click "🔄 Actualizar Todo"
   7. Explora las 3 tabs: Clasificación, Ownership, Evolución
   ```

2. **Uso Diario**:
   ```
   1. Abre Sheet
   2. Click: 🎨 Interfaz → 📌 Mostrar Sidebar
   3. Click "🔄 Actualizar Todo" en sidebar
   4. Revisa stats en dashboard o sheets
   ```

3. **Análisis Profundo**:
   ```
   1. Abre Dashboard
   2. Tab "Ownership" → identifica diferenciales (DXP > 30)
   3. Tab "Evolución" → analiza tendencias
   4. Compara tus puntos con el promedio
   5. Revisa puntos dejados en el banco
   ```

### Para Desarrolladores:

1. **Añadir Nueva Funcionalidad al Dashboard**:
   ```javascript
   // En ui-handlers.gs
   function getMiNuevosDatos() {
     // Lógica para obtener datos
     return datos;
   }

   // En dashboard.html
   google.script.run
     .withSuccessHandler((data) => {
       // Renderizar datos
     })
     .getMiNuevosDatos();
   ```

2. **Crear Nuevo Módulo**:
   ```javascript
   // En src/modules/mi-modulo.gs
   function generateMiModulo() {
     const sheet = getOrCreateSheet('MiModulo');
     // Lógica del módulo
   }

   // Agregar al menú en main.gs
   .addItem('🆕 Mi Módulo', 'generateMiModulo')
   ```

3. **Personalizar Tema**:
   ```css
   /* En dashboard.html <style> */
   :root {
     --primary-color: #TU_COLOR;
     --secondary-color: #TU_COLOR;
     /* etc... */
   }
   ```

---

## 📄 Licencia

Este rediseño mantiene la licencia MIT del proyecto original.

---

## 👏 Agradecimientos

- **FPL API**: Por proporcionar datos gratuitos
- **Google Apps Script**: Por la plataforma
- **Comunidad Wolfmen**: Por el feedback

---

## 📞 Soporte

Para reportar bugs o solicitar features:
- **GitHub Issues**: [github.com/Cesareyeserrano/-WOLFMEN-FPL/issues](https://github.com/Cesareyeserrano/-WOLFMEN-FPL/issues)
- **Email**: cesareyeserrano@gmail.com

---

**Versión**: 2.0
**Fecha**: Noviembre 2025
**Autor**: Wolfmen Team

Made with ❤️ for Fantasy Premier League fans 🐺⚽
