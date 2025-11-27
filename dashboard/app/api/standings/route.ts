import { NextResponse } from 'next/server';
import { getLeagueStandings } from '@/lib/fpl-client';
import { CONFIG } from '@/lib/types';

export async function GET() {
  try {
    const data = await getLeagueStandings(CONFIG.LEAGUE_ID);
    const standings = data.standings.results.map((entry: any) => ({
      rank: entry.rank,
      team_id: entry.entry,
      team_name: entry.entry_name,
      manager_name: entry.player_name,
      gw_points: entry.event_total,
      total_points: entry.total,
      is_your_team: entry.entry === CONFIG.YOUR_TEAM_ID,
    }));

    return NextResponse.json({ standings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
