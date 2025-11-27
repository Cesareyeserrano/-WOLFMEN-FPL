'use client';

import { useEffect, useState } from 'react';
import StandingsTable from './components/StandingsTable';
import OwnershipTable from './components/OwnershipTable';
import TeamSummary from './components/TeamSummary';
import { Standing, Player, Manager, TeamInfo, CONFIG } from '@/lib/types';

export default function Home() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [ownership, setOwnership] = useState<Player[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number>(CONFIG.YOUR_TEAM_ID);
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [gameweek, setGameweek] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'standings' | 'ownership'>('summary');

  // Fetch initial data (standings and managers)
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const [standingsRes, managersRes] = await Promise.all([
          fetch('/api/standings'),
          fetch('/api/managers'),
        ]);

        const standingsData = await standingsRes.json();
        const managersData = await managersRes.json();

        setStandings(standingsData.standings || []);
        setManagers(managersData.managers || []);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  // Fetch team-specific data when selectedTeamId changes
  useEffect(() => {
    async function fetchTeamData() {
      if (!selectedTeamId) return;

      setTeamLoading(true);
      try {
        const [ownershipRes, teamInfoRes] = await Promise.all([
          fetch(`/api/ownership?teamId=${selectedTeamId}`),
          fetch(`/api/team-info?teamId=${selectedTeamId}`),
        ]);

        const ownershipData = await ownershipRes.json();
        const teamInfoData = await teamInfoRes.json();

        setOwnership(ownershipData.players || []);
        setGameweek(ownershipData.gameweek || 0);
        setTeamInfo(teamInfoData);
      } catch (error) {
        console.error('Failed to fetch team data:', error);
      } finally {
        setTeamLoading(false);
      }
    }

    fetchTeamData();
  }, [selectedTeamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐺</div>
          <p className="text-white text-xl">Loading Wolfmen data...</p>
        </div>
      </div>
    );
  }

  const selectedManager = managers.find(m => m.team_id === selectedTeamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-black/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <span>🐺</span>
                <span>Wolfmen FPL</span>
              </h1>
              <p className="text-gray-400 mt-1">Fantasy Premier League Analytics</p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Manager Selector */}
              <div className="w-full md:w-auto">
                <label className="text-sm text-gray-400 block mb-2">Select Manager</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-wolfmen-orange focus:outline-none w-full md:w-64"
                >
                  {managers.map((manager) => (
                    <option key={manager.team_id} value={manager.team_id}>
                      {manager.manager_name} ({manager.team_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Gameweek Display */}
              <div className="text-right">
                <div className="text-sm text-gray-400">Current Gameweek</div>
                <div className="text-3xl font-bold text-wolfmen-orange">{gameweek}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'summary'
                ? 'bg-wolfmen-orange text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📋 Team Summary
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'standings'
                ? 'bg-wolfmen-orange text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📊 Standings
          </button>
          <button
            onClick={() => setActiveTab('ownership')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ownership'
                ? 'bg-wolfmen-orange text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            👥 Ownership
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'summary' && (
            <TeamSummary teamInfo={teamInfo} loading={teamLoading} />
          )}
          {activeTab === 'standings' && <StandingsTable standings={standings} />}
          {activeTab === 'ownership' && <OwnershipTable players={ownership} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>Made with 🐺 for Wolfmen FC</p>
          <p className="text-sm mt-1">
            Viewing: <span className="text-wolfmen-orange">{selectedManager?.manager_name}</span> • Data updates every 10 minutes
          </p>
        </div>
      </footer>
    </div>
  );
}
