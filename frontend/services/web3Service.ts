import { ethers } from 'ethers'
import LandRegistryABI from '@/contracts/LandRegistry.json'
import DocumentVerificationABI from '@/contracts/DocumentVerification.json'

// Contract addresses (update these with your deployed contract addresses)
const LAND_REGISTRY_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const DOCUMENT_VERIFICATION_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// Hardhat local network configuration
const HARDHAT_NETWORK = {
  chainId: '0x7A69', // 31337 in hex
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: ['http://localhost:8545']
}

declare global {
  interface Window {
    ethereum?: any
  }
}

class Web3Service {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private landRegistryContract: ethers.Contract | null = null
  private documentVerificationContract: ethers.Contract | null = null

  async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask browser extension to continue.')
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.')
      }

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      // Initialize contracts
      this.initializeContracts()

      return accounts[0]
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      if (error.code === 4001) {
        throw new Error('User rejected the connection request')
      }
      throw error
    }
  }

  disconnectWallet(): void {
    this.provider = null
    this.signer = null
    this.landRegistryContract = null
    this.documentVerificationContract = null
  }

  isWalletConnected(): boolean {
    return this.provider !== null && this.signer !== null
  }

  getCurrentAccount(): string | null {
    if (!this.signer) return null
    return this.signer.address || null
  }

  async getChainId(): Promise<number> {
    if (!this.provider) {
      throw new Error('Provider not initialized')
    }
    const network = await this.provider.getNetwork()
    return Number(network.chainId)
  }

  async switchToHardhatNetwork(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask browser extension to continue.')
    }

    try {
      // Try to switch to Hardhat network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HARDHAT_NETWORK.chainId }]
      })
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [HARDHAT_NETWORK]
        })
      } else {
        throw switchError
      }
    }
  }

  private initializeContracts(): void {
    if (!this.signer) {
      throw new Error('Signer not initialized')
    }

    this.landRegistryContract = new ethers.Contract(
      LAND_REGISTRY_ADDRESS,
      LandRegistryABI.abi,
      this.signer
    )

    this.documentVerificationContract = new ethers.Contract(
      DOCUMENT_VERIFICATION_ADDRESS,
      DocumentVerificationABI.abi,
      this.signer
    )
  }

  // Land Registry Methods
  async registerLand(
    ownerAddress: string,
    area: number,
    location: string,
    landType: string,
    documentHash: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.landRegistryContract) {
      throw new Error('Land Registry contract not initialized')
    }

    try {
      const tx = await this.landRegistryContract.registerLand(
        ownerAddress,
        ethers.parseUnits(area.toString(), 18),
        location,
        landType,
        documentHash
      )
      return tx
    } catch (error) {
      console.error('Error registering land:', error)
      throw error
    }
  }

  async transferLand(
    landId: number,
    newOwner: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.landRegistryContract) {
      throw new Error('Land Registry contract not initialized')
    }

    try {
      const tx = await this.landRegistryContract.transferLand(landId, newOwner)
      return tx
    } catch (error) {
      console.error('Error transferring land:', error)
      throw error
    }
  }

  async getLandDetails(landId: number): Promise<any> {
    if (!this.landRegistryContract) {
      throw new Error('Land Registry contract not initialized')
    }

    try {
      const land = await this.landRegistryContract.lands(landId)
      return {
        id: landId,
        owner: land.owner,
        area: ethers.formatUnits(land.area, 18),
        location: land.location,
        landType: land.landType,
        documentHash: land.documentHash,
        isVerified: land.isVerified,
        registrationDate: new Date(Number(land.registrationDate) * 1000)
      }
    } catch (error) {
      console.error('Error getting land details:', error)
      throw error
    }
  }

  async getLandsByOwner(ownerAddress: string): Promise<number[]> {
    if (!this.landRegistryContract) {
      throw new Error('Land Registry contract not initialized')
    }

    try {
      const landIds = await this.landRegistryContract.getLandsByOwner(ownerAddress)
      return landIds.map((id: any) => Number(id))
    } catch (error) {
      console.error('Error getting lands by owner:', error)
      throw error
    }
  }

  // Document Verification Methods
  async uploadDocument(
    documentHash: string,
    documentType: string,
    description: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.documentVerificationContract) {
      throw new Error('Document Verification contract not initialized')
    }

    try {
      const tx = await this.documentVerificationContract.uploadDocument(
        documentHash,
        documentType,
        description
      )
      return tx
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  }

  async verifyDocument(documentHash: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.documentVerificationContract) {
      throw new Error('Document Verification contract not initialized')
    }

    try {
      const tx = await this.documentVerificationContract.verifyDocument(documentHash)
      return tx
    } catch (error) {
      console.error('Error verifying document:', error)
      throw error
    }
  }

  async getDocumentInfo(documentHash: string): Promise<any> {
    if (!this.documentVerificationContract) {
      throw new Error('Document Verification contract not initialized')
    }

    try {
      const doc = await this.documentVerificationContract.documents(documentHash)
      return {
        uploader: doc.uploader,
        documentType: doc.documentType,
        description: doc.description,
        timestamp: new Date(Number(doc.timestamp) * 1000),
        isVerified: doc.isVerified,
        verifiedBy: doc.verifiedBy
      }
    } catch (error) {
      console.error('Error getting document info:', error)
      throw error
    }
  }

  // Event Listeners
  onLandRegistered(callback: (landId: number, owner: string, location: string) => void): void {
    if (!this.landRegistryContract) return

    this.landRegistryContract.on('LandRegistered', (landId, owner, location) => {
      callback(Number(landId), owner, location)
    })
  }

  onLandTransferred(callback: (landId: number, from: string, to: string) => void): void {
    if (!this.landRegistryContract) return

    this.landRegistryContract.on('LandTransferred', (landId, from, to) => {
      callback(Number(landId), from, to)
    })
  }

  onDocumentUploaded(callback: (documentHash: string, uploader: string) => void): void {
    if (!this.documentVerificationContract) return

    this.documentVerificationContract.on('DocumentUploaded', (documentHash, uploader) => {
      callback(documentHash, uploader)
    })
  }

  onDocumentVerified(callback: (documentHash: string, verifier: string) => void): void {
    if (!this.documentVerificationContract) return

    this.documentVerificationContract.on('DocumentVerified', (documentHash, verifier) => {
      callback(documentHash, verifier)
    })
  }
}

export const web3Service = new Web3Service()
