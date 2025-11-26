"""
FPL API Client
"""
import requests
import streamlit as st
from typing import Dict, List, Optional

class FPLClient:
    """Client for interacting with Fantasy Premier League API"""

    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json'
        })

    @st.cache_data(ttl=3600)  # Cache for 1 hour
    def get_bootstrap(_self) -> Dict:
        """Get bootstrap data (players, teams, gameweeks)"""
        url = f"{_self.base_url}/bootstrap-static/"
        response = _self.session.get(url)
        response.raise_for_status()
        return response.json()

    @st.cache_data(ttl=600)  # Cache for 10 minutes
    def get_league_standings(_self, league_id: int) -> Dict:
        """Get league standings"""
        url = f"{_self.base_url}/leagues-classic/{league_id}/standings/"
        response = _self.session.get(url)
        response.raise_for_status()
        return response.json()

    @st.cache_data(ttl=600)  # Cache for 10 minutes
    def get_team_picks(_self, team_id: int, gameweek: int) -> Dict:
        """Get team picks for a gameweek"""
        url = f"{_self.base_url}/entry/{team_id}/event/{gameweek}/picks/"
        response = _self.session.get(url)
        response.raise_for_status()
        return response.json()

    def get_current_gameweek(_self) -> int:
        """Get current gameweek number"""
        bootstrap = _self.get_bootstrap()
        for event in bootstrap['events']:
            if event['is_current']:
                return event['id']
        return 1

    def get_players_map(_self) -> Dict[int, Dict]:
        """Get mapping of player IDs to player data"""
        bootstrap = _self.get_bootstrap()
        teams = {t['id']: t for t in bootstrap['teams']}

        players = {}
        for player in bootstrap['elements']:
            players[player['id']] = {
                'id': player['id'],
                'name': player['web_name'],
                'team': teams[player['team']]['short_name'],
                'position': ['GKP', 'DEF', 'MID', 'FWD'][player['element_type'] - 1],
                'price': player['now_cost'] / 10,
                'total_points': player['total_points']
            }

        return players
