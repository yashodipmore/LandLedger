'use client';

import { useWeb3Context } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WalletButton() {
  const {
    isConnected,
    account,
    balance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
    networkName
  } = useWeb3Context();

  if (!isMetaMaskInstalled) {
    return (
      <Button 
        variant="outline" 
        className="border-orange-200 text-orange-600 hover:bg-orange-50"
        onClick={() => window.open('https://metamask.io/download/', '_blank')}
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Install MetaMask
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (error) {
    return (
      <Button 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50"
        onClick={connectWallet}
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Retry Connection
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center space-x-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
        >
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-sm">
            <div className="font-medium text-green-700">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            <div className="text-xs text-green-600">
              {parseFloat(balance || "0").toFixed(4)} ETH
            </div>
          </div>
        </motion.div>
        {networkName && (
          <Badge variant="secondary" className="text-xs">
            {networkName}
          </Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="text-xs"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
