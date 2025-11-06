'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/components/WalletProvider';
import { Sparkles, Gem, Dices, TrendingUp } from 'lucide-react';

const games = [
  {
    id: 'cosmic-roulette',
    name: 'Cosmic Roulette',
    description: 'Spin the cosmic wheel and predict where the star will land',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    minBet: 10,
    maxBet: 1000,
    maxPayout: '10x',
  },
  {
    id: 'crystal-slots',
    name: 'Crystal Slots',
    description: 'Match mystical crystals for massive multipliers',
    icon: Gem,
    color: 'from-blue-500 to-cyan-500',
    minBet: 5,
    maxBet: 500,
    maxPayout: '100x',
  },
  {
    id: 'quantum-dice',
    name: 'Quantum Dice',
    description: 'Roll the quantum dice and predict the outcome',
    icon: Dices,
    color: 'from-green-500 to-emerald-500',
    minBet: 20,
    maxBet: 2000,
    maxPayout: '6x',
  },
  {
    id: 'stellar-crash',
    name: 'Stellar Crash',
    description: 'Cash out before the star crashes for huge wins',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    minBet: 10,
    maxBet: 5000,
    maxPayout: '∞',
  },
];

export default function GamesPage() {
  const { userData, balance } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userData) {
      router.push('/login');
    }
  }, [userData, router, mounted]);

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gold-text-glow">Game</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-400 px-4 mb-6">
            Select from our unique collection of futuristic games
          </p>
          <div className="inline-block glass px-6 py-3 rounded-lg">
            <span className="text-gray-400">Your Balance: </span>
            <span className="text-2xl font-bold text-gold-400">
              ${balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link key={game.id} href={`/games/${game.id}`}>
                <div className="game-card p-4 sm:p-6 lg:p-8 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gold-400 group-hover:text-gold-300 transition-colors">
                        {game.name}
                      </h2>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">{game.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Min</p>
                      <div className="text-lg font-semibold text-gold-400">
                        ${game.minBet}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Max</p>
                      <div className="text-lg font-semibold text-gold-400">
                        ${game.maxBet}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Max Payout</div>
                      <div className="text-lg font-semibold text-gold-400">
                        {game.maxPayout}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full btn-gold py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 group-hover:scale-105 transition-transform">
                      Play Now
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-dark-100 p-2 sm:p-3 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gold-400">
              🎮 How to Play
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>• Select a game from the options above</p>
              <p>• Choose your bet amount within the min/max limits</p>
              <p>• Play the game and try to win big!</p>
              <p>• Your winnings are instantly added to your balance</p>
              <p>• All games are provably fair and transparent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
