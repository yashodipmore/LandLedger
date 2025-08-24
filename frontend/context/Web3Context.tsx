'use client'

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useWeb3 } from '@/hooks/useWeb3'

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  chainId: number | null
  isCorrectNetwork: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: () => Promise<void>
  isLoading: boolean
  error: string | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false)
  const web3State = useWeb3()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render context value until mounted on client
  if (!mounted) {
    const defaultValue: Web3ContextType = {
      account: null,
      isConnected: false,
      chainId: null,
      isCorrectNetwork: false,
      connectWallet: async () => {},
      disconnectWallet: () => {},
      switchNetwork: async () => {},
      isLoading: false,
      error: null,
    }
    
    return (
      <Web3Context.Provider value={defaultValue}>
        {children}
      </Web3Context.Provider>
    )
  }

  return (
    <Web3Context.Provider value={web3State}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3Context() {
  const context = useContext(Web3Context)
  
  // Handle SSR case
  if (typeof window === 'undefined') {
    return {
      account: null,
      isConnected: false,
      chainId: null,
      isCorrectNetwork: false,
      connectWallet: async () => {},
      disconnectWallet: () => {},
      switchNetwork: async () => {},
      isLoading: false,
      error: null,
    }
  }
  
  // Handle case where context is undefined
  if (context === undefined) {
    console.error('useWeb3Context called outside of Web3Provider')
    // Return default values instead of throwing
    return {
      account: null,
      isConnected: false,
      chainId: null,
      isCorrectNetwork: false,
      connectWallet: async () => {
        console.warn('Web3Provider not found - wallet connection unavailable')
      },
      disconnectWallet: () => {
        console.warn('Web3Provider not found - wallet disconnection unavailable')
      },
      switchNetwork: async () => {
        console.warn('Web3Provider not found - network switching unavailable')
      },
      isLoading: false,
      error: 'Web3Provider not found',
    }
  }
  
  return context
}
