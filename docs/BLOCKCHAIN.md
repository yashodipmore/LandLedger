# ⛓️ Blockchain Development Guide

## 📊 Status: **0% Complete** ❌

The blockchain layer needs complete implementation including smart contracts, Web3 integration, and testnet deployment.

---

## 🏗️ Blockchain Architecture

### **Tech Stack**
- **Smart Contracts**: Solidity ^0.8.19
- **Development Framework**: Hardhat
- **Network**: Ethereum Testnet (Sepolia/Goerli)
- **Web3 Library**: ethers.js v6
- **Testing**: Hardhat + Waffle + Chai
- **Deployment**: Hardhat Deploy

### **Project Structure (TO BE CREATED)**
```
blockchain/
├── contracts/                    # Smart contracts
│   ├── LandRegistry.sol         # Main contract
│   ├── AccessControl.sol        # Role management
│   ├── DocumentVerification.sol # Document hashes
│   └── interfaces/
│       ├── ILandRegistry.sol
│       └── IDocumentStore.sol
├── scripts/                     # Deployment scripts
│   ├── deploy.ts
│   ├── setup-roles.ts
│   ├── verify-contracts.ts
│   └── test-deployment.ts
├── test/                        # Contract tests
│   ├── LandRegistry.test.ts
│   ├── AccessControl.test.ts
│   └── Integration.test.ts
├── tasks/                       # Hardhat tasks
│   ├── accounts.ts
│   ├── deploy-land.ts
│   └── verify-document.ts
├── artifacts/                   # Compiled contracts
├── cache/                       # Hardhat cache
├── typechain-types/            # Generated types
├── hardhat.config.ts           # Hardhat configuration
├── package.json
└── .env.example
```

---

## 📜 Smart Contract Architecture

### **1. Main Land Registry Contract**
```solidity
// contracts/LandRegistry.sol
pragma solidity ^0.8.19;

import "./AccessControl.sol";
import "./DocumentVerification.sol";

contract LandRegistry is AccessControl, DocumentVerification {
    
    struct Land {
        string landId;              // Unique identifier
        address owner;              // Current owner address
        int256 latitude;            // Coordinates (scaled)
        int256 longitude;           // Coordinates (scaled)  
        uint256 area;               // Area in square meters
        string documentHash;        // IPFS document hash
        uint256 registrationDate;  // Timestamp
        bool isActive;              // Status flag
        uint256 transferCount;      // Number of transfers
    }
    
    struct Transfer {
        string landId;
        address fromOwner;
        address toOwner;
        uint256 requestDate;
        uint256 approvalDate;
        address approvedBy;
        TransferStatus status;
        string reason;              // For rejections
    }
    
    enum TransferStatus { 
        Pending, 
        Approved, 
        Rejected, 
        Completed 
    }
    
    // State variables
    mapping(string => Land) public lands;
    mapping(address => string[]) public ownerLands;
    mapping(string => Transfer[]) public transferHistory;
    mapping(string => Transfer) public pendingTransfers;
    
    string[] public allLandIds;
    uint256 public totalLands;
    uint256 public totalTransfers;
    
    // Events
    event LandRegistered(
        string indexed landId,
        address indexed owner,
        uint256 timestamp
    );
    
    event TransferRequested(
        string indexed landId,
        address indexed fromOwner,
        address indexed toOwner,
        uint256 timestamp
    );
    
    event TransferApproved(
        string indexed landId,
        address indexed newOwner,
        address indexed approvedBy,
        uint256 timestamp
    );
    
    event OwnershipTransferred(
        string indexed landId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );
    
    // Core Functions (TO BE IMPLEMENTED)
    function registerLand(
        string memory _landId,
        address _owner,
        int256 _latitude,
        int256 _longitude,
        uint256 _area,
        string memory _documentHash
    ) external onlyOfficial {}
    
    function requestTransfer(
        string memory _landId,
        address _newOwner
    ) external onlyOwner(_landId) {}
    
    function approveTransfer(
        string memory _landId
    ) external onlyOfficial {}
    
    function rejectTransfer(
        string memory _landId,
        string memory _reason
    ) external onlyOfficial {}
    
    function getLandDetails(
        string memory _landId
    ) external view returns (Land memory) {}
    
    function getOwnerLands(
        address _owner
    ) external view returns (string[] memory) {}
    
    function getPendingTransfers() 
        external view onlyOfficial returns (Transfer[] memory) {}
    
    function getTransferHistory(
        string memory _landId
    ) external view returns (Transfer[] memory) {}
    
    function verifyLandOwnership(
        string memory _landId,
        address _owner
    ) external view returns (bool) {}
}
```

### **2. Access Control Contract**
```solidity
// contracts/AccessControl.sol
pragma solidity ^0.8.19;

contract AccessControl {
    
    enum Role { 
        None,
        Citizen, 
        Owner, 
        Official,
        Admin 
    }
    
    struct User {
        Role role;
        bool isActive;
        uint256 registrationDate;
        string name;
        string email;
    }
    
    mapping(address => User) public users;
    mapping(Role => address[]) public roleMembers;
    
    address public admin;
    uint256 public totalUsers;
    
    event RoleGranted(address indexed user, Role indexed role);
    event RoleRevoked(address indexed user, Role indexed role);
    event UserRegistered(address indexed user, Role indexed role);
    
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin, "Admin access required");
        _;
    }
    
    modifier onlyOfficial() {
        require(
            users[msg.sender].role == Role.Official || 
            users[msg.sender].role == Role.Admin,
            "Official access required"
        );
        _;
    }
    
    modifier onlyOwner(string memory _landId) {
        require(
            isLandOwner(_landId, msg.sender),
            "Land owner access required"
        );
        _;
    }
    
    // Functions (TO BE IMPLEMENTED)
    function registerUser(
        address _user,
        Role _role,
        string memory _name,
        string memory _email
    ) external onlyOfficial {}
    
    function grantRole(
        address _user, 
        Role _role
    ) external onlyAdmin {}
    
    function revokeRole(address _user) external onlyAdmin {}
    
    function isLandOwner(
        string memory _landId, 
        address _user
    ) internal view returns (bool) {}
}
```

### **3. Document Verification Contract**
```solidity
// contracts/DocumentVerification.sol
pragma solidity ^0.8.19;

contract DocumentVerification {
    
    struct Document {
        string ipfsHash;
        string documentHash;  // SHA-256 hash
        address uploadedBy;
        uint256 timestamp;
        bool isVerified;
        string documentType;
    }
    
    mapping(string => Document) public documents;  // landId => Document
    mapping(string => bool) public documentExists; // documentHash => exists
    
    event DocumentUploaded(
        string indexed landId,
        string documentHash,
        address indexed uploadedBy,
        uint256 timestamp
    );
    
    event DocumentVerified(
        string indexed landId,
        string documentHash,
        bool isValid
    );
    
    // Functions (TO BE IMPLEMENTED)
    function uploadDocument(
        string memory _landId,
        string memory _ipfsHash,
        string memory _documentHash,
        string memory _documentType
    ) external {}
    
    function verifyDocument(
        string memory _landId,
        string memory _documentHash
    ) external view returns (bool) {}
    
    function getDocumentDetails(
        string memory _landId
    ) external view returns (Document memory) {}
}
```

---

## 🔧 Hardhat Configuration

### **hardhat.config.ts (TO BE CREATED)**
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5,
    },
  },
  
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  
  namedAccounts: {
    deployer: {
      default: 0,
    },
    official: {
      default: 1,
    },
    user: {
      default: 2,
    },
  },
};

export default config;
```

---

## 🚀 Deployment Strategy

### **1. Deployment Script**
```typescript
// scripts/deploy.ts
import { ethers, deployments, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer, official } = await getNamedAccounts();
  
  console.log("Deploying contracts with account:", deployer);
  
  // 1. Deploy AccessControl
  const AccessControl = await ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.deployed();
  console.log("AccessControl deployed to:", accessControl.address);
  
  // 2. Deploy DocumentVerification
  const DocumentVerification = await ethers.getContractFactory("DocumentVerification");
  const documentVerification = await DocumentVerification.deploy();
  await documentVerification.deployed();
  console.log("DocumentVerification deployed to:", documentVerification.address);
  
  // 3. Deploy LandRegistry
  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  await landRegistry.deployed();
  console.log("LandRegistry deployed to:", landRegistry.address);
  
  // 4. Setup roles
  await accessControl.grantRole(await accessControl.OFFICIAL_ROLE(), official);
  console.log("Official role granted to:", official);
  
  // 5. Verify contracts (if on testnet)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contracts...");
    await verify(landRegistry.address, []);
    await verify(accessControl.address, []);
    await verify(documentVerification.address, []);
  }
  
  return {
    landRegistry: landRegistry.address,
    accessControl: accessControl.address,
    documentVerification: documentVerification.address
  };
}

async function verify(contractAddress: string, args: any[]) {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified");
    } else {
      console.log(e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### **2. Test Deployment Script**
```typescript
// scripts/test-deployment.ts
import { ethers } from "hardhat";

async function testDeployment() {
  const [deployer, official, owner1, owner2] = await ethers.getSigners();
  
  // Get deployed contract
  const landRegistryAddress = "0x..."; // From deployment
  const landRegistry = await ethers.getContractAt("LandRegistry", landRegistryAddress);
  
  // Test 1: Register a land
  console.log("Testing land registration...");
  const tx1 = await landRegistry.connect(official).registerLand(
    "LD001",
    owner1.address,
    40712800, // Latitude * 1e6
    -74006000, // Longitude * 1e6  
    1000,
    "QmX1Y2Z3..."
  );
  await tx1.wait();
  console.log("Land registered successfully");
  
  // Test 2: Request transfer
  console.log("Testing transfer request...");
  const tx2 = await landRegistry.connect(owner1).requestTransfer("LD001", owner2.address);
  await tx2.wait();
  console.log("Transfer requested successfully");
  
  // Test 3: Approve transfer
  console.log("Testing transfer approval...");
  const tx3 = await landRegistry.connect(official).approveTransfer("LD001");
  await tx3.wait();
  console.log("Transfer approved successfully");
  
  // Test 4: Verify final owner
  const landDetails = await landRegistry.getLandDetails("LD001");
  console.log("Final owner:", landDetails.owner);
  console.log("Expected owner:", owner2.address);
  console.log("Test passed:", landDetails.owner === owner2.address);
}

testDeployment().catch(console.error);
```

---

## 🧪 Testing Strategy

### **1. Unit Tests**
```typescript
// test/LandRegistry.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { LandRegistry } from "../typechain-types";

describe("LandRegistry", function () {
  let landRegistry: LandRegistry;
  let admin: SignerWithAddress;
  let official: SignerWithAddress;
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let citizen: SignerWithAddress;

  beforeEach(async function () {
    [admin, official, owner1, owner2, citizen] = await ethers.getSigners();
    
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy();
    await landRegistry.deployed();
    
    // Setup roles
    await landRegistry.grantRole(await landRegistry.OFFICIAL_ROLE(), official.address);
  });

  describe("Land Registration", function () {
    it("Should register a new land", async function () {
      await expect(
        landRegistry.connect(official).registerLand(
          "LD001",
          owner1.address,
          40712800,
          -74006000,
          1000,
          "QmX1Y2Z3..."
        )
      ).to.emit(landRegistry, "LandRegistered")
       .withArgs("LD001", owner1.address, anyValue);
      
      const land = await landRegistry.getLandDetails("LD001");
      expect(land.owner).to.equal(owner1.address);
      expect(land.area).to.equal(1000);
    });
    
    it("Should reject registration from non-official", async function () {
      await expect(
        landRegistry.connect(citizen).registerLand(
          "LD001",
          owner1.address,
          40712800,
          -74006000,
          1000,
          "QmX1Y2Z3..."
        )
      ).to.be.revertedWith("Official access required");
    });
    
    it("Should reject duplicate land ID", async function () {
      await landRegistry.connect(official).registerLand(
        "LD001",
        owner1.address,
        40712800,
        -74006000,
        1000,
        "QmX1Y2Z3..."
      );
      
      await expect(
        landRegistry.connect(official).registerLand(
          "LD001",  // Same ID
          owner2.address,
          40712800,
          -74006000,
          1500,
          "QmA1B2C3..."
        )
      ).to.be.revertedWith("Land ID already exists");
    });
  });

  describe("Land Transfer", function () {
    beforeEach(async function () {
      await landRegistry.connect(official).registerLand(
        "LD001",
        owner1.address,
        40712800,
        -74006000,
        1000,
        "QmX1Y2Z3..."
      );
    });
    
    it("Should request transfer", async function () {
      await expect(
        landRegistry.connect(owner1).requestTransfer("LD001", owner2.address)
      ).to.emit(landRegistry, "TransferRequested")
       .withArgs("LD001", owner1.address, owner2.address, anyValue);
    });
    
    it("Should approve transfer", async function () {
      await landRegistry.connect(owner1).requestTransfer("LD001", owner2.address);
      
      await expect(
        landRegistry.connect(official).approveTransfer("LD001")
      ).to.emit(landRegistry, "TransferApproved")
       .withArgs("LD001", owner2.address, official.address, anyValue);
      
      const land = await landRegistry.getLandDetails("LD001");
      expect(land.owner).to.equal(owner2.address);
    });
  });
});
```

### **2. Integration Tests**
```typescript
// test/Integration.test.ts
describe("Full Workflow Integration", function () {
  it("Should complete full land lifecycle", async function () {
    // 1. Register land
    // 2. Upload document
    // 3. Verify document
    // 4. Request transfer
    // 5. Approve transfer
    // 6. Verify new ownership
    // 7. Check transfer history
  });
});
```

---

## 🌐 Frontend Integration

### **Web3 Connection (TO BE IMPLEMENTED)**
```typescript
// frontend/services/web3Service.ts
import { ethers } from 'ethers';
import LandRegistryABI from '../contracts/LandRegistry.json';

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  
  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    
    this.provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.signer = await this.provider.getSigner();
    
    const address = await this.signer.getAddress();
    
    // Initialize contract
    this.contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      LandRegistryABI.abi,
      this.signer
    );
    
    return address;
  }
  
  async registerLand(landData: any): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.registerLand(
      landData.landId,
      landData.owner,
      Math.floor(landData.coordinates.lat * 1e6),
      Math.floor(landData.coordinates.lng * 1e6),
      landData.area,
      landData.documentHash
    );
    
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }
  
  async requestTransfer(landId: string, newOwner: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.requestTransfer(landId, newOwner);
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }
  
  async getLandDetails(landId: string): Promise<any> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.getLandDetails(landId);
  }
  
  async getOwnerLands(owner: string): Promise<string[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.getOwnerLands(owner);
  }
}

export const web3Service = new Web3Service();
```

---

## 📦 Required Dependencies

### **Development Dependencies**
```json
{
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^3.0.0",
    "@nomiclabs/hardhat-etherscan": "^3.1.7",
    "@typechain/ethers-v6": "^0.4.0",
    "@typechain/hardhat": "^8.0.0",
    "hardhat": "^2.17.0",
    "hardhat-deploy": "^0.11.34",
    "hardhat-gas-reporter": "^1.0.9",
    "solidity-coverage": "^0.8.4",
    "typechain": "^8.3.0",
    "dotenv": "^16.3.1",
    "chai": "^4.3.7",
    "mocha": "^10.2.0"
  },
  "dependencies": {
    "ethers": "^6.7.0"
  }
}
```

### **Frontend Dependencies (Additional)**
```json
{
  "dependencies": {
    "ethers": "^6.7.0",
    "@metamask/detect-provider": "^2.0.0",
    "web3modal": "^1.9.12"
  }
}
```

---

## 🔧 Environment Setup

### **Environment Variables**
```bash
# .env.example
# Private key for deployment (WITHOUT 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Gas reporting
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Contract addresses (after deployment)
LAND_REGISTRY_ADDRESS=
ACCESS_CONTROL_ADDRESS=
DOCUMENT_VERIFICATION_ADDRESS=
```

---

## 📊 Implementation Priority

### **Phase 1: Smart Contract Development (Week 1-2)**
1. **Contract Structure** → Write Solidity contracts
2. **Access Control** → Role-based permissions
3. **Core Functions** → Land registration and transfer
4. **Events** → Emit appropriate events

**Estimated Time: 25-30 hours**

### **Phase 2: Testing & Deployment (Week 3)**
1. **Unit Tests** → Test all contract functions
2. **Integration Tests** → Test workflows
3. **Testnet Deployment** → Deploy to Sepolia
4. **Contract Verification** → Verify on Etherscan

**Estimated Time: 15-20 hours**

### **Phase 3: Frontend Integration (Week 4)**
1. **Web3 Service** → Wallet connection
2. **Contract Interaction** → Call contract methods
3. **Transaction Handling** → Process confirmations
4. **Error Handling** → Handle blockchain errors

**Estimated Time: 20-25 hours**

### **Phase 4: Advanced Features (Week 5)**
1. **Gas Optimization** → Optimize contract calls
2. **Event Listening** → Real-time updates
3. **Batch Operations** → Multiple transactions
4. **Upgradability** → Proxy patterns (optional)

**Estimated Time: 15-20 hours**

---

## 🛠️ Quick Start Commands

```bash
# Initialize blockchain project
mkdir blockchain
cd blockchain
npm init -y

# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat

# Create project structure
mkdir contracts scripts test tasks
touch contracts/LandRegistry.sol
touch hardhat.config.ts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to localhost
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Verify contract
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

---

## ⚠️ Critical Implementation Notes

### **Security Considerations**
- **Access Control** → Proper role validation
- **Input Validation** → Validate all parameters
- **Reentrancy Protection** → Use ReentrancyGuard
- **Integer Overflow** → Use SafeMath or Solidity ^0.8
- **Gas Optimization** → Minimize storage operations

### **Gas Optimization**
- **Storage Layout** → Pack structs efficiently
- **Function Modifiers** → Use view/pure appropriately
- **Array Operations** → Minimize dynamic arrays
- **Event Logging** → Use events instead of storage for logs

### **Testing Strategy**
- **100% Coverage** → Test all functions and edge cases
- **Fuzz Testing** → Test with random inputs
- **Integration Tests** → Test complete workflows
- **Gas Testing** → Monitor gas usage

---

**Current Status**: Not Started - Complete Smart Contract Development Required  
**Next Priority**: Create contract structure and implement core functions  
**Estimated Development Time**: 75-95 hours  
**Required Skills**: Solidity, Hardhat, Web3, Testing, Deployment
