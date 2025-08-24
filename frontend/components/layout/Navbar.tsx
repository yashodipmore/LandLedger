'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useWeb3Context } from '@/context/Web3Context'

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Citizen Services', path: '/citizen' },
  { name: 'Land Owner', path: '/owner' },
  { name: 'Government Official', path: '/official' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { 
    account, 
    isConnected, 
    isCorrectNetwork, 
    connectWallet, 
    disconnectWallet, 
    switchNetwork,
    isLoading,
    error 
  } = useWeb3Context()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnectWallet()
    } else {
      try {
        await connectWallet()
      } catch (err) {
        console.error('Failed to connect wallet:', err)
      }
    }
  }

  const handleNetworkSwitch = async () => {
    try {
      await switchNetwork()
    } catch (err) {
      console.error('Failed to switch network:', err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                LandLedger
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            {mounted && isConnected && !isCorrectNetwork && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600">Wrong Network</span>
                <Button
                  onClick={handleNetworkSwitch}
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                >
                  Switch to Hardhat
                </Button>
              </div>
            )}

            {/* Wallet Connection */}
            <div className="flex items-center space-x-2">
              {mounted && isConnected && account ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <Button
                    onClick={handleWalletConnect}
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : mounted ? (
                <Button
                  onClick={handleWalletConnect}
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              ) : (
                <Button size="sm" disabled>
                  Connect Wallet
                </Button>
              )}
            </div>

            {/* Error Display */}
            {mounted && error && (
              <div className="text-sm text-red-600 max-w-xs truncate">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
