"""
Data processing utilities
"""
import pandas as pd
from typing import List, Dict, Set

def process_standings(standings_data: Dict, your_team_id: int) -> pd.DataFrame:
    """Process standings data into DataFrame"""
    results = standings_data['standings']['results']

    df = pd.DataFrame([
        {
            'Rank': entry['rank'],
            'Team': entry['entry_name'],
            'Manager': entry['player_name'],
            'GW Points': entry['event_total'],
            'Total': entry['total'],
            'team_id': entry['entry'],
            'is_your_team': entry['entry'] == your_team_id
        }
        for entry in results
    ])

    return df

def calculate_ownership(
    team_ids: List[int],
    gameweek: int,
    players_map: Dict,
    your_team_id: int,
    fpl_client
) -> pd.DataFrame:
    """Calculate ownership differentials"""

    ownership_count = {}
    your_team_players = set()

    # Count ownership
    for team_id in team_ids:
        try:
            picks = fpl_client.get_team_picks(team_id, gameweek)
            for pick in picks['picks']:
                player_id = pick['element']
                ownership_count[player_id] = ownership_count.get(player_id, 0) + 1

                if team_id == your_team_id:
                    your_team_players.add(player_id)
        except:
            continue

    # Build DataFrame
    total_teams = len(team_ids)
    players = []

    for player_id, count in ownership_count.items():
        player = players_map.get(player_id)
        if not player:
            continue

        ownership_pct = (count / total_teams) * 100
        in_your_team = player_id in your_team_players

        players.append({
            'Player': player['name'],
            'Team': player['team'],
            'Pos': player['position'],
            'Ownership %': ownership_pct,
            'Count': count,
            'Yours': '✓' if in_your_team else '',
            'Differential': (100 - ownership_pct) if in_your_team else -ownership_pct,
            'in_your_team': in_your_team
        })

    df = pd.DataFrame(players)
    df = df.sort_values('Differential', key=abs, ascending=False)

    return df

def get_team_history(
    league_standings: Dict,
    team_id: int,
    fpl_client
) -> pd.DataFrame:
    """Get historical data for a team (simplified for MVP)"""
    # For MVP, we'll just show current gameweek data
    # In full version, this would fetch all gameweek history

    current_gw = fpl_client.get_current_gameweek()

    # Placeholder - in real version would loop through all GWs
    history = []
    for gw in range(1, current_gw + 1):
        # This is simplified - real version would need actual historical data
        history.append({
            'Gameweek': gw,
            'Rank': 0,  # Would fetch actual
            'Points': 0  # Would fetch actual
        })

    return pd.DataFrame(history)
