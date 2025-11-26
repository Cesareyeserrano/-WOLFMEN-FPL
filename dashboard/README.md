# 🐺 Wolfmen FPL Dashboard

Modern React dashboard for Fantasy Premier League analytics.

## 🚀 Quick Deploy to Vercel (FREE)

### Option 1: Deploy via GitHub (Recommended - 2 minutes)

1. **Push this code to GitHub** (ya está hecho)

2. **Go to [Vercel](https://vercel.com)**
   - Sign up with GitHub (free)
   - Click "Add New Project"
   - Import your repository: `Cesareyeserrano/-WOLFMEN-FPL`

3. **Configure Project**
   - Framework Preset: Next.js ✅ (auto-detected)
   - Root Directory: `dashboard`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Click "Deploy"**
   - Wait 2-3 minutes ⏱️
   - Done! 🎉

5. **Get Your Public Link**
   - You'll get: `https://wolfmen-fpl.vercel.app`
   - Or custom: `https://your-custom-name.vercel.app`

### Option 2: Deploy via CLI (3 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from dashboard directory)
cd dashboard
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - What's your project's name? wolfmen-fpl
# - In which directory is your code located? ./
# - Auto-detected Next.js, continue? Yes

# Done! You'll get your public URL
```

## 🎨 Features

- ✅ **Real-time FPL data** from official API
- ✅ **League Standings** with your team highlighted
- ✅ **Ownership Analysis** with differentials color-coded
- ✅ **Responsive design** works on mobile/desktop
- ✅ **Auto-refresh** data every 10 minutes
- ✅ **Modern UI** with Tailwind CSS

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📊 Data Sources

- **FPL API**: `https://fantasy.premierleague.com/api`
- **League ID**: 371793
- **Your Team ID**: 3851196

To change IDs, edit `lib/types.ts`:

```typescript
export const CONFIG = {
  LEAGUE_ID: 371793,        // Your league
  YOUR_TEAM_ID: 3851196,    // Your team
  TEAM_NAME: 'WOLFMEN FC',
};
```

## 🌐 Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration steps

## 📱 Share Your Dashboard

Once deployed, share your link with your mini-league:
- ✅ No login required
- ✅ Updates automatically
- ✅ Works on all devices
- ✅ Fast and responsive

## 🔄 Auto-Deploy

Vercel will auto-deploy when you push to GitHub:
```bash
git add .
git commit -m "Update dashboard"
git push

# Vercel automatically deploys! 🚀
```

## 💡 Next Steps

- [ ] Add more statistics
- [ ] Add historical charts
- [ ] Add player price changes
- [ ] Add transfer suggestions
- [ ] Add mobile app version

---

**Made with 🐺 for Wolfmen FC**
