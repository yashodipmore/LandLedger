import dotenv from 'dotenv';

dotenv.config();

export const blockchainConfig = {
  // Network Configuration
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545',
  chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '31337'),
  
  // Contract Addresses
  landRegistryAddress: process.env.LAND_REGISTRY_CONTRACT || '',
  documentVerificationAddress: process.env.DOCUMENT_VERIFICATION_CONTRACT || '',
  
  // Private Keys
  privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
  
  // Gas Configuration
  gasLimit: 3000000,
  gasPrice: '20000000000', // 20 gwei
  
  // Network Names
  networks: {
    hardhat: {
      name: 'Hardhat Local',
      chainId: 31337,
      rpcUrl: 'http://127.0.0.1:8545'
    },
    sepolia: {
      name: 'Sepolia Testnet',
      chainId: 11155111,
      rpcUrl: process.env.ETHEREUM_RPC_URL || ''
    }
  }
};

// Validation
export const validateConfig = () => {
  const required = [
    'BLOCKCHAIN_RPC_URL',
    'LAND_REGISTRY_CONTRACT', 
    'DOCUMENT_VERIFICATION_CONTRACT',
    'BLOCKCHAIN_PRIVATE_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing blockchain environment variables: ${missing.join(', ')}`);
  }
  
  return true;
};
