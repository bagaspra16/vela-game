'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import { User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, userData } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      router.push('/games');
    }
  }, [userData, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim().length < 3) {
      alert('Username must be at least 3 characters long');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      login(username.trim());
      setIsLoading(false);
      router.push('/games');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4">
              <User size={32} className="text-black" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to <span className="gold-text-glow">VELA</span>
            </h1>
            <p className="text-gray-400">
              Enter your username to start playing
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-100 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder-gray-500 transition-colors"
                placeholder="Enter your username"
                required
                minLength={3}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimum 3 characters. You'll start with $10,000 balance.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || username.trim().length < 3}
              className="w-full btn-gold px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Start Playing</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gold-500/20">
            <div className="text-center text-sm text-gray-400">
              <p className="mb-2">🎮 No registration required</p>
              <p className="mb-2">💰 Instant $10,000 starting balance</p>
              <p>🔒 Data stored locally on your device</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
