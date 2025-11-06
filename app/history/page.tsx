'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import { getGameHistory, GameHistory } from '@/lib/storage';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

export default function HistoryPage() {
  const { userData } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userData) {
      router.push('/login');
    }
  }, [userData, router, mounted]);

  useEffect(() => {
    if (mounted && userData) {
      setHistory(getGameHistory());
    }
  }, [mounted, userData]);

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  const totalWins = history.filter((h) => h.result === 'win').length;
  const totalLosses = history.filter((h) => h.result === 'loss').length;
  const winRate = history.length > 0 ? (totalWins / history.length) * 100 : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Game <span className="gold-text-glow">History</span>
          </h1>
          <p className="text-xl text-gray-400">
            Track your gaming performance and statistics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="text-gold-400" size={24} />
              <span className="text-gray-400">Total Games</span>
            </div>
            <div className="text-3xl font-bold text-white">{history.length}</div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="text-green-400" size={24} />
              <span className="text-gray-400">Wins</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{totalWins}</div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingDown className="text-red-400" size={24} />
              <span className="text-gray-400">Losses</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{totalLosses}</div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="text-gold-400" size={24} />
              <span className="text-gray-400">Win Rate</span>
            </div>
            <div className="text-3xl font-bold text-gold-400">{winRate.toFixed(1)}%</div>
          </div>
        </div>

        {/* User Stats */}
        <div className="glass p-8 rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gold-400">Your Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Winnings</div>
              <div className="text-2xl font-bold text-green-400">
                ${userData.totalWinnings.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Losses</div>
              <div className="text-2xl font-bold text-red-400">
                ${userData.totalLosses.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Net Profit/Loss</div>
              <div
                className={`text-2xl font-bold ${
                  userData.totalWinnings - userData.totalLosses >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                ${(userData.totalWinnings - userData.totalLosses).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gold-400">Recent Games</h2>
          
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-xl text-gray-400">No games played yet</p>
              <p className="text-gray-500 mt-2">Start playing to see your history here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-500/20">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Game</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Bet</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Result</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Payout</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((game) => (
                    <tr
                      key={game.id}
                      className="border-b border-gold-500/10 hover:bg-gold-500/5 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium">{game.game}</td>
                      <td className="py-4 px-4">${game.bet.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            game.result === 'win'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {game.result === 'win' ? '✓ Win' : '✗ Loss'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-semibold ${
                            game.result === 'win' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {game.result === 'win' ? '+' : '-'}$
                          {(game.result === 'win' ? game.payout : game.bet).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-sm">
                        {new Date(game.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
