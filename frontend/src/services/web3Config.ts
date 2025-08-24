// Web3 Configuration for LandLedger Frontend
export const WEB3_CONFIG = {
  // Local Hardhat Network
  LOCAL: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    contracts: {
      landRegistry: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      documentVerification: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    }
  },
  
  // Sepolia Testnet (for production testing)
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
    contracts: {
      landRegistry: process.env.NEXT_PUBLIC_LAND_REGISTRY_CONTRACT || '',
      documentVerification: process.env.NEXT_PUBLIC_DOCUMENT_VERIFICATION_CONTRACT || ''
    }
  }
};

// Current active network (change this based on environment)
export const ACTIVE_NETWORK = WEB3_CONFIG.LOCAL;

// MetaMask connection settings
export const METAMASK_CONFIG = {
  chainId: `0x${ACTIVE_NETWORK.chainId.toString(16)}`,
  chainName: ACTIVE_NETWORK.name,
  rpcUrls: [ACTIVE_NETWORK.rpcUrl],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  }
};

// Contract addresses
export const CONTRACT_ADDRESSES = ACTIVE_NETWORK.contracts;
