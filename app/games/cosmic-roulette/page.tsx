'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useWallet } from '@/components/WalletProvider';
import { addGameHistory } from '@/lib/storage';
import { ArrowLeft, Play, RotateCw } from 'lucide-react';
import Link from 'next/link';

const Roulette3D = dynamic(() => import('@/components/Roulette3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
    </div>
  ),
});

const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36
const COLORS = ['green', 'red', 'black'];

export default function CosmicRoulettePage() {
  const { userData, balance, updateUserBalance } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ number: number; color: string } | null>(null);
  const [message, setMessage] = useState('');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userData) {
      router.push('/login');
    }
  }, [userData, router, mounted]);

  const getNumberColor = (num: number): string => {
    if (num === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const handleSpin = () => {
    if (!selectedNumber && !selectedColor) {
      setMessage('Please select a number or color to bet on!');
      return;
    }

    if (betAmount < 10 || betAmount > 1000) {
      setMessage('Bet must be between $10 and $1,000');
      return;
    }

    if (betAmount > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    setIsSpinning(true);
    setMessage('');
    setResult(null);

    // Deduct bet
    updateUserBalance(-betAmount);

    // Spin animation
    const spins = 5 + Math.random() * 3;
    const newRotation = rotation + 360 * spins;
    setRotation(newRotation);

    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      const winningColor = getNumberColor(winningNumber);
      
      setResult({ number: winningNumber, color: winningColor });
      setIsSpinning(false);

      let won = false;
      let payout = 0;

      if (selectedNumber !== null && selectedNumber === winningNumber) {
        payout = betAmount * 10; // 10x for exact number
        won = true;
      } else if (selectedColor && selectedColor === winningColor) {
        payout = betAmount * 2; // 2x for color
        won = true;
      }

      if (won) {
        updateUserBalance(payout);
        setMessage(`🎉 You won $${payout.toLocaleString()}!`);
        addGameHistory({
          game: 'Cosmic Roulette',
          bet: betAmount,
          result: 'win',
          payout,
        });
      } else {
        setMessage(`😔 You lost. The ball landed on ${winningNumber} (${winningColor})`);
        addGameHistory({
          game: 'Cosmic Roulette',
          bet: betAmount,
          result: 'loss',
          payout: 0,
        });
      }
    }, 3000);
  };

  const handleReset = () => {
    setSelectedNumber(null);
    setSelectedColor(null);
    setResult(null);
    setMessage('');
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
      <div className="container mx-auto max-w-6xl">
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
            <span className="gold-text-glow">Cosmic Roulette</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 px-4">Spin the cosmic wheel and predict where the star will land</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 3D Roulette Wheel */}
          <div className="glass p-3 sm:p-4 rounded-2xl">
            <div className="relative aspect-square max-w-full sm:max-w-md mx-auto">
              <Roulette3D 
                isSpinning={isSpinning}
                result={result?.number ?? null}
                rotation={rotation}
              />
            </div>

            {result && (
              <div className="mt-4 text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  result.color === 'red' ? 'text-red-500' :
                  result.color === 'green' ? 'text-green-500' :
                  'text-white'
                }`}>
                  {result.number}
                </div>
                <div className="text-lg text-gray-400 capitalize">
                  {result.color}
                </div>
              </div>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded-lg text-center font-semibold ${
                message.includes('won') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Betting Panel */}
          <div className="space-y-4 sm:space-y-6">
            {/* Bet Amount */}
            <div className="glass p-4 sm:p-6 rounded-2xl">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gold-400">Bet Amount</h3>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={10}
                max={1000}
                step={10}
                disabled={isSpinning}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-100 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 text-white text-base sm:text-lg font-semibold"
              />
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4">
                {[50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isSpinning}
                    className="btn-outline-gold py-2 sm:py-3 rounded-lg text-xs sm:text-sm"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Number Selection */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gold-400">
                Select Number (10x payout)
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-64 overflow-y-auto">
                {NUMBERS.map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedNumber(num);
                      setSelectedColor(null);
                    }}
                    disabled={isSpinning}
                    className={`aspect-square flex items-center justify-center rounded-lg font-bold transition-all text-xs sm:text-sm ${
                      selectedNumber === num
                        ? 'bg-gold-500 text-black'
                        : 'bg-dark-100 text-gray-300 hover:bg-dark-50'
                    } disabled:opacity-50`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="glass p-4 sm:p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gold-400">
                Select Color (2x payout)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setSelectedColor('red');
                    setSelectedNumber(null);
                  }}
                  disabled={isSpinning}
                  className={`py-2 px-2 sm:px-3 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                    selectedColor === 'red'
                      ? 'bg-gold-500 text-black'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-50'
                  } disabled:opacity-50`}
                >
                  Red
                </button>
                <button
                  onClick={() => {
                    setSelectedColor('black');
                    setSelectedNumber(null);
                  }}
                  disabled={isSpinning}
                  className={`py-2 px-2 sm:px-3 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                    selectedColor === 'black'
                      ? 'bg-gold-500 text-black'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-50'
                  } disabled:opacity-50`}
                >
                  Black
                </button>
                <button
                  onClick={() => {
                    setSelectedColor('green');
                    setSelectedNumber(null);
                  }}
                  disabled={isSpinning}
                  className={`py-2 px-2 sm:px-3 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                    selectedColor === 'green'
                      ? 'bg-gold-500 text-black'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-50'
                  } disabled:opacity-50`}
                >
                  Green
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSpin}
                disabled={isSpinning || (!selectedNumber && !selectedColor)}
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
              <button
                onClick={handleReset}
                disabled={isSpinning}
                className="btn-outline-gold px-6 py-4 rounded-lg"
              >
                <RotateCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
