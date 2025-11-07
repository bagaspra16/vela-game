'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from './WalletProvider';
import { Wallet, Menu, X, Home, Gamepad2, History, Settings } from 'lucide-react';

export default function Navigation() {
  const { userData, balance } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image
                src="/vela-logo.png"
                alt="VELA Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold gold-text-glow hidden sm:block">VELA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors"
            >
              <Gamepad2 size={18} />
              <span>Games</span>
            </Link>
            <Link
              href="/history"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors"
            >
              <History size={18} />
              <span>History</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </div>

          {/* Wallet Display */}
          <div className="hidden md:flex items-center space-x-4">
            {userData ? (
              <>
                <div className="glass px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Wallet size={18} className="text-gold-400" />
                  <span className="font-semibold text-gold-400">
                    ${balance.toLocaleString()}
                  </span>
                </div>
                <div className="glass px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-300">{userData.username}</span>
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="btn-gold px-6 py-2 rounded-lg">
                  Login / Register
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gold-400 p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass rounded-lg p-4 space-y-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Gamepad2 size={18} />
              <span>Games</span>
            </Link>
            <Link
              href="/history"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <History size={18} />
              <span>History</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-2 text-gray-300 hover:text-gold-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            
            {userData ? (
              <div className="pt-4 border-t border-gold-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Balance:</span>
                  <span className="font-semibold text-gold-400">
                    ${balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">User:</span>
                  <span className="text-sm text-gray-300">{userData.username}</span>
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="btn-gold w-full px-6 py-2 rounded-lg mt-4">
                  Login / Register
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
