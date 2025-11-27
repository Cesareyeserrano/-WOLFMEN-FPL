import { NextResponse } from 'next/server';
import { getLeagueStandings } from '@/lib/fpl-client';
import { CONFIG } from '@/lib/types';

export async function GET() {
  try {
    const data = await getLeagueStandings(CONFIG.LEAGUE_ID);
    const managers = data.standings.results.map((entry: any) => ({
      team_id: entry.entry,
      team_name: entry.entry_name,
      manager_name: entry.player_name,
      rank: entry.rank,
      total_points: entry.total,
      gw_points: entry.event_total,
    }));

    return NextResponse.json({ managers });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
