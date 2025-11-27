import { NextResponse } from 'next/server';
import { getBootstrap, getLeagueStandings, getTeamPicks, getCurrentGameweek } from '@/lib/fpl-client';
import { CONFIG } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = parseInt(searchParams.get('teamId') || String(CONFIG.YOUR_TEAM_ID));

    const bootstrap = await getBootstrap();
    const currentGW = getCurrentGameweek(bootstrap);

    // Get team standings info
    const leagueData = await getLeagueStandings(CONFIG.LEAGUE_ID);
    const teamStanding = leagueData.standings.results.find((t: any) => t.entry === teamId);

    if (!teamStanding) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Get team picks
    const picks = await getTeamPicks(teamId, currentGW);

    // Get player details
    const playersMap: any = {};
    bootstrap.elements.forEach((p: any) => {
      playersMap[p.id] = p;
    });

    const teamsMap: any = {};
    bootstrap.teams.forEach((t: any) => {
      teamsMap[t.id] = t;
    });

    const squad = picks.picks.map((pick: any) => {
      const player = playersMap[pick.element];
      const team = teamsMap[player.team];
      return {
        name: player.web_name,
        team: team.short_name,
        position: ['GKP', 'DEF', 'MID', 'FWD'][player.element_type - 1],
        points: player.event_points || 0,
        total_points: player.total_points,
        is_captain: pick.is_captain,
        is_vice_captain: pick.is_vice_captain,
        multiplier: pick.multiplier,
      };
    });

    const starting11 = squad.slice(0, 11);
    const bench = squad.slice(11);

    return NextResponse.json({
      team_id: teamId,
      team_name: teamStanding.entry_name,
      manager_name: teamStanding.player_name,
      rank: teamStanding.rank,
      last_rank: teamStanding.last_rank,
      total_points: teamStanding.total,
      gw_points: teamStanding.event_total,
      gameweek: currentGW,
      starting11,
      bench,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
