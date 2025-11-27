# 🏗️ Arquitectura del Proyecto - Opciones

## Opción 1: Google Sheets (Actual)

### Stack
```
┌─────────────────────────────────┐
│   Google Sheets (Frontend)      │
│   - Visualización              │
│   - Tablas interactivas        │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Google Apps Script            │
│   - Lógica de negocio          │
│   - Procesamiento de datos     │
│   - Caché (6h TTL)            │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   FPL API                       │
│   - fantasy.premierleague.com  │
└─────────────────────────────────┘
```

### Flujo de Datos
```javascript
1. Usuario → Click "Update All"
2. Apps Script → Fetch FPL API
3. Apps Script → Procesar datos
4. Apps Script → Escribir a Sheets
5. Usuario → Ver resultados actualizados
```

### Pros/Cons
✅ Gratis, rápido, fácil de compartir
❌ Limitado, no escalable, sin ML

---

## Opción 2: Python + PostgreSQL + Next.js

### Stack Completo
```
┌─────────────────────────────────┐
│   Frontend (Next.js)            │
│   - React components            │
│   - TailwindCSS                │
│   - Charts (recharts)           │
│   - Vercel (free hosting)       │
└────────────┬────────────────────┘
             │ REST/GraphQL
┌────────────▼────────────────────┐
│   Backend (FastAPI/Python)      │
│   - API endpoints               │
│   - Business logic              │
│   - Data processing             │
│   - Railway/Render ($5/mo)      │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   PostgreSQL Database           │
│   - Players, teams, gameweeks  │
│   - Historical data             │
│   - User preferences            │
│   - Supabase (free tier)        │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   FPL API                       │
│   - fantasy.premierleague.com  │
└─────────────────────────────────┘
```

### Estructura de Proyecto
```
wolfmen-fpl/
├── backend/                    # FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── standings.py
│   │   │   │   │   ├── ownership.py
│   │   │   │   │   └── players.py
│   │   │   │   └── api.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   ├── models.py
│   │   │   └── session.py
│   │   ├── schemas/
│   │   │   ├── player.py
│   │   │   └── team.py
│   │   └── services/
│   │       ├── fpl_client.py
│   │       └── analytics.py
│   ├── alembic/                # DB migrations
│   ├── requirements.txt
│   └── main.py
│
├── frontend/                   # Next.js
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── standings/
│   │   │   ├── ownership/
│   │   │   └── evolution/
│   │   ├── api/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── charts/
│   │   └── tables/
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── package.json
│   └── next.config.js
│
├── shared/                     # Shared types/utils
│   └── types.ts
│
└── docker-compose.yml          # Local development
```

### Database Schema
```sql
-- players table
CREATE TABLE players (
  id INTEGER PRIMARY KEY,
  web_name VARCHAR(50),
  team_id INTEGER,
  position VARCHAR(3),
  price DECIMAL(4,1),
  total_points INTEGER,
  updated_at TIMESTAMP
);

-- gameweeks table
CREATE TABLE gameweeks (
  id INTEGER PRIMARY KEY,
  name VARCHAR(20),
  deadline TIMESTAMP,
  finished BOOLEAN,
  is_current BOOLEAN
);

-- team_picks table
CREATE TABLE team_picks (
  id SERIAL PRIMARY KEY,
  team_id INTEGER,
  gameweek_id INTEGER,
  player_id INTEGER,
  is_captain BOOLEAN,
  multiplier INTEGER,
  created_at TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (gameweek_id) REFERENCES gameweeks(id)
);

-- ownership_history table
CREATE TABLE ownership_history (
  id SERIAL PRIMARY KEY,
  player_id INTEGER,
  gameweek_id INTEGER,
  ownership_pct DECIMAL(5,2),
  differential DECIMAL(5,2),
  created_at TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (gameweek_id) REFERENCES gameweeks(id)
);

-- league_standings table
CREATE TABLE league_standings (
  id SERIAL PRIMARY KEY,
  team_id INTEGER,
  gameweek_id INTEGER,
  rank INTEGER,
  total_points INTEGER,
  gameweek_points INTEGER,
  created_at TIMESTAMP,
  FOREIGN KEY (gameweek_id) REFERENCES gameweeks(id)
);
```

### API Endpoints
```python
# backend/app/api/v1/endpoints/standings.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/standings/{league_id}")
async def get_standings(
    league_id: int,
    gameweek: int = None,
    db: Session = Depends(get_db)
):
    """Get current or historical standings"""
    # Fetch from DB or FPL API
    # Return processed data
    pass

@router.get("/standings/{league_id}/history")
async def get_standings_history(
    league_id: int,
    db: Session = Depends(get_db)
):
    """Get standings evolution over time"""
    pass

# backend/app/api/v1/endpoints/ownership.py

@router.get("/ownership/{league_id}/{gameweek}")
async def get_ownership_analysis(
    league_id: int,
    gameweek: int,
    db: Session = Depends(get_db)
):
    """Get ownership differential analysis"""
    pass

@router.get("/ownership/players/{player_id}/history")
async def get_player_ownership_history(
    player_id: int,
    db: Session = Depends(get_db)
):
    """Get player ownership over time"""
    pass
```

### Frontend Components
```typescript
// frontend/components/StandingsTable.tsx

import { useQuery } from '@tanstack/react-query';

export function StandingsTable({ leagueId }: { leagueId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['standings', leagueId],
    queryFn: () => fetch(`/api/standings/${leagueId}`).then(r => r.json())
  });

  if (isLoading) return <Skeleton />;

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>GW</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {data.standings.map(team => (
          <tr key={team.id} className={team.isYourTeam ? 'bg-yellow-100' : ''}>
            <td>{team.rank}</td>
            <td>{team.name}</td>
            <td>{team.gwPoints}</td>
            <td>{team.totalPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Data Flow
```
1. Cron Job (daily) → Trigger backend sync
2. Backend → Fetch FPL API
3. Backend → Process & store in PostgreSQL
4. Frontend → Query backend API
5. Frontend → Display with React components
6. User → Interactive filters, charts, analysis
```

### Deployment
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: wolfmen_fpl
      POSTGRES_USER: fpl_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://fpl_user:${DB_PASSWORD}@postgres:5432/wolfmen_fpl
      FPL_LEAGUE_ID: 371793
      YOUR_TEAM_ID: 3851196
    ports:
      - "8000:8000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Hosting Costs
```
Frontend (Vercel):        $0/mes (free tier)
Backend (Railway):        $5/mes (starter)
Database (Supabase):      $0/mes (free tier - 500MB)
Total:                    $5/mes

O completamente gratis con:
- Frontend: Vercel/Netlify
- Backend: Render free tier
- DB: Supabase free tier
```

---

## Opción 3: Arquitectura Híbrida (Recomendada)

### Stack
```
┌─────────────────────────────────┐
│   Google Sheets                 │
│   - Vista rápida para liga     │
│   - Compartir fácilmente       │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Next.js Dashboard             │
│   - Análisis avanzados         │
│   - Gráficos interactivos      │
│   - ML predictions             │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   FastAPI Backend               │
│   - API única                  │
│   - Servir a Sheets y Web      │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   PostgreSQL                    │
│   - Datos históricos           │
│   - Analytics                  │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   FPL API                       │
└─────────────────────────────────┘
```

### Ventajas
✅ Lo mejor de ambos mundos
✅ Sheets para usuarios casuales
✅ Web app para análisis profundos
✅ Migración gradual
✅ API reutilizable

---

## 🎯 Comparativa Final

| Característica | Sheets | Python+DB | Híbrida |
|---------------|--------|-----------|---------|
| Tiempo desarrollo | 2 días | 2 semanas | 1 semana |
| Costo | $0 | $5/mes | $5/mes |
| Facilidad uso | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Análisis avanzados | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Escalabilidad | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Portfolio | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Datos históricos | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| ML/Predicciones | ❌ | ✅ | ✅ |

---

## 📝 Recomendación Final

**Para tu caso (mini-league FPL):**

1. **Si solo quieres usar para tu liga:** → Sheets (ya está listo)
2. **Si quieres proyecto portfolio:** → Python + DB
3. **Si quieres ambos:** → Híbrida (mi favorita)

**Mi sugerencia:**
- Empezar con Sheets (2 días, listo para usar)
- Construir Python + DB en paralelo (2 semanas)
- Migrar gradualmente
- Mantener Sheets como "vista simple"

---

¿Qué opción prefieres? Puedo ayudarte a construir cualquiera de las 3 🚀
