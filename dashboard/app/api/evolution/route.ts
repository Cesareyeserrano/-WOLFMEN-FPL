import { NextResponse } from 'next/server';
import { getLeagueStandings } from '@/lib/fpl-client';
import { CONFIG } from '@/lib/types';

export async function GET() {
  try {
    // For MVP, we'll return current standings only
    // In full version, this would fetch historical data for all gameweeks
    const data = await getLeagueStandings(CONFIG.LEAGUE_ID);
    const yourTeam = data.standings.results.find((t: any) => t.entry === CONFIG.YOUR_TEAM_ID);

    if (!yourTeam) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Simplified evolution data (just current GW)
    // In production, you'd fetch this for all GWs
    const evolution = [
      {
        gameweek: 1,
        rank: yourTeam.rank,
        points: yourTeam.total,
      },
    ];

    return NextResponse.json({
      evolution,
      current_rank: yourTeam.rank,
      current_points: yourTeam.total,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
