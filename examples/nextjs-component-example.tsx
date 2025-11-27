/**
 * Ejemplo de cómo se verían los componentes de Frontend en Next.js
 * Esta es solo una visualización de la arquitectura
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ============================================
// API CLIENT
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchStandings(leagueId: number) {
  const res = await fetch(`${API_BASE}/api/standings/${leagueId}`);
  if (!res.ok) throw new Error('Failed to fetch standings');
  return res.json();
}

async function fetchOwnership(leagueId: number, gameweek: number) {
  const res = await fetch(`${API_BASE}/api/ownership/${leagueId}/${gameweek}`);
  if (!res.ok) throw new Error('Failed to fetch ownership');
  return res.json();
}

async function fetchTeamHistory(teamId: number) {
  const res = await fetch(`${API_BASE}/api/team/${teamId}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

// ============================================
// TYPES
// ============================================

interface Standing {
  rank: number;
  team_id: number;
  team_name: string;
  manager_name: string;
  gw_points: number;
  total_points: number;
  is_your_team: boolean;
}

interface Player {
  id: number;
  web_name: string;
  team: string;
  position: string;
  ownership: number;
  differential: number;
  in_your_team: boolean;
}

// ============================================
// COMPONENTS
// ============================================

export function StandingsTable({ leagueId }: { leagueId: number }) {
  const { data: standings, isLoading } = useQuery({
    queryKey: ['standings', leagueId],
    queryFn: () => fetchStandings(leagueId),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>League Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Rank</th>
                <th className="text-left p-2">Team</th>
                <th className="text-left p-2">Manager</th>
                <th className="text-right p-2">GW</th>
                <th className="text-right p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {standings?.map((team: Standing) => (
                <tr
                  key={team.team_id}
                  className={`
                    border-b hover:bg-gray-50 transition
                    ${team.is_your_team ? 'bg-yellow-100 font-bold' : ''}
                  `}
                >
                  <td className="p-2">{team.rank}</td>
                  <td className="p-2">{team.team_name}</td>
                  <td className="p-2 text-gray-600">{team.manager_name}</td>
                  <td className="p-2 text-right">{team.gw_points}</td>
                  <td className="p-2 text-right font-semibold">
                    {team.total_points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function OwnershipAnalysis({
  leagueId,
  gameweek,
}: {
  leagueId: number;
  gameweek: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['ownership', leagueId, gameweek],
    queryFn: () => fetchOwnership(leagueId, gameweek),
  });

  if (isLoading) return <div>Loading ownership data...</div>;

  const getColor = (differential: number) => {
    if (differential > 0) {
      const intensity = Math.min(differential / 50, 1);
      return `rgba(34, 197, 94, ${intensity})`; // Green
    } else {
      const intensity = Math.min(Math.abs(differential) / 50, 1);
      return `rgba(239, 68, 68, ${intensity})`; // Red
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ownership Differentials - GW {gameweek}</CardTitle>
        <p className="text-sm text-gray-500">
          Updated: {new Date(data.updated_at).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Player</th>
                <th className="text-left p-2">Team</th>
                <th className="text-center p-2">Pos</th>
                <th className="text-right p-2">Own%</th>
                <th className="text-center p-2">Yours</th>
                <th className="text-right p-2">DXP</th>
              </tr>
            </thead>
            <tbody>
              {data?.players?.slice(0, 50).map((player: Player) => (
                <tr
                  key={player.id}
                  className={`
                    border-b hover:bg-gray-50
                    ${player.in_your_team ? 'font-bold' : ''}
                  `}
                  style={{
                    backgroundColor: getColor(player.differential),
                  }}
                >
                  <td className="p-2">{player.web_name}</td>
                  <td className="p-2 text-gray-600">{player.team}</td>
                  <td className="p-2 text-center text-sm">{player.position}</td>
                  <td className="p-2 text-right">
                    {player.ownership.toFixed(1)}%
                  </td>
                  <td className="p-2 text-center">
                    {player.in_your_team ? '✓' : ''}
                  </td>
                  <td className="p-2 text-right font-semibold">
                    {player.differential > 0 ? '+' : ''}
                    {player.differential.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamEvolutionChart({ teamId }: { teamId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['team-history', teamId],
    queryFn: () => fetchTeamHistory(teamId),
  });

  if (isLoading) return <div>Loading chart...</div>;

  const chartData = data?.history?.map((h: any) => ({
    gameweek: `GW${h.gameweek_id}`,
    rank: h.rank,
    points: h.total_points,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rank Chart */}
          <div>
            <h3 className="text-sm font-medium mb-2">Rank Evolution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="gameweek" />
                <YAxis reversed domain={[1, 20]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rank"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Points Chart */}
          <div>
            <h3 className="text-sm font-medium mb-2">Points Accumulation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="gameweek" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================

export default function DashboardPage() {
  const LEAGUE_ID = 371793;
  const YOUR_TEAM_ID = 3851196;
  const CURRENT_GW = 15; // Este vendría del backend

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🐺 Wolfmen FPL Dashboard</h1>
        <p className="text-gray-600">
          Real-time Fantasy Premier League analytics
        </p>
      </header>

      <div className="space-y-6">
        {/* Standings */}
        <StandingsTable leagueId={LEAGUE_ID} />

        {/* Evolution Chart */}
        <TeamEvolutionChart teamId={YOUR_TEAM_ID} />

        {/* Ownership Analysis */}
        <OwnershipAnalysis leagueId={LEAGUE_ID} gameweek={CURRENT_GW} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Current Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5th</p>
              <p className="text-sm text-green-600">↑ 2 from last GW</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,234</p>
              <p className="text-sm text-gray-600">+67 this GW</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Best Differential</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">Salah</p>
              <p className="text-sm text-green-600">+45% ownership</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * INSTALACIÓN:
 *
 * 1. Crear proyecto Next.js:
 *    npx create-next-app@latest wolfmen-fpl-frontend
 *
 * 2. Instalar dependencias:
 *    npm install @tanstack/react-query recharts
 *    npm install -D tailwindcss
 *
 * 3. Configurar .env.local:
 *    NEXT_PUBLIC_API_URL=http://localhost:8000
 *
 * 4. Correr:
 *    npm run dev
 *
 * 5. Abrir:
 *    http://localhost:3000
 */
