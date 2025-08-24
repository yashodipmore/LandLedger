'use client'

import { useState, useEffect, useCallback } from 'react'
import { web3Service } from '@/services/web3Service'

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCorrectNetwork = chainId === 31337 // Hardhat local network

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const account = await web3Service.connectWallet()
      if (account) {
        setAccount(account)
        setIsConnected(true)
        
        // Get chain ID
        const chainId = await web3Service.getChainId()
        setChainId(chainId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setIsConnected(false)
    setChainId(null)
    setError(null)
    web3Service.disconnectWallet()
  }, [])

  const switchNetwork = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await web3Service.switchToHardhatNetwork()
      const chainId = await web3Service.getChainId()
      setChainId(chainId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch network')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (web3Service.isWalletConnected()) {
        const account = web3Service.getCurrentAccount()
        if (account) {
          setAccount(account)
          setIsConnected(true)
          
          const chainId = await web3Service.getChainId()
          setChainId(chainId)
        }
      }
    }

    checkConnection()

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setAccount(accounts[0])
        setIsConnected(true)
      }
    }

    // Listen for chain changes
    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16))
    }

    // Add event listeners
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum?.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [disconnectWallet])

  return {
    account,
    isConnected,
    chainId,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isLoading,
    error
  }
}
