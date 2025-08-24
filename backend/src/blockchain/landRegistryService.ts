import { ethers } from 'ethers';
import { web3Service } from './web3Service';

export interface LandRegistrationData {
  landId: string;
  owner: string;
  latitude: number;
  longitude: number;
  area: number;
  documentHash: string;
  physicalAddress: string;
  landType: string;
}

export interface TransferData {
  landId: string;
  newOwner: string;
  amount: string;
}

export class LandRegistryService {
  private contract: ethers.Contract;

  constructor() {
    this.contract = web3Service.getLandRegistryContract();
  }

  // Land Registration
  async registerLand(data: LandRegistrationData) {
    try {
      const tx = await this.contract.registerLand(
        data.landId,
        data.owner,
        data.latitude,
        data.longitude,
        data.area,
        data.documentHash,
        data.physicalAddress,
        data.landType
      );

      console.log('Land registration transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Land registered successfully:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error: any) {
      console.error('Land registration failed:', error);
      throw new Error(`Land registration failed: ${error.message}`);
    }
  }

  // Get Land Details
  async getLandDetails(landId: string) {
    try {
      const landDetails = await this.contract.getLandDetails(landId);
      
      return {
        landId: landDetails.landId,
        owner: landDetails.owner,
        latitude: Number(landDetails.latitude),
        longitude: Number(landDetails.longitude),
        area: Number(landDetails.area),
        documentHash: landDetails.documentHash,
        physicalAddress: landDetails.physicalAddress,
        landType: landDetails.landType,
        registrationDate: Number(landDetails.registrationDate),
        transferCount: Number(landDetails.transferCount),
        isActive: landDetails.isActive
      };
    } catch (error: any) {
      throw new Error(`Failed to get land details: ${error.message}`);
    }
  }

  // Request Transfer
  async requestTransfer(data: TransferData) {
    try {
      const amountInWei = ethers.parseEther(data.amount);
      
      const tx = await this.contract.requestTransfer(
        data.landId,
        data.newOwner,
        amountInWei
      );

      console.log('Transfer request transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transfer requested successfully:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error: any) {
      console.error('Transfer request failed:', error);
      throw new Error(`Transfer request failed: ${error.message}`);
    }
  }

  // Approve Transfer (Official only)
  async approveTransfer(landId: string) {
    try {
      const tx = await this.contract.approveTransfer(landId);

      console.log('Transfer approval transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transfer approved successfully:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error: any) {
      console.error('Transfer approval failed:', error);
      throw new Error(`Transfer approval failed: ${error.message}`);
    }
  }

  // Reject Transfer (Official only)
  async rejectTransfer(landId: string, reason: string) {
    try {
      const tx = await this.contract.rejectTransfer(landId, reason);

      console.log('Transfer rejection transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transfer rejected successfully:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        reason
      };
    } catch (error: any) {
      console.error('Transfer rejection failed:', error);
      throw new Error(`Transfer rejection failed: ${error.message}`);
    }
  }

  // Get Pending Transfer
  async getPendingTransfer(landId: string) {
    try {
      const transfer = await this.contract.getPendingTransfer(landId);
      
      if (transfer.fromOwner === ethers.ZeroAddress) {
        return null; // No pending transfer
      }

      return {
        landId: transfer.landId,
        fromOwner: transfer.fromOwner,
        toOwner: transfer.toOwner,
        requestDate: Number(transfer.requestDate),
        amount: ethers.formatEther(transfer.amount)
      };
    } catch (error: any) {
      throw new Error(`Failed to get pending transfer: ${error.message}`);
    }
  }

  // Get Owner Lands
  async getOwnerLands(ownerAddress: string) {
    try {
      const landIds = await this.contract.getOwnerLands(ownerAddress);
      return landIds;
    } catch (error: any) {
      throw new Error(`Failed to get owner lands: ${error.message}`);
    }
  }

  // User Verification
  async verifyUser(userAddress: string) {
    try {
      const tx = await this.contract.verifyUser(userAddress);

      console.log('User verification transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('User verified successfully:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error: any) {
      console.error('User verification failed:', error);
      throw new Error(`User verification failed: ${error.message}`);
    }
  }

  // Check if user is verified
  async isUserVerified(userAddress: string) {
    try {
      const isVerified = await this.contract.isUserVerified(userAddress);
      return isVerified;
    } catch (error: any) {
      throw new Error(`Failed to check user verification: ${error.message}`);
    }
  }

  // Get Contract Statistics
  async getContractStats() {
    try {
      const stats = await this.contract.getContractStats();
      
      return {
        totalLands: Number(stats.totalLands),
        totalTransfers: Number(stats.totalTransfers),
        totalOwners: Number(stats.totalOwners)
      };
    } catch (error: any) {
      throw new Error(`Failed to get contract stats: ${error.message}`);
    }
  }

  // Get Transfer History
  async getTransferHistory(landId: string) {
    try {
      const history = await this.contract.getTransferHistory(landId);
      
      return history.map((transfer: any) => ({
        landId: transfer.landId,
        fromOwner: transfer.fromOwner,
        toOwner: transfer.toOwner,
        requestDate: Number(transfer.requestDate),
        approvalDate: Number(transfer.approvalDate),
        approvedBy: transfer.approvedBy,
        status: Number(transfer.status),
        reason: transfer.reason,
        amount: ethers.formatEther(transfer.amount)
      }));
    } catch (error: any) {
      throw new Error(`Failed to get transfer history: ${error.message}`);
    }
  }
}

// Singleton instance
export const landRegistryService = new LandRegistryService();
