# 🚀 DEPLOY TU DASHBOARD AHORA (2 MINUTOS)

## ✅ Tu dashboard React está LISTO

Ya tienes un dashboard completo en Next.js con:
- 📊 League Standings
- 👥 Ownership Differentials
- 🎨 UI moderna con Tailwind
- ⚡ Datos en tiempo real de FPL API
- 📱 Responsive (funciona en móvil)

---

## 🌐 Opción 1: Deploy con Vercel (GRATIS - RECOMENDADO)

### Paso 1: Ir a Vercel
👉 [https://vercel.com/new](https://vercel.com/new)

### Paso 2: Conectar GitHub
- Click "Continue with GitHub"
- Autorizar Vercel
- Importar repositorio: **Cesareyeserrano/-WOLFMEN-FPL**

### Paso 3: Configurar
```
Framework Preset: Next.js ✅ (auto-detected)
Root Directory: dashboard 👈 IMPORTANTE
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Paso 4: Deploy
- Click "Deploy"
- Esperar 2-3 minutos ⏱️
- ¡LISTO! 🎉

### Paso 5: Tu Link Público
```
https://wolfmen-fpl.vercel.app
o
https://tu-nombre-personalizado.vercel.app
```

**Comparte este link con tu mini-league!** 🐺

---

## 🔧 Opción 2: Deploy con Netlify (GRATIS - Alternativa)

### Paso 1: Ir a Netlify
👉 [https://app.netlify.com/start](https://app.netlify.com/start)

### Paso 2: Importar
- "Import from Git"
- Conectar GitHub
- Seleccionar: **Cesareyeserrano/-WOLFMEN-FPL**

### Paso 3: Configurar
```
Base directory: dashboard
Build command: npm run build
Publish directory: .next
```

### Paso 4: Deploy
- Click "Deploy site"
- Esperar 2-3 minutos
- ¡LISTO!

### Paso 5: Tu Link
```
https://wolfmen-fpl.netlify.app
```

---

## 📱 Opción 3: Deploy Local (para probar)

```bash
# En tu máquina local
cd dashboard
npm install
npm run dev

# Abre: http://localhost:3000
```

---

## ⚙️ Personalización (Opcional)

### Cambiar IDs de Liga/Team

Edita `dashboard/lib/types.ts`:

```typescript
export const CONFIG = {
  LEAGUE_ID: 371793,        // 👈 Tu liga
  YOUR_TEAM_ID: 3851196,    // 👈 Tu equipo
  TEAM_NAME: 'WOLFMEN FC',  // 👈 Tu nombre
};
```

### Cambiar Colores

Edita `dashboard/tailwind.config.ts`:

```typescript
colors: {
  wolfmen: {
    orange: '#f6b26b',  // 👈 Tu color
    black: '#000000',
  },
}
```

---

## 🔄 Auto-Deploy (cada vez que haces cambios)

Una vez conectado con Vercel/Netlify:

```bash
# Hacer cambios en el código
git add .
git commit -m "Actualización"
git push

# ¡Vercel/Netlify deployan automáticamente! 🚀
```

---

## 🎯 Siguientes Pasos

Una vez deployado:

1. ✅ **Comparte el link** con tu mini-league
2. ✅ **Pon el link** en tu bio de FPL
3. ✅ **Añade features** (gráficos, stats, etc.)
4. ✅ **Dominio custom** (opcional): wolfmenfpl.com

---

## 🐛 Troubleshooting

### "Build failed"
- Verifica que Root Directory = `dashboard`
- Check que Node version ≥ 18

### "Data not loading"
- La API de FPL puede tener rate limits
- Espera 1 minuto y recarga

### "404 Not Found"
- Asegúrate de que Root Directory está configurado

---

## 💡 Tips

- **Actualización automática**: Los datos se refrescan cada 10 min
- **Caching**: Vercel cachea las respuestas de la API
- **Performance**: Primera carga puede tardar 2-3 segundos
- **Gratis**: Vercel free tier es suficiente (100GB bandwidth/mes)

---

## 🌟 Resultado Final

Tu dashboard será accesible públicamente en:

```
✅ https://tu-app.vercel.app
✅ Sin login requerido
✅ Datos en tiempo real
✅ Responsive (móvil + desktop)
✅ Actualización automática
✅ 100% GRATIS
```

---

## 📸 Preview

El dashboard incluye:

**Pantalla 1: Standings**
- Tabla de clasificación
- Tu equipo destacado en naranja
- Puntos de GW y totales

**Pantalla 2: Ownership**
- Top 50 jugadores por diferencial
- Color verde = players que tienes que otros no
- Color rojo = players que no tienes pero otros sí

---

## 🎉 ¡YA ESTÁ TODO LISTO!

Solo tienes que:
1. Ir a Vercel
2. Importar el repo
3. Configurar root directory = `dashboard`
4. Deploy
5. ¡Compartir el link!

**Tiempo total: 2-3 minutos** ⏱️

---

**¿Necesitas ayuda? Avísame y te guío paso a paso! 🐺**
