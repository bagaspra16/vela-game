'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import { getSettings, updateSettings, resetAllData, Settings } from '@/lib/storage';
import { playSound } from '@/lib/audio';
import { Volume2, VolumeX, Music, Sparkles, Trash2, User, Check } from 'lucide-react';

export default function SettingsPage() {
  const { userData, logout } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    theme: 'dark',
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userData) {
      router.push('/login');
    }
  }, [userData, router, mounted]);

  useEffect(() => {
    if (mounted) {
      setSettings(getSettings());
    }
  }, [mounted]);

  const handleSettingChange = (key: keyof Settings, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings({ [key]: value });
    
    // Play sound effect when toggling (if sound is being enabled or if it's already enabled)
    if (key === 'soundEnabled' && value === true) {
      playSound('click');
    } else if (key !== 'soundEnabled' && settings.soundEnabled) {
      playSound('click');
    }
  };

  const handleReset = () => {
    // Play sound effect
    playSound('click');
    
    // Reset all data from localStorage
    resetAllData();
    
    // Logout user (clear context state)
    logout();
    
    // Redirect to login page immediately
    router.push('/login');
  };

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gold-text-glow">Settings</span>
          </h1>
          <p className="text-xl text-gray-400">
            Customize your gaming experience
          </p>
        </div>

        {/* User Profile */}
        <div className="glass p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gold-400 flex items-center space-x-2">
            <User size={24} />
            <span>Profile</span>
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Username</span>
              <span className="font-semibold text-white">{userData.username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Balance</span>
              <span className="font-semibold text-gold-400">
                ${userData.balance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Games Played</span>
              <span className="font-semibold text-white">{userData.gamesPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Member Since</span>
              <span className="font-semibold text-white">
                {new Date(userData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="glass p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gold-400 flex items-center space-x-2">
            <Volume2 size={24} />
            <span>Audio</span>
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-white mb-1">Sound Effects</div>
                <div className="text-sm text-gray-400">Enable game sound effects</div>
              </div>
              <button
                onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  settings.soundEnabled ? 'bg-gold-500 shadow-lg shadow-gold-500/50' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 flex items-center justify-center ${
                    settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                >
                  {settings.soundEnabled && <Check size={14} className="text-gold-500" />}
                </div>
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-white mb-1">Background Music</div>
                <div className="text-sm text-gray-400">Enable background music</div>
              </div>
              <button
                onClick={() => handleSettingChange('musicEnabled', !settings.musicEnabled)}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  settings.musicEnabled ? 'bg-gold-500 shadow-lg shadow-gold-500/50' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 flex items-center justify-center ${
                    settings.musicEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                >
                  {settings.musicEnabled && <Check size={14} className="text-gold-500" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Settings */}
        <div className="glass p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gold-400 flex items-center space-x-2">
            <Sparkles size={24} />
            <span>Visual</span>
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-white mb-1">Animations</div>
                <div className="text-sm text-gray-400">Enable visual animations</div>
              </div>
              <button
                onClick={() =>
                  handleSettingChange('animationsEnabled', !settings.animationsEnabled)
                }
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  settings.animationsEnabled ? 'bg-gold-500 shadow-lg shadow-gold-500/50' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 flex items-center justify-center ${
                    settings.animationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                >
                  {settings.animationsEnabled && <Check size={14} className="text-gold-500" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass p-8 rounded-2xl border-2 border-red-500/30">
          <h2 className="text-2xl font-bold mb-6 text-red-400 flex items-center space-x-2">
            <Trash2 size={24} />
            <span>Danger Zone</span>
          </h2>
          <div className="space-y-4">
            <p className="text-gray-400">
              Reset all data including your balance, game history, and settings. This action cannot
              be undone.
            </p>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reset All Data
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-400 font-semibold">
                  Are you sure? This will delete everything!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="btn-outline-gold px-6 py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
