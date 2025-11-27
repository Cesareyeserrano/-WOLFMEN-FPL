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

export interface Manager {
  team_id: number;
  team_name: string;
  manager_name: string;
  rank: number;
  total_points: number;
  gw_points: number;
}

export interface TeamInfo {
  team_id: number;
  team_name: string;
  manager_name: string;
  rank: number;
  last_rank: number;
  total_points: number;
  gw_points: number;
  gameweek: number;
  starting11: SquadPlayer[];
  bench: SquadPlayer[];
}

export interface SquadPlayer {
  name: string;
  team: string;
  position: string;
  points: number;
  total_points: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  multiplier: number;
}

export const CONFIG = {
  LEAGUE_ID: 371793,
  YOUR_TEAM_ID: 3851196,
  TEAM_NAME: 'WOLFMEN FC',
};
