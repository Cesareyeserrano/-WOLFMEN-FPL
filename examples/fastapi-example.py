"""
Ejemplo de cómo se vería el backend en Python + FastAPI
Este es solo un ejemplo para visualizar la arquitectura
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
from datetime import datetime
import asyncpg

app = FastAPI(title="Wolfmen FPL API")

# ============================================
# MODELS / SCHEMAS
# ============================================

class Player(BaseModel):
    id: int
    web_name: str
    team: str
    position: str
    ownership: float
    differential: float
    in_your_team: bool

class Standing(BaseModel):
    rank: int
    team_id: int
    team_name: str
    manager_name: str
    gw_points: int
    total_points: int
    is_your_team: bool

class OwnershipAnalysis(BaseModel):
    gameweek: int
    players: List[Player]
    updated_at: datetime

# ============================================
# FPL API CLIENT
# ============================================

class FPLClient:
    BASE_URL = "https://fantasy.premierleague.com/api"

    async def get_bootstrap(self):
        """Get FPL bootstrap data"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.BASE_URL}/bootstrap-static/")
            return response.json()

    async def get_league_standings(self, league_id: int):
        """Get league standings"""
        async with httpx.AsyncClient() as client:
            url = f"{self.BASE_URL}/leagues-classic/{league_id}/standings/"
            response = await client.get(url)
            return response.json()

    async def get_team_picks(self, team_id: int, gameweek: int):
        """Get team picks for gameweek"""
        async with httpx.AsyncClient() as client:
            url = f"{self.BASE_URL}/entry/{team_id}/event/{gameweek}/picks/"
            response = await client.get(url)
            return response.json()

# ============================================
# DATABASE
# ============================================

class Database:
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.pool = None

    async def connect(self):
        self.pool = await asyncpg.create_pool(self.db_url)

    async def save_standings(self, league_id: int, gameweek: int, standings: List[dict]):
        """Save standings to database"""
        async with self.pool.acquire() as conn:
            for standing in standings:
                await conn.execute("""
                    INSERT INTO league_standings
                    (team_id, gameweek_id, rank, total_points, gameweek_points)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (team_id, gameweek_id) DO UPDATE
                    SET rank = $3, total_points = $4, gameweek_points = $5
                """, standing['entry'], gameweek, standing['rank'],
                standing['total'], standing['event_total'])

    async def get_standings_history(self, league_id: int, team_id: int):
        """Get historical standings for a team"""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT gameweek_id, rank, total_points, gameweek_points
                FROM league_standings
                WHERE team_id = $1
                ORDER BY gameweek_id ASC
            """, team_id)
            return [dict(row) for row in rows]

# ============================================
# API ENDPOINTS
# ============================================

fpl_client = FPLClient()
db = Database("postgresql://user:pass@localhost/wolfmen_fpl")

@app.on_event("startup")
async def startup():
    await db.connect()

@app.get("/")
async def root():
    return {
        "app": "Wolfmen FPL API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/standings/{league_id}", response_model=List[Standing])
async def get_standings(league_id: int, gameweek: Optional[int] = None):
    """
    Get current standings for a league

    - **league_id**: FPL mini-league ID
    - **gameweek**: Optional specific gameweek (defaults to current)
    """
    try:
        data = await fpl_client.get_league_standings(league_id)
        standings = data['standings']['results']

        result = [
            Standing(
                rank=s['rank'],
                team_id=s['entry'],
                team_name=s['entry_name'],
                manager_name=s['player_name'],
                gw_points=s['event_total'],
                total_points=s['total'],
                is_your_team=s['entry'] == 3851196  # Your team ID
            )
            for s in standings
        ]

        # Save to database
        await db.save_standings(league_id, gameweek or 1, standings)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ownership/{league_id}/{gameweek}", response_model=OwnershipAnalysis)
async def get_ownership_analysis(league_id: int, gameweek: int):
    """
    Get ownership differential analysis

    - **league_id**: FPL mini-league ID
    - **gameweek**: Gameweek number
    """
    try:
        # Get all teams in league
        league_data = await fpl_client.get_league_standings(league_id)
        team_ids = [t['entry'] for t in league_data['standings']['results']]

        # Get bootstrap for player names
        bootstrap = await fpl_client.get_bootstrap()
        players_map = {p['id']: p for p in bootstrap['elements']}

        # Calculate ownership
        ownership_count = {}
        your_team_players = set()

        for team_id in team_ids:
            picks = await fpl_client.get_team_picks(team_id, gameweek)
            for pick in picks['picks']:
                player_id = pick['element']
                ownership_count[player_id] = ownership_count.get(player_id, 0) + 1

                if team_id == 3851196:  # Your team
                    your_team_players.add(player_id)

        # Build player analysis
        players = []
        for player_id, count in ownership_count.items():
            player = players_map[player_id]
            ownership_pct = (count / len(team_ids)) * 100
            in_your_team = player_id in your_team_players

            players.append(Player(
                id=player_id,
                web_name=player['web_name'],
                team=bootstrap['teams'][player['team'] - 1]['short_name'],
                position=['GKP', 'DEF', 'MID', 'FWD'][player['element_type'] - 1],
                ownership=ownership_pct,
                differential=(100 - ownership_pct) if in_your_team else -ownership_pct,
                in_your_team=in_your_team
            ))

        # Sort by absolute differential
        players.sort(key=lambda p: abs(p.differential), reverse=True)

        return OwnershipAnalysis(
            gameweek=gameweek,
            players=players,
            updated_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/team/{team_id}/history")
async def get_team_history(team_id: int):
    """
    Get historical performance for a team

    - **team_id**: FPL team ID
    """
    try:
        history = await db.get_standings_history(371793, team_id)
        return {
            "team_id": team_id,
            "history": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sync")
async def sync_data():
    """
    Manually trigger data sync from FPL API
    (This would normally run on a cron job)
    """
    try:
        # Sync standings
        standings = await get_standings(371793)

        # Sync ownership
        # ownership = await get_ownership_analysis(371793, current_gw)

        return {
            "status": "success",
            "synced_at": datetime.now(),
            "teams_synced": len(standings)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# ANALYTICS ENDPOINTS
# ============================================

@app.get("/api/analytics/trends/{team_id}")
async def get_team_trends(team_id: int):
    """Get performance trends (rank, points over time)"""
    history = await db.get_standings_history(371793, team_id)

    return {
        "team_id": team_id,
        "trends": {
            "rank": [h['rank'] for h in history],
            "points": [h['total_points'] for h in history],
            "gameweeks": [h['gameweek_id'] for h in history]
        }
    }

@app.get("/api/analytics/predictions/{team_id}")
async def get_predictions(team_id: int):
    """ML predictions for final rank (placeholder)"""
    # Aquí irían modelos de ML con scikit-learn, XGBoost, etc.
    return {
        "team_id": team_id,
        "predicted_final_rank": 5,
        "confidence": 0.75,
        "model": "gradient_boosting"
    }

# ============================================
# RUN
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

"""
Para correr este backend:

1. Instalar dependencias:
   pip install fastapi uvicorn httpx asyncpg pydantic

2. Correr el servidor:
   python fastapi-example.py

3. Acceder a:
   - API: http://localhost:8000
   - Docs interactivos: http://localhost:8000/docs
   - Redoc: http://localhost:8000/redoc

4. Endpoints disponibles:
   GET  /api/standings/371793
   GET  /api/ownership/371793/15
   GET  /api/team/3851196/history
   GET  /api/analytics/trends/3851196
   POST /api/sync
"""
