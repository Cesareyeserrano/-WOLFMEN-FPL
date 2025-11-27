/*************************************************************
 * 🎨 COLOR UTILITIES
 * HSL interpolation and color manipulation
 *
 * @author Cesar Eye Serrano
 *************************************************************/

/**
 * Interpolate two hex colors in HSL space
 * @param {string} hex1 - Start color (hex)
 * @param {string} hex2 - End color (hex)
 * @param {number} t - Interpolation factor (0-1)
 * @returns {string} Interpolated color (hex)
 */
function interpolateHSL(hex1, hex2, t) {
  const c1 = hexToHSL(hex1);
  const c2 = hexToHSL(hex2);
  const h = c1.h + (c2.h - c1.h) * t;
  const s = c1.s + (c2.s - c1.s) * t;
  const l = c1.l + (c2.l - c1.l) * t;
  return hslToHex(h, s, l);
}

/**
 * Convert hex color to HSL
 * @param {string} hex - Hex color code
 * @returns {Object} HSL values {h, s, l}
 */
function hexToHSL(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

/**
 * Convert HSL to hex color
 * @param {number} h - Hue (0-1)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {string} Hex color code
 */
function hslToHex(h, s, l) {
  function f(n) {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  }
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Get color for differential value (green/red gradient)
 * @param {number} value - Differential value
 * @param {number} maxAbs - Maximum absolute value for scaling
 * @returns {string} Hex color code
 */
function getColorForDifferential(value, maxAbs) {
  if (value === 0) return '#ffffff';
  const isDark = value > 0;
  const lightColor = isDark ? COLORS_BASE.green_light : COLORS_BASE.red_light;
  const darkColor = isDark ? COLORS_BASE.green_dark : COLORS_BASE.red_dark;
  const t = Math.min(Math.abs(value) / maxAbs, 1);
  return interpolateHSL(lightColor, darkColor, t);
}
