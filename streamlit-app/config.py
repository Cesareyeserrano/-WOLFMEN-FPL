"""
Configuration for Wolfmen FPL Dashboard
"""

# FPL Settings
MINI_LEAGUE_ID = 371793
YOUR_TEAM_ID = 3851196
TEAM_NAME = "WOLFMEN FC"

# FPL API Endpoints
FPL_BASE_URL = "https://fantasy.premierleague.com/api"
FPL_BOOTSTRAP = f"{FPL_BASE_URL}/bootstrap-static/"
FPL_LEAGUE_STANDINGS = f"{FPL_BASE_URL}/leagues-classic/{MINI_LEAGUE_ID}/standings/"
FPL_TEAM_PICKS = f"{FPL_BASE_URL}/entry/{{team_id}}/event/{{gw}}/picks/"

# UI Settings
PAGE_TITLE = "🐺 Wolfmen FPL Dashboard"
PAGE_ICON = "🐺"
LAYOUT = "wide"

# Colors
COLOR_POSITIVE = "#22c55e"
COLOR_NEGATIVE = "#ef4444"
COLOR_NEUTRAL = "#6b7280"
COLOR_YOUR_TEAM = "#f59e0b"
