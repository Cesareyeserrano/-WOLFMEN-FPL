import { Standing } from '@/lib/types';

interface Props {
  standings: Standing[];
}

export default function StandingsTable({ standings }: Props) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-wolfmen-orange to-yellow-600">
        <h2 className="text-2xl font-bold text-black">League Standings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 text-gray-300">
              <th className="px-6 py-4 text-left font-semibold">Rank</th>
              <th className="px-6 py-4 text-left font-semibold">Team</th>
              <th className="px-6 py-4 text-left font-semibold">Manager</th>
              <th className="px-6 py-4 text-right font-semibold">GW Points</th>
              <th className="px-6 py-4 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => (
              <tr
                key={team.team_id}
                className={`
                  border-t border-gray-700 transition-colors
                  ${team.is_your_team
                    ? 'bg-wolfmen-orange/20 border-l-4 border-l-wolfmen-orange'
                    : 'hover:bg-gray-700/50'
                  }
                `}
              >
                <td className="px-6 py-4">
                  <div className={`
                    text-lg font-bold
                    ${team.is_your_team ? 'text-wolfmen-orange' : 'text-white'}
                  `}>
                    {team.rank}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`
                    font-semibold
                    ${team.is_your_team ? 'text-white' : 'text-gray-300'}
                  `}>
                    {team.team_name}
                    {team.is_your_team && (
                      <span className="ml-2 text-xs bg-wolfmen-orange text-black px-2 py-1 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {team.manager_name}
                </td>
                <td className="px-6 py-4 text-right text-white font-semibold">
                  {team.gw_points}
                </td>
                <td className="px-6 py-4 text-right text-white font-bold text-lg">
                  {team.total_points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
