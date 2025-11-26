'use client';

import { useEffect, useState } from 'react';
import StandingsTable from './components/StandingsTable';
import OwnershipTable from './components/OwnershipTable';
import { Standing, Player } from '@/lib/types';

export default function Home() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [ownership, setOwnership] = useState<Player[]>([]);
  const [gameweek, setGameweek] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'standings' | 'ownership'>('standings');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [standingsRes, ownershipRes] = await Promise.all([
          fetch('/api/standings'),
          fetch('/api/ownership'),
        ]);

        const standingsData = await standingsRes.json();
        const ownershipData = await ownershipRes.json();

        setStandings(standingsData.standings || []);
        setOwnership(ownershipData.players || []);
        setGameweek(ownershipData.gameweek || 0);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-black/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <span>🐺</span>
                <span>Wolfmen FPL</span>
              </h1>
              <p className="text-gray-400 mt-1">Fantasy Premier League Analytics</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Current Gameweek</div>
              <div className="text-3xl font-bold text-wolfmen-orange">{gameweek}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'standings'
                ? 'bg-wolfmen-orange text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📊 Standings
          </button>
          <button
            onClick={() => setActiveTab('ownership')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
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
          {activeTab === 'standings' && <StandingsTable standings={standings} />}
          {activeTab === 'ownership' && <OwnershipTable players={ownership} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>Made with 🐺 for Wolfmen FC</p>
          <p className="text-sm mt-1">Data updates every 10 minutes</p>
        </div>
      </footer>
    </div>
  );
}
