const FPL_BASE_URL = 'https://fantasy.premierleague.com/api';

export async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        next: { revalidate: 600 }, // Cache for 10 minutes
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 500) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

export async function getBootstrap() {
  return fetchWithRetry(`${FPL_BASE_URL}/bootstrap-static/`);
}

export async function getLeagueStandings(leagueId: number) {
  return fetchWithRetry(`${FPL_BASE_URL}/leagues-classic/${leagueId}/standings/`);
}

export async function getTeamPicks(teamId: number, gameweek: number) {
  return fetchWithRetry(`${FPL_BASE_URL}/entry/${teamId}/event/${gameweek}/picks/`);
}

export function getCurrentGameweek(bootstrap: any): number {
  const current = bootstrap.events.find((e: any) => e.is_current);
  return current ? current.id : 1;
}

export function getPlayersMap(bootstrap: any) {
  const teams = bootstrap.teams.reduce((acc: any, t: any) => {
    acc[t.id] = t;
    return acc;
  }, {});

  return bootstrap.elements.reduce((acc: any, player: any) => {
    acc[player.id] = {
      id: player.id,
      name: player.web_name,
      team: teams[player.team].short_name,
      position: ['GKP', 'DEF', 'MID', 'FWD'][player.element_type - 1],
      price: player.now_cost / 10,
      total_points: player.total_points,
    };
    return acc;
  }, {});
}
