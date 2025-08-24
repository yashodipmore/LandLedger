'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  chainId: number | null;
  networkName: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
  isMetaMaskInstalled: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const web3Data = useWeb3();

  return (
    <Web3Context.Provider value={web3Data}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
};
