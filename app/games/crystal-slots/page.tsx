'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useWallet } from '@/components/WalletProvider';
import { addGameHistory } from '@/lib/storage';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';

const CrystalSlots3D = dynamic(() => import('@/components/CrystalSlots3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
    </div>
  ),
});

const SYMBOLS = ['💎', '💰', '⭐', '🔮', '👑', '🎰', '💫'];
const SYMBOL_VALUES = {
  '💎': 100,
  '💰': 50,
  '⭐': 30,
  '🔮': 20,
  '👑': 15,
  '🎰': 10,
  '💫': 5,
};

export default function CrystalSlotsPage() {
  const { userData, balance, updateUserBalance } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [reels, setReels] = useState(['💎', '💰', '⭐']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [lastWin, setLastWin] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userData) {
      router.push('/login');
    }
  }, [userData, router, mounted]);

  const spinReels = async () => {
    if (betAmount < 5 || betAmount > 500) {
      setMessage('Bet must be between $5 and $500');
      return;
    }

    if (betAmount > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    setIsSpinning(true);
    setMessage('');
    setLastWin(0);

    // Deduct bet
    updateUserBalance(-betAmount);

    // Animate spinning
    const spinDuration = 2000;
    const spinInterval = 100;
    const spins = spinDuration / spinInterval;

    for (let i = 0; i < spins; i++) {
      await new Promise((resolve) => setTimeout(resolve, spinInterval));
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }

    // Final result
    const finalReels = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ];
    setReels(finalReels);

    // Calculate winnings
    let payout = 0;
    let won = false;

    // Three of a kind
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      const symbol = finalReels[0];
      const multiplier = SYMBOL_VALUES[symbol as keyof typeof SYMBOL_VALUES];
      payout = betAmount * multiplier;
      won = true;
      setMessage(`🎉 THREE OF A KIND! You won $${payout.toLocaleString()}!`);
    }
    // Two of a kind
    else if (
      finalReels[0] === finalReels[1] ||
      finalReels[1] === finalReels[2] ||
      finalReels[0] === finalReels[2]
    ) {
      payout = betAmount * 2;
      won = true;
      setMessage(`✨ TWO OF A KIND! You won $${payout.toLocaleString()}!`);
    } else {
      setMessage('😔 No match. Try again!');
    }

    if (won) {
      updateUserBalance(payout);
      setLastWin(payout);
      addGameHistory({
        game: 'Crystal Slots',
        bet: betAmount,
        result: 'win',
        payout,
      });
    } else {
      addGameHistory({
        game: 'Crystal Slots',
        bet: betAmount,
        result: 'loss',
        payout: 0,
      });
    }

    setIsSpinning(false);
  };

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <Link href="/games">
            <button className="btn-outline-gold px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base">
              <ArrowLeft size={20} />
              <span>Back to Games</span>
            </button>
          </Link>
          <div className="glass px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full sm:w-auto">
            <span className="text-gray-400">Balance: </span>
            <span className="text-xl font-bold text-gold-400">
              ${balance.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            <span className="gold-text-glow">Crystal Slots</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 px-4">Match mystical crystals for massive multipliers</p>
        </div>

        {/* 3D Slot Machine */}
        <div className="glass p-3 sm:p-4 rounded-2xl mb-6 sm:mb-8">
          <div className="aspect-video max-w-full sm:max-w-3xl mx-auto">
            <CrystalSlots3D reels={reels} isSpinning={isSpinning} />
          </div>

          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-semibold text-lg ${
                message.includes('won')
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Bet Controls */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gold-400">Bet Amount</h3>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              min={5}
              max={500}
              step={5}
              disabled={isSpinning}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-100 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 text-white text-base sm:text-lg font-semibold"
            />
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[25, 50, 100, 250].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={isSpinning}
                  className="btn-outline-gold py-2 rounded-lg text-xs sm:text-sm"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={spinReels}
            disabled={isSpinning}
            className="w-full btn-gold py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSpinning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                <span>Spinning...</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Spin</span>
              </>
            )}
          </button>
        </div>

        {/* Paytable */}
        <div className="glass p-4 sm:p-6 rounded-2xl">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gold-400">Paytable</h3>
          <div className="space-y-2">
            {Object.entries(SYMBOL_VALUES).map(([symbol, multiplier]) => (
              <div key={symbol} className="flex items-center justify-between py-2 border-b border-gold-500/20 text-sm sm:text-base">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-xl sm:text-3xl">{symbol}</span>
                  <span className="text-xl sm:text-3xl">{symbol}</span>
                  <span className="text-xl sm:text-3xl">{symbol}</span>
                </div>
                <span className="text-gold-400 font-bold">{multiplier}x</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 text-sm sm:text-base">
              <div className="text-gray-400">Any two matching</div>
              <span className="text-gold-400 font-bold">2x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
