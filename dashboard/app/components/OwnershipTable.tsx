import { Player } from '@/lib/types';

interface Props {
  players: Player[];
}

function getColorForDifferential(differential: number): string {
  if (differential > 0) {
    const intensity = Math.min(Math.abs(differential) / 50, 1);
    return `rgba(34, 197, 94, ${intensity * 0.3})`;
  } else {
    const intensity = Math.min(Math.abs(differential) / 50, 1);
    return `rgba(239, 68, 68, ${intensity * 0.3})`;
  }
}

export default function OwnershipTable({ players }: Props) {
  const topPlayers = players.slice(0, 50);

  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-wolfmen-orange to-yellow-600">
        <h2 className="text-2xl font-bold text-black">Ownership Differentials</h2>
        <p className="text-sm text-black/80 mt-1">Top 50 by absolute differential</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 text-gray-300">
              <th className="px-6 py-4 text-left font-semibold">Player</th>
              <th className="px-6 py-4 text-left font-semibold">Team</th>
              <th className="px-6 py-4 text-center font-semibold">Pos</th>
              <th className="px-6 py-4 text-right font-semibold">Own%</th>
              <th className="px-6 py-4 text-center font-semibold">Yours</th>
              <th className="px-6 py-4 text-right font-semibold">DXP</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player) => (
              <tr
                key={player.id}
                className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                style={{
                  backgroundColor: getColorForDifferential(player.differential),
                }}
              >
                <td className="px-6 py-4">
                  <div className={`
                    ${player.in_your_team ? 'font-bold text-white' : 'text-gray-300'}
                  `}>
                    {player.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {player.team}
                </td>
                <td className="px-6 py-4 text-center text-gray-400 text-xs">
                  {player.position}
                </td>
                <td className="px-6 py-4 text-right text-white">
                  {player.ownership.toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-center text-2xl">
                  {player.in_your_team ? '✓' : ''}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`
                    font-bold text-lg
                    ${player.differential > 0 ? 'text-green-400' : 'text-red-400'}
                  `}>
                    {player.differential > 0 ? '+' : ''}
                    {player.differential.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
