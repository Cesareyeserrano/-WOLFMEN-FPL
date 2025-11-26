export interface Standing {
  rank: number;
  team_id: number;
  team_name: string;
  manager_name: string;
  gw_points: number;
  total_points: number;
  is_your_team: boolean;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  ownership: number;
  differential: number;
  in_your_team: boolean;
  count: number;
}

export interface EvolutionPoint {
  gameweek: number;
  rank: number;
  points: number;
}

export const CONFIG = {
  LEAGUE_ID: 371793,
  YOUR_TEAM_ID: 3851196,
  TEAM_NAME: 'WOLFMEN FC',
};
