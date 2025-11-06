'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useWallet } from '@/components/WalletProvider';
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

const Hero3D = dynamic(() => import('@/components/Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
    </div>
  ),
});

export default function Home() {
  const { userData, isInitialized } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Hero3D />
        </div>

        {/* Animated Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black z-10"></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-3 sm:px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="inline-block">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-xs sm:text-sm font-semibold">
                🚀 Welcome to the Future of Gaming
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight px-4">
              <span className="gold-text-glow">SIMPLIFYING BLOCKCHAIN</span>
              <br />
              <span className="text-white">GAMING FOR A</span>
              <br />
              <span className="gold-text-glow">SMARTER TOMORROW</span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto px-4">
              Join the future of digital gaming with a secure, fast, and inclusive platform designed
              for seamless crypto gaming and investment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8 px-4">
              {userData ? (
                <Link href="/games" className="w-full sm:w-auto">
                  <button className="btn-gold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 w-full">
                    <span>Start Playing</span>
                    <ArrowRight size={20} />
                  </button>
                </Link>
              ) : (
                <Link href="/login" className="w-full sm:w-auto">
                  <button className="btn-gold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 w-full">
                    <span>Get Started</span>
                    <ArrowRight size={20} />
                  </button>
                </Link>
              )}
              
              <Link href="/games" className="w-full sm:w-auto">
                <button className="btn-outline-gold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold w-full sm:w-auto">
                  Explore Games
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12 md:pt-16">
              <div className="glass p-4 sm:p-6 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-gold-400">$1M+</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Total Wagered</div>
              </div>
              <div className="glass p-4 sm:p-6 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-gold-400">10K+</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Active Players</div>
              </div>
              <div className="glass p-4 sm:p-6 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-gold-400">99.9%</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Uptime</div>
              </div>
              <div className="glass p-4 sm:p-6 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-gold-400">24/7</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gold-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-16 md:py-24 bg-black">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gold-text-glow">VELA</span>?
            </h2>
            <p className="text-base sm:text-xl text-gray-400 px-4">
              Experience gaming like never before with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="game-card p-6 sm:p-8 text-center float-card">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-black w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gold-400">Innovative Games</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Unique game mechanics you won&apos;t find anywhere else
              </p>
            </div>

            <div className="game-card p-6 sm:p-8 text-center float-card">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <Shield className="text-black w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gold-400">Provably Fair</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Transparent and verifiable game outcomes
              </p>
            </div>

            <div className="game-card p-6 sm:p-8 text-center float-card">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <Zap className="text-black w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gold-400">Instant Payouts</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Lightning-fast withdrawals with no delays
              </p>
            </div>

            <div className="game-card p-6 sm:p-8 text-center float-card">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <TrendingUp className="text-black w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gold-400">High Returns</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Competitive odds and generous payouts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16 md:py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto glass p-6 sm:p-8 md:p-12 rounded-2xl float-card">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to <span className="gold-text-glow">Start Winning</span>?
            </h2>
            <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
              Join thousands of players already enjoying the future of blockchain gaming
            </p>
            {userData ? (
              <Link href="/games" className="w-full sm:w-auto">
                <button className="btn-gold px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold inline-flex items-center justify-center space-x-2 w-full sm:w-auto">
                  <span>Play Now</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            ) : (
              <Link href="/login" className="w-full sm:w-auto">
                <button className="btn-gold px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold inline-flex items-center justify-center space-x-2 w-full sm:w-auto">
                  <span>Get Started</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
