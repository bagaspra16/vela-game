'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import { addGameHistory } from '@/lib/storage';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';

export default function QuantumDicePage() {
  const { userData, balance, updateUserBalance } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [prediction, setPrediction] = useState<'over' | 'under' | null>(null);
  const [targetNumber, setTargetNumber] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [diceRotation, setDiceRotation] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userData) {
      router.push('/login');
    }
  }, [userData, router, mounted]);

  const calculateMultiplier = (): number => {
    if (prediction === 'over') {
      return (100 / (100 - targetNumber)) * 0.95;
    } else {
      return (100 / targetNumber) * 0.95;
    }
  };

  const handleRoll = async () => {
    if (!prediction) {
      setMessage('Please select Over or Under!');
      return;
    }

    if (betAmount < 20 || betAmount > 2000) {
      setMessage('Bet must be between $20 and $2,000');
      return;
    }

    if (betAmount > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    setIsRolling(true);
    setMessage('');
    setResult(null);

    // Deduct bet
    updateUserBalance(-betAmount);

    // Animate rolling
    const rollDuration = 2000;
    const rollInterval = 50;
    const rolls = rollDuration / rollInterval;

    for (let i = 0; i < rolls; i++) {
      await new Promise((resolve) => setTimeout(resolve, rollInterval));
      setResult(Math.floor(Math.random() * 100) + 1);
      setDiceRotation((prev) => prev + 90);
    }

    // Final result
    const finalResult = Math.floor(Math.random() * 100) + 1;
    setResult(finalResult);

    // Calculate winnings
    let won = false;
    if (
      (prediction === 'over' && finalResult > targetNumber) ||
      (prediction === 'under' && finalResult < targetNumber)
    ) {
      won = true;
    }

    if (won) {
      const multiplier = calculateMultiplier();
      const payout = Math.floor(betAmount * multiplier);
      updateUserBalance(payout);
      setMessage(`🎉 You won $${payout.toLocaleString()}! (${multiplier.toFixed(2)}x)`);
      addGameHistory({
        game: 'Quantum Dice',
        bet: betAmount,
        result: 'win',
        payout,
      });
    } else {
      setMessage(`😔 You lost. The dice rolled ${finalResult}`);
      addGameHistory({
        game: 'Quantum Dice',
        bet: betAmount,
        result: 'loss',
        payout: 0,
      });
    }

    setIsRolling(false);
  };

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  const multiplier = calculateMultiplier();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
            <span className="gold-text-glow">Quantum Dice</span>
          </h1>
          <p className="text-gray-400">Roll the quantum dice and predict the outcome</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Dice Display */}
          <div className="glass p-8 rounded-2xl">
            <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-green-900 to-black rounded-2xl border-4 border-gold-500 flex items-center justify-center relative overflow-hidden">
              <div
                className="text-9xl font-bold text-gold-400 transition-transform duration-100"
                style={{ transform: `rotate(${diceRotation}deg)` }}
              >
                {result !== null ? result : '?'}
              </div>
              
              {/* Target line indicator */}
              <div
                className="absolute left-0 right-0 h-1 bg-red-500"
                style={{ top: `${100 - targetNumber}%` }}
              >
                <div className="absolute right-2 -top-6 text-red-500 font-bold">
                  {targetNumber}
                </div>
              </div>
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
                min={20}
                max={2000}
                step={10}
                disabled={isRolling}
                className="w-full px-4 py-3 bg-dark-100 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 text-white text-lg font-semibold"
              />
              <div className="flex gap-2 mt-3">
                {[100, 250, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isRolling}
                    className="flex-1 btn-outline-gold py-2 rounded-lg text-sm"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Number */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gold-400">Target Number</h3>
              <input
                type="range"
                value={targetNumber}
                onChange={(e) => setTargetNumber(Number(e.target.value))}
                min={2}
                max={98}
                disabled={isRolling}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-gray-400">2</span>
                <span className="text-2xl font-bold text-gold-400">{targetNumber}</span>
                <span className="text-gray-400">98</span>
              </div>
            </div>

            {/* Prediction */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gold-400">
                Prediction ({multiplier.toFixed(2)}x)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPrediction('under')}
                  disabled={isRolling}
                  className={`py-4 rounded-lg font-bold transition-all ${
                    prediction === 'under'
                      ? 'bg-blue-500 text-white scale-105'
                      : 'bg-blue-900/50 text-blue-400 hover:bg-blue-900'
                  }`}
                >
                  Under {targetNumber}
                </button>
                <button
                  onClick={() => setPrediction('over')}
                  disabled={isRolling}
                  className={`py-4 rounded-lg font-bold transition-all ${
                    prediction === 'over'
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-green-900/50 text-green-400 hover:bg-green-900'
                  }`}
                >
                  Over {targetNumber}
                </button>
              </div>
            </div>

            {/* Potential Win */}
            <div className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Potential Win:</span>
                <span className="text-2xl font-bold text-gold-400">
                  ${Math.floor(betAmount * multiplier).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Roll Button */}
            <button
              onClick={handleRoll}
              disabled={isRolling || !prediction}
              className="w-full btn-gold py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isRolling ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  <span>Rolling...</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Roll Dice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
