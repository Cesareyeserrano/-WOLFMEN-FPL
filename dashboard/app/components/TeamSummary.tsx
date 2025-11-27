import { TeamInfo } from '@/lib/types';

interface Props {
  teamInfo: TeamInfo | null;
  loading: boolean;
}

export default function TeamSummary({ teamInfo, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!teamInfo) return null;

  const rankChange = teamInfo.last_rank - teamInfo.rank;
  const rankChangeSymbol = rankChange > 0 ? '↑' : rankChange < 0 ? '↓' : '→';
  const rankChangeColor = rankChange > 0 ? 'text-green-400' : rankChange < 0 ? 'text-red-400' : 'text-gray-400';

  const captain = teamInfo.starting11.find(p => p.is_captain);
  const viceCaptain = teamInfo.starting11.find(p => p.is_vice_captain);

  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-wolfmen-orange to-yellow-600">
        <h2 className="text-2xl font-bold text-black">{teamInfo.team_name}</h2>
        <p className="text-black/80">{teamInfo.manager_name}</p>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Rank</div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {teamInfo.rank}
              <span className={`text-sm ${rankChangeColor}`}>
                {rankChangeSymbol} {Math.abs(rankChange)}
              </span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">GW Points</div>
            <div className="text-2xl font-bold text-wolfmen-orange">
              {teamInfo.gw_points}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Points</div>
            <div className="text-2xl font-bold text-white">
              {teamInfo.total_points}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Gameweek</div>
            <div className="text-2xl font-bold text-white">
              {teamInfo.gameweek}
            </div>
          </div>
        </div>

        {/* Captain Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {captain && (
            <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-yellow-500">
              <div className="text-gray-400 text-sm mb-1">Captain (C)</div>
              <div className="text-lg font-bold text-white">
                {captain.name}
                <span className="text-sm text-gray-400 ml-2">
                  {captain.team} • {captain.position}
                </span>
              </div>
              <div className="text-sm text-wolfmen-orange mt-1">
                {captain.points} pts this GW (x{captain.multiplier})
              </div>
            </div>
          )}

          {viceCaptain && (
            <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-gray-600">
              <div className="text-gray-400 text-sm mb-1">Vice Captain (VC)</div>
              <div className="text-lg font-bold text-white">
                {viceCaptain.name}
                <span className="text-sm text-gray-400 ml-2">
                  {viceCaptain.team} • {viceCaptain.position}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {viceCaptain.points} pts this GW
              </div>
            </div>
          )}
        </div>

        {/* Starting 11 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">Starting XI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {teamInfo.starting11.map((player, idx) => (
              <div
                key={idx}
                className={`bg-gray-900 rounded p-3 flex justify-between items-center ${
                  player.is_captain ? 'border-l-2 border-yellow-500' : ''
                } ${player.is_vice_captain ? 'border-l-2 border-gray-500' : ''}`}
              >
                <div>
                  <div className="text-white font-semibold text-sm">
                    {player.name}
                    {player.is_captain && <span className="ml-1 text-yellow-500">(C)</span>}
                    {player.is_vice_captain && <span className="ml-1 text-gray-400">(VC)</span>}
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.team} • {player.position}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-wolfmen-orange font-bold">{player.points}</div>
                  <div className="text-xs text-gray-500">{player.total_points} total</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bench */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Bench</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {teamInfo.bench.map((player, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded p-3">
                <div className="text-white text-sm">{player.name}</div>
                <div className="text-xs text-gray-400">
                  {player.team} • {player.position}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {player.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
