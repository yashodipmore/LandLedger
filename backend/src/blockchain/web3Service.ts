import { ethers } from 'ethers';
import { blockchainConfig, validateConfig } from './config';
import LandRegistryABI from './abis/LandRegistry.json';
import DocumentVerificationABI from './abis/DocumentVerification.json';

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private landRegistryContract: ethers.Contract;
  private documentVerificationContract: ethers.Contract;

  constructor() {
    // Validate configuration
    validateConfig();
    
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(blockchainConfig.rpcUrl);
    
    // Initialize wallet
    this.wallet = new ethers.Wallet(blockchainConfig.privateKey, this.provider);
    
    // Initialize contracts
    this.landRegistryContract = new ethers.Contract(
      blockchainConfig.landRegistryAddress,
      LandRegistryABI,
      this.wallet
    );
    
    this.documentVerificationContract = new ethers.Contract(
      blockchainConfig.documentVerificationAddress,
      DocumentVerificationABI,
      this.wallet
    );
  }

  // Network Information
  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();
      
      return {
        chainId: Number(network.chainId),
        name: network.name,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
        maxFeePerGas: gasPrice.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString()
      };
    } catch (error) {
      throw new Error(`Failed to get network info: ${error}`);
    }
  }

  // Account Information
  async getAccountInfo() {
    try {
      const address = await this.wallet.getAddress();
      const balance = await this.provider.getBalance(address);
      const nonce = await this.wallet.getNonce();
      
      return {
        address,
        balance: ethers.formatEther(balance),
        nonce
      };
    } catch (error) {
      throw new Error(`Failed to get account info: ${error}`);
    }
  }

  // Contract Getters
  getLandRegistryContract() {
    return this.landRegistryContract;
  }

  getDocumentVerificationContract() {
    return this.documentVerificationContract;
  }

  getProvider() {
    return this.provider;
  }

  getWallet() {
    return this.wallet;
  }

  // Transaction Utilities
  async estimateGas(contract: ethers.Contract, methodName: string, params: any[]) {
    try {
      const gasEstimate = await contract[methodName].estimateGas(...params);
      return gasEstimate.toString();
    } catch (error) {
      throw new Error(`Failed to estimate gas: ${error}`);
    }
  }

  async waitForTransaction(txHash: string) {
    try {
      const receipt = await this.provider.waitForTransaction(txHash);
      return receipt;
    } catch (error) {
      throw new Error(`Transaction failed: ${error}`);
    }
  }

  // Event Listeners
  onLandRegistered(callback: (event: any) => void) {
    this.landRegistryContract.on('LandRegistered', callback);
  }

  onTransferRequested(callback: (event: any) => void) {
    this.landRegistryContract.on('TransferRequested', callback);
  }

  onTransferApproved(callback: (event: any) => void) {
    this.landRegistryContract.on('TransferApproved', callback);
  }

  onDocumentUploaded(callback: (event: any) => void) {
    this.documentVerificationContract.on('DocumentUploaded', callback);
  }

  // Cleanup
  removeAllListeners() {
    this.landRegistryContract.removeAllListeners();
    this.documentVerificationContract.removeAllListeners();
  }
}

// Singleton instance
export const web3Service = new Web3Service();
