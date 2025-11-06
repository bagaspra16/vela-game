// LocalStorage utilities for data persistence

export interface UserData {
  balance: number;
  username: string;
  gamesPlayed: number;
  totalWinnings: number;
  totalLosses: number;
  createdAt: string;
  lastLogin: string;
}

export interface GameHistory {
  id: string;
  game: string;
  bet: number;
  result: 'win' | 'loss';
  payout: number;
  timestamp: string;
}

const STORAGE_KEYS = {
  USER_DATA: 'vela_user_data',
  GAME_HISTORY: 'vela_game_history',
  SETTINGS: 'vela_settings',
};

// User Data Management
export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const initializeUser = (username: string): UserData => {
  const userData: UserData = {
    balance: 10000, // Starting balance
    username,
    gamesPlayed: 0,
    totalWinnings: 0,
    totalLosses: 0,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  return userData;
};

export const updateUserData = (updates: Partial<UserData>): UserData | null => {
  const currentData = getUserData();
  if (!currentData) return null;
  
  const updatedData = {
    ...currentData,
    ...updates,
    lastLogin: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedData));
  return updatedData;
};

export const updateBalance = (amount: number): number => {
  const userData = getUserData();
  if (!userData) return 0;
  
  const newBalance = userData.balance + amount;
  updateUserData({ balance: newBalance });
  
  return newBalance;
};

// Game History Management
export const getGameHistory = (): GameHistory[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const addGameHistory = (game: Omit<GameHistory, 'id' | 'timestamp'>): void => {
  const history = getGameHistory();
  const newEntry: GameHistory = {
    ...game,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  const updatedHistory = [newEntry, ...history].slice(0, 100); // Keep last 100 games
  localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updatedHistory));
  
  // Update user stats
  const userData = getUserData();
  if (userData) {
    const updates: Partial<UserData> = {
      gamesPlayed: userData.gamesPlayed + 1,
    };
    
    if (game.result === 'win') {
      updates.totalWinnings = userData.totalWinnings + game.payout;
    } else {
      updates.totalLosses = userData.totalLosses + game.bet;
    }
    
    updateUserData(updates);
  }
};

export const clearGameHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
};

// Settings Management
export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'dark' | 'darker';
}

export const getSettings = (): Settings => {
  if (typeof window === 'undefined') {
    return {
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      theme: 'dark',
    };
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!data) {
    return {
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      theme: 'dark',
    };
  }
  
  try {
    return JSON.parse(data);
  } catch {
    return {
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      theme: 'dark',
    };
  }
};

export const updateSettings = (updates: Partial<Settings>): void => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...updates };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
};

// Reset all data
export const resetAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
};
