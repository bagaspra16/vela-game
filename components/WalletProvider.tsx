'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserData, initializeUser, updateBalance, UserData } from '@/lib/storage';

interface WalletContextType {
  userData: UserData | null;
  balance: number;
  isInitialized: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateUserBalance: (amount: number) => void;
  refreshUserData: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [balance, setBalance] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check for existing user on mount
    const existingUser = getUserData();
    if (existingUser) {
      setUserData(existingUser);
      setBalance(existingUser.balance);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const login = (username: string) => {
    const user = initializeUser(username);
    setUserData(user);
    setBalance(user.balance);
  };

  const logout = () => {
    setUserData(null);
    setBalance(0);
  };

  const updateUserBalance = (amount: number) => {
    const newBalance = updateBalance(amount);
    setBalance(newBalance);
    refreshUserData();
  };

  const refreshUserData = () => {
    const data = getUserData();
    if (data) {
      setUserData(data);
      setBalance(data.balance);
    } else {
      // If no data found, logout
      logout();
    }
  };

  return (
    <WalletContext.Provider
      value={{
        userData,
        balance,
        isInitialized,
        login,
        logout,
        updateUserBalance,
        refreshUserData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
