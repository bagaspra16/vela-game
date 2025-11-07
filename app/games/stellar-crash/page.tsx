'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import { addGameHistory } from '@/lib/storage';
import { ArrowLeft, Play, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function StellarCrashPage() {
  const { userData, balance, updateUserBalance } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [message, setMessage] = useState('');
  const [crashPoint, setCrashPoint] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userData) {
      router.push('/login');
    }
  }, [userData, router, mounted]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const generateCrashPoint = (): number => {
    // Generate a crash point with weighted probability
    const random = Math.random();
    if (random < 0.5) return 1 + Math.random() * 1.5; // 50% chance: 1.0x - 2.5x
    if (random < 0.8) return 2.5 + Math.random() * 2.5; // 30% chance: 2.5x - 5.0x
    if (random < 0.95) return 5 + Math.random() * 5; // 15% chance: 5.0x - 10.0x
    return 10 + Math.random() * 40; // 5% chance: 10.0x - 50.0x
  };

  const handleStart = () => {
    if (betAmount < 10 || betAmount > 5000) {
      setMessage('Bet must be between $10 and $5,000');
      return;
    }

    if (betAmount > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    // Deduct bet
    updateUserBalance(-betAmount);

    setIsPlaying(true);
    setCrashed(false);
    setCashedOut(false);
    setMessage('');
    setMultiplier(1.00);

    const crash = generateCrashPoint();
    setCrashPoint(crash);

    let currentMultiplier = 1.00;
    intervalRef.current = setInterval(() => {
      currentMultiplier += 0.01;
      setMultiplier(currentMultiplier);

      if (currentMultiplier >= crash) {
        handleCrash();
      }
    }, 50);
  };

  const handleCrash = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCrashed(true);
    setIsPlaying(false);

    if (!cashedOut) {
      setMessage(`💥 CRASHED at ${multiplier.toFixed(2)}x! You lost $${betAmount}`);
      addGameHistory({
        game: 'Stellar Crash',
        bet: betAmount,
        result: 'loss',
        payout: 0,
      });
    }
  };

  const handleCashOut = () => {
    if (!isPlaying || cashedOut || crashed) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCashedOut(true);
    setIsPlaying(false);

    const payout = Math.floor(betAmount * multiplier);
    updateUserBalance(payout);
    setMessage(`🎉 Cashed out at ${multiplier.toFixed(2)}x! You won $${payout.toLocaleString()}!`);
    
    addGameHistory({
      game: 'Stellar Crash',
      bet: betAmount,
      result: 'win',
      payout,
    });
  };

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 px-2 sm:px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 gap-3 sm:gap-4 mt-4 sm:mt-0">
          <Link href="/games">
            <button className="btn-outline-gold px-4 py-2 rounded-lg flex items-center space-x-2">
              <ArrowLeft size={20} />
              <span>Back to Games</span>
            </button>
          </Link>
          <div className="glass px-6 py-3 rounded-lg">
            <span className="text-gray-400">Balance: </span>
            <span className="text-xl font-bold text-gold-400">
              ${balance.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="gold-text-glow">Stellar Crash</span>
          </h1>
          <p className="text-gray-400">Cash out before the star crashes for huge wins</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Display */}
          <div className="glass p-8 rounded-2xl">
            <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-orange-900 via-red-900 to-black rounded-2xl border-4 border-gold-500 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Background stars */}
              <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Multiplier Display */}
              <div className="relative z-10 text-center">
                <div
                  className={`text-8xl font-bold transition-all duration-100 ${
                    crashed
                      ? 'text-red-500 animate-pulse'
                      : isPlaying
                      ? 'text-gold-400 gold-text-glow'
                      : 'text-gray-400'
                  }`}
                >
                  {multiplier.toFixed(2)}x
                </div>
                {isPlaying && !crashed && (
                  <div className="text-2xl text-gold-400 mt-4 animate-pulse">
                    🚀 Flying...
                  </div>
                )}
                {crashed && (
                  <div className="text-3xl text-red-500 mt-4 animate-bounce">
                    💥 CRASHED!
                  </div>
                )}
                {!isPlaying && !crashed && (
                  <div className="text-xl text-gray-400 mt-4">
                    Ready to launch
                  </div>
                )}
              </div>

              {/* Potential Win */}
              {isPlaying && !crashed && (
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <div className="text-sm text-gray-400">Potential Win</div>
                  <div className="text-3xl font-bold text-green-400">
                    ${Math.floor(betAmount * multiplier).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                  message.includes('won')
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {message}
              </div>
            )}
          </div>

          {/* Betting Panel */}
          <div className="space-y-6">
            {/* Bet Amount */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gold-400">Bet Amount</h3>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={10}
                max={5000}
                step={10}
                disabled={isPlaying}
                className="w-full px-4 py-3 bg-dark-100 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 text-white text-lg font-semibold"
              />
              <div className="flex gap-2 mt-3">
                {[100, 500, 1000, 2500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isPlaying}
                    className="flex-1 btn-outline-gold py-2 rounded-lg text-sm"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Bet:</span>
                <span className="font-bold text-white">${betAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Multiplier:</span>
                <span className="font-bold text-gold-400">{multiplier.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Potential Payout:</span>
                <span className="font-bold text-green-400">
                  ${Math.floor(betAmount * multiplier).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isPlaying ? (
              <button
                onClick={handleStart}
                disabled={crashed}
                className="w-full btn-gold py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2"
              >
                <Play size={20} />
                <span>Start Game</span>
              </button>
            ) : (
              <button
                onClick={handleCashOut}
                disabled={crashed || cashedOut}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <DollarSign size={20} />
                <span>Cash Out ${Math.floor(betAmount * multiplier).toLocaleString()}</span>
              </button>
            )}

            {/* How to Play */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-3 text-gold-400">How to Play</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Place your bet and click &quot;Start Game&quot;</li>
                <li>• Watch the multiplier increase</li>
                <li>• Click &quot;Cash Out&quot; before it crashes</li>
                <li>• The longer you wait, the higher the multiplier</li>
                <li>• But if it crashes before you cash out, you lose!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
