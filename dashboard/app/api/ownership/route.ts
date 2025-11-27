import { NextResponse } from 'next/server';
import { getBootstrap, getLeagueStandings, getTeamPicks, getCurrentGameweek, getPlayersMap } from '@/lib/fpl-client';
import { CONFIG } from '@/lib/types';

export async function GET() {
  try {
    const bootstrap = await getBootstrap();
    const currentGW = getCurrentGameweek(bootstrap);
    const playersMap = getPlayersMap(bootstrap);

    const leagueData = await getLeagueStandings(CONFIG.LEAGUE_ID);
    const teamIds = leagueData.standings.results.map((t: any) => t.entry);

    const ownershipCount: Record<number, number> = {};
    const yourTeamPlayers = new Set<number>();

    // Fetch all team picks
    await Promise.all(
      teamIds.map(async (teamId: number) => {
        try {
          const picks = await getTeamPicks(teamId, currentGW);
          picks.picks.forEach((pick: any) => {
            const playerId = pick.element;
            ownershipCount[playerId] = (ownershipCount[playerId] || 0) + 1;

            if (teamId === CONFIG.YOUR_TEAM_ID) {
              yourTeamPlayers.add(playerId);
            }
          });
        } catch (err) {
          console.error(`Failed to fetch team ${teamId}`, err);
        }
      })
    );

    const players = Object.entries(ownershipCount).map(([playerId, count]) => {
      const id = parseInt(playerId);
      const player = playersMap[id];
      if (!player) return null;

      const ownership = (count / teamIds.length) * 100;
      const inYourTeam = yourTeamPlayers.has(id);

      return {
        id,
        name: player.name,
        team: player.team,
        position: player.position,
        ownership,
        differential: inYourTeam ? (100 - ownership) : -ownership,
        in_your_team: inYourTeam,
        count,
      };
    }).filter(Boolean);

    players.sort((a, b) => Math.abs(b!.differential) - Math.abs(a!.differential));

    return NextResponse.json({ players, gameweek: currentGW });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
