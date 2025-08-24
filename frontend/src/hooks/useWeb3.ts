import { useState, useEffect, useCallback } from 'react';
import { web3Service } from '../services/web3Service';

interface Web3State {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  chainId: number | null;
  networkName: string | null;
}

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    account: null,
    balance: null,
    isLoading: false,
    error: null,
    chainId: null,
    networkName: null
  });

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { address, balance } = await web3Service.connectWallet();
      const networkInfo = await web3Service.getNetworkInfo();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        account: address,
        balance,
        chainId: networkInfo.chainId,
        networkName: networkInfo.name,
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    web3Service.removeAllListeners();
    setState({
      isConnected: false,
      account: null,
      balance: null,
      isLoading: false,
      error: null,
      chainId: null,
      networkName: null
    });
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!state.account) return;
    
    try {
      const balance = await web3Service.getBalance(state.account);
      setState(prev => ({ ...prev, balance }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  }, [state.account]);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = web3Service.isMetaMaskInstalled();

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled) return;
      
      try {
        const account = await web3Service.getCurrentAccount();
        if (account) {
          await connectWallet();
        }
      } catch (error) {
        console.log('No previous connection found');
      }
    };

    checkConnection();
  }, [isMetaMaskInstalled, connectWallet]);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== state.account) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [isMetaMaskInstalled, state.account, connectWallet, disconnectWallet]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    isMetaMaskInstalled
  };
};
