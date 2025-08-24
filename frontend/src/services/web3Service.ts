import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ACTIVE_NETWORK, METAMASK_CONFIG } from './web3Config';
import LandRegistryABI from '../contracts/LandRegistry.json';
import DocumentVerificationABI from '../contracts/DocumentVerification.json';

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private landRegistryContract: ethers.Contract | null = null;
  private documentVerificationContract: ethers.Contract | null = null;

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connectWallet(): Promise<{ address: string; balance: string }> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask browser extension to continue.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Get account info
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      
      // Initialize contracts
      this.initializeContracts();
      
      // Switch to correct network if needed
      await this.switchToCorrectNetwork();
      
      return {
        address,
        balance: ethers.formatEther(balance)
      };
    } catch (error: any) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // Switch to the correct network
  async switchToCorrectNetwork(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: METAMASK_CONFIG.chainId }]
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [METAMASK_CONFIG]
          });
        } catch (addError: any) {
          throw new Error(`Failed to add network: ${addError.message}`);
        }
      } else {
        throw new Error(`Failed to switch network: ${switchError.message}`);
      }
    }
  }

  // Initialize smart contracts
  private initializeContracts(): void {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    this.landRegistryContract = new ethers.Contract(
      CONTRACT_ADDRESSES.landRegistry,
      LandRegistryABI,
      this.signer
    );

    this.documentVerificationContract = new ethers.Contract(
      CONTRACT_ADDRESSES.documentVerification,
      DocumentVerificationABI,
      this.signer
    );
  }

  // Get current account
  async getCurrentAccount(): Promise<string | null> {
    if (!this.signer) return null;
    
    try {
      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      console.error('Failed to get current account:', error);
      return null;
    }
  }

  // Get account balance
  async getBalance(address?: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const accountAddress = address || await this.getCurrentAccount();
    if (!accountAddress) throw new Error('No account found');
    
    const balance = await this.provider.getBalance(accountAddress);
    return ethers.formatEther(balance);
  }

  // Get network info
  async getNetworkInfo(): Promise<{ chainId: number; name: string }> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const network = await this.provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name
    };
  }

  // Land Registry Contract Methods
  
  // Register a new land
  async registerLand(data: {
    landId: string;
    owner: string;
    latitude: number;
    longitude: number;
    area: number;
    documentHash: string;
    physicalAddress: string;
    landType: string;
  }): Promise<ethers.ContractTransactionResponse> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.registerLand(
      data.landId,
      data.owner,
      data.latitude,
      data.longitude,
      data.area,
      data.documentHash,
      data.physicalAddress,
      data.landType
    );
  }

  // Get land details
  async getLandDetails(landId: string): Promise<any> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.getLandDetails(landId);
  }

  // Request transfer
  async requestTransfer(landId: string, newOwner: string, amount: string = "0"): Promise<ethers.ContractTransactionResponse> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    const amountInWei = ethers.parseEther(amount);
    return await this.landRegistryContract.requestTransfer(landId, newOwner, amountInWei);
  }

  // Approve transfer (officials only)
  async approveTransfer(landId: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.approveTransfer(landId);
  }

  // Reject transfer (officials only)
  async rejectTransfer(landId: string, reason: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.rejectTransfer(landId, reason);
  }

  // Get owner lands
  async getOwnerLands(ownerAddress: string): Promise<string[]> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.getOwnerLands(ownerAddress);
  }

  // Get pending transfer
  async getPendingTransfer(landId: string): Promise<any> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.getPendingTransfer(landId);
  }

  // Verify user (officials only)
  async verifyUser(userAddress: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.verifyUser(userAddress);
  }

  // Check if user is verified
  async isUserVerified(userAddress: string): Promise<boolean> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    return await this.landRegistryContract.isUserVerified(userAddress);
  }

  // Get contract statistics
  async getContractStats(): Promise<any> {
    if (!this.landRegistryContract) throw new Error('Contract not initialized');
    
    const totalLands = await this.landRegistryContract.totalLands();
    const totalTransfers = await this.landRegistryContract.totalTransfers();
    
    return {
      totalLands: Number(totalLands),
      totalTransfers: Number(totalTransfers)
    };
  }

  // Event listeners
  onLandRegistered(callback: (landId: string, owner: string, timestamp: number) => void): void {
    if (!this.landRegistryContract) return;
    
    this.landRegistryContract.on('LandRegistered', callback);
  }

  onTransferRequested(callback: (landId: string, from: string, to: string, timestamp: number) => void): void {
    if (!this.landRegistryContract) return;
    
    this.landRegistryContract.on('TransferRequested', callback);
  }

  onTransferApproved(callback: (landId: string, newOwner: string, approvedBy: string, timestamp: number) => void): void {
    if (!this.landRegistryContract) return;
    
    this.landRegistryContract.on('TransferApproved', callback);
  }

  // Cleanup
  removeAllListeners(): void {
    if (this.landRegistryContract) {
      this.landRegistryContract.removeAllListeners();
    }
    if (this.documentVerificationContract) {
      this.documentVerificationContract.removeAllListeners();
    }
  }
}

// Export singleton instance
export const web3Service = new Web3Service();

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
