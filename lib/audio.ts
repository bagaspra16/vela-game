// Audio management utilities
import { getSettings } from './storage';

class AudioManager {
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private backgroundMusic: HTMLAudioElement | null = null;
  private initialized = false;

  // Initialize audio manager
  init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;
  }

  // Play sound effect
  playSound(soundName: string) {
    if (typeof window === 'undefined') return;
    
    const settings = getSettings();
    if (!settings.soundEnabled) return;

    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different sounds for different actions
      switch (soundName) {
        case 'click':
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'win':
          oscillator.frequency.value = 1200;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'lose':
          oscillator.frequency.value = 300;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'spin':
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.08;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
        case 'coin':
          oscillator.frequency.value = 1000;
          gainNode.gain.value = 0.12;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        default:
          oscillator.frequency.value = 500;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      console.log('Audio playback not supported');
    }
  }

  // Play background music (placeholder - would need actual audio files)
  playMusic() {
    if (typeof window === 'undefined') return;
    
    const settings = getSettings();
    if (!settings.musicEnabled) {
      this.stopMusic();
      return;
    }

    // Placeholder for background music
    // In production, you would load and play an actual audio file
    console.log('Background music would play here');
  }

  // Stop background music
  stopMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  // Check if animations are enabled
  areAnimationsEnabled(): boolean {
    const settings = getSettings();
    return settings.animationsEnabled;
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Helper functions
export const playSound = (soundName: string) => {
  audioManager.playSound(soundName);
};

export const playMusic = () => {
  audioManager.playMusic();
};

export const stopMusic = () => {
  audioManager.stopMusic();
};

export const areAnimationsEnabled = () => {
  return audioManager.areAnimationsEnabled();
};
