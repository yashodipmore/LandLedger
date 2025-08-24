# LandLedger - Blockchain Land Registry System

<div align="center">

![LandLedger Banner](https://img.shields.io/badge/LandLedger-Blockchain%20Land%20Registry-blue?style=for-the-badge&logo=ethereum)

[![Version](https://img.shields.io/badge/Version-1.0.0-green?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?style=flat-square&logo=node.js)](#)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)](#)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue?style=flat-square&logo=solidity)](#)

**A revolutionary blockchain-based land registry system ensuring transparent, tamper-proof property ownership records.**

*Developed for SunHacks 2025 by Sandip University*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Team Contributors](#-team-contributors)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Smart Contracts](#-smart-contracts)
- [API Documentation](#-api-documentation)
- [Frontend Features](#-frontend-features)
- [Development Workflow](#-development-workflow)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

LandLedger is a comprehensive blockchain-based land registry system that revolutionizes property ownership management through distributed ledger technology. The platform provides transparent, immutable, and secure land record management with real-time verification capabilities.

### Problem Statement
Traditional land registry systems suffer from:
- **Manual processes** leading to inefficiencies
- **Data tampering** and fraudulent activities  
- **Lack of transparency** in ownership transfers
- **Centralized control** creating single points of failure
- **Paper-based documentation** prone to loss and damage

### Solution
LandLedger addresses these challenges by:
- **Blockchain immutability** ensuring tamper-proof records
- **Smart contracts** automating transfer processes
- **Decentralized storage** eliminating single points of failure
- **Real-time verification** through cryptographic proofs
- **Role-based access control** for secure operations

---

## ⚡ Features

### 🏛️ Government Officials
- **Property Registration**: Register new land properties on blockchain
- **Transfer Approval**: Approve ownership transfer requests
- **Document Verification**: Verify property documents and certificates
- **Administrative Dashboard**: Monitor system-wide activities

### 🏠 Property Owners  
- **Portfolio Management**: View and manage owned properties
- **Ownership Transfer**: Initiate property transfer to new owners
- **Document Generation**: Generate QR codes and digital certificates
- **Transaction History**: Complete audit trail of property activities

### 👥 Citizens
- **Property Search**: Search and explore land registry database
- **Ownership Verification**: Verify property ownership and authenticity
- **Document Validation**: Validate property documents against blockchain
- **Public Access**: Transparent access to public land records

### 🔐 Core System Features
- **MetaMask Integration**: Secure wallet-based authentication
- **Smart Contract Automation**: Automated property transfer workflows  
- **IPFS Storage**: Decentralized document storage and retrieval
- **Real-time Analytics**: Live dashboard with system metrics
- **Multi-role Access**: Role-based permissions and interfaces

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (Next.js)     │◄──►│  (Node.js/API)  │◄──►│  (Ethereum)     │
│                 │    │                 │    │                 │
│ • Web Interface │    │ • REST APIs     │    │ • Smart         │
│ • MetaMask      │    │ • Authentication│    │   Contracts     │
│ • Role-based UI │    │ • Business Logic│    │ • Land Registry │
│ • Real-time     │    │ • Data Layer    │    │ • Document      │
│   Updates       │    │ • File Handling │    │   Verification  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │    Database     │             │
         └──────────────┤    (MongoDB)    │─────────────┘
                        │                 │
                        │ • User Data     │
                        │ • Metadata      │
                        │ • Cache Layer   │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │ IPFS Storage    │
                        │ (Decentralized) │
                        │                 │
                        │ • Documents     │
                        │ • Images        │
                        │ • Certificates  │
                        └─────────────────┘
```

---

## 💻 Technology Stack

### Frontend
- **Framework**: Next.js 15.x with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Web3**: ethers.js v6 for blockchain interaction
- **State Management**: React Context + Custom Hooks
- **Animations**: Framer Motion
- **Build Tool**: Webpack 5 with SWC

### Backend  
- **Runtime**: Node.js 18.x with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Role-Based Access Control
- **File Upload**: Multer + IPFS integration
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Joi schema validation

### Blockchain
- **Smart Contracts**: Solidity 0.8.20+
- **Development**: Hardhat framework
- **Network**: Ethereum (Local/Testnet/Mainnet)
- **Standards**: ERC-721 for property NFTs
- **Testing**: Mocha + Chai test suite
- **Deployment**: Hardhat Ignition

### Storage & Infrastructure
- **Decentralized Storage**: IPFS with Pinata Gateway
- **Cloud Database**: MongoDB Atlas
- **Version Control**: Git with conventional commits
- **CI/CD**: GitHub Actions
- **Containerization**: Docker with multi-stage builds

---

## 👥 Team Contributors

<table>
<tr>
<td align="center">
<strong>🚀 Deployment & DevOps</strong><br>
<a href="#"><strong>Sejal Sonar</strong></a><br>
<em>Cloud Infrastructure, CI/CD, Production Deployment</em><br>
<code>Docker | AWS | Kubernetes | GitHub Actions</code>
</td>
<td align="center">
<strong>🚀 Deployment & DevOps</strong><br>
<a href="#"><strong>Chinmay Chavan</strong></a><br>
<em>Network Configuration, Security, Monitoring</em><br>
<code>Nginx | SSL/TLS | Monitoring | Load Balancing</code>
</td>
</tr>
<tr>
<td align="center">
<strong>⚙️ Backend Development</strong><br>
<a href="#"><strong>Yashodip More</strong></a><br>
<em>API Development, Database Design, Smart Contract Integration</em><br>
<code>Node.js | MongoDB | Web3 | REST APIs</code>
</td>
<td align="center">
<strong>🎨 Frontend Development</strong><br>
<a href="#"><strong>Komal Kumavat</strong></a><br>
<em>UI/UX Implementation, Blockchain Integration, Component Development</em><br>
<code>Next.js | TypeScript | Web3 | Responsive Design</code>
</td>
</tr>
</table>

<div align="center">
<strong>🏛️ Institution</strong><br>
<em>Sandip University - SunHacks 2025</em><br>
<em>Computer Science & Engineering Department</em>
</div>

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18.x or higher
- **npm**: v8.x or higher  
- **Git**: Latest version
- **MetaMask**: Browser extension
- **MongoDB**: v6.x (local or cloud)

### Development Tools
- **Code Editor**: VS Code (recommended)
- **Browser**: Chrome/Firefox with MetaMask
- **Terminal**: PowerShell/Bash/Zsh
- **Postman**: For API testing (optional)

---

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/yashodipmore/LandLedger.git
cd LandLedger
```

### 2. Environment Setup

#### Frontend Configuration
```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
```

#### Backend Configuration  
```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/landledger
JWT_SECRET=your-super-secret-jwt-key
IPFS_PROJECT_ID=your-ipfs-project-id
IPFS_PROJECT_SECRET=your-ipfs-secret
ETHEREUM_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your-deployment-private-key
```

#### Blockchain Setup
```bash
cd blockchain
npm install
```

Create `.env`:
```env
ETHEREUM_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
ETHERSCAN_API_KEY=your-etherscan-api-key
```

### 3. Smart Contract Deployment
```bash
cd blockchain

# Compile contracts
npx hardhat compile

# Start local blockchain
npx hardhat node

# Deploy contracts (new terminal)
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Import initial data (optional)
cd backend
npm run seed
```

### 5. Start Development Servers

#### Terminal 1: Blockchain
```bash
cd blockchain
npx hardhat node
```

#### Terminal 2: Backend
```bash
cd backend
npm run dev
```

#### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```

### 6. MetaMask Configuration

1. **Install MetaMask** browser extension
2. **Add Local Network**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
3. **Import Test Account** (optional):
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### 7. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

---

## 📁 Project Structure

```
LandLedger/
├── frontend/                   # Next.js Frontend Application
│   ├── app/                   # App Router pages
│   ├── components/            # Reusable UI components
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API and Web3 services
│   ├── utils/                # Utility functions
│   └── styles/               # Global styles
│
├── backend/                   # Node.js Backend API
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Database models
│   │   ├── routes/           # Express routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # Business logic
│   │   └── utils/            # Backend utilities
│   ├── tests/                # Backend tests
│   └── docs/                 # API documentation
│
├── blockchain/                # Smart Contracts & Scripts
│   ├── contracts/            # Solidity smart contracts
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   ├── ignition/             # Hardhat Ignition modules
│   └── artifacts/            # Compiled contracts
│
├── docs/                      # Project documentation
│   ├── API.md               # API documentation
│   ├── SETUP.md             # Setup instructions
│   └── ARCHITECTURE.md      # System architecture
│
└── deployment/                # Production deployment
    ├── docker/               # Docker configurations
    ├── k8s/                  # Kubernetes manifests
    └── scripts/              # Deployment scripts
```

---

## 🔗 Smart Contracts

### LandRegistry Contract
Primary contract managing land ownership records.

```solidity
contract LandRegistry {
    struct Land {
        uint256 id;
        string landId;
        address owner;
        string ipfsHash;
        string documentHash;
        uint256 area;
        bool isActive;
        uint256 registeredAt;
    }
    
    function registerLand(
        string memory _landId,
        address _owner,
        string memory _ipfsHash,
        string memory _documentHash,
        uint256 _area
    ) public onlyGovernment;
    
    function transferOwnership(
        uint256 _landId, 
        address _newOwner
    ) public;
}
```

### DocumentVerification Contract
Handles document authentication and verification.

```solidity
contract DocumentVerification {
    function verifyDocument(
        string memory _documentHash
    ) public view returns (bool);
    
    function storeDocumentHash(
        string memory _documentHash,
        uint256 _landId
    ) public onlyAuthorized;
}
```

### Key Features
- **Access Control**: Role-based permissions
- **Event Emission**: Comprehensive logging
- **Gas Optimization**: Efficient storage patterns
- **Upgrade Safety**: Proxy pattern implementation

---

## 📊 API Documentation

### Authentication Endpoints
```
POST   /api/auth/login          # User authentication
POST   /api/auth/logout         # User logout
GET    /api/auth/profile        # Get user profile
PUT    /api/auth/profile        # Update user profile
```

### Land Management
```
GET    /api/lands               # Get all lands
GET    /api/lands/:id           # Get specific land
POST   /api/lands               # Register new land
PUT    /api/lands/:id           # Update land details
DELETE /api/lands/:id           # Delete land record
```

### Property Transfers
```
GET    /api/transfers           # Get transfer requests
POST   /api/transfers           # Create transfer request
PUT    /api/transfers/:id       # Update transfer status
GET    /api/transfers/pending   # Get pending transfers
```

### Document Management
```
POST   /api/documents/upload    # Upload documents
GET    /api/documents/:hash     # Get document by hash
POST   /api/documents/verify    # Verify document authenticity
```

### Analytics & Reports
```
GET    /api/analytics/dashboard # Dashboard statistics
GET    /api/analytics/activity  # System activity feed
GET    /api/reports/ownership   # Ownership reports
```

---

## 🎨 Frontend Features

### Component Architecture
- **Atomic Design**: Organized component hierarchy
- **TypeScript**: Full type safety
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliance
- **Performance**: Optimized rendering

### Key Components
- **Dashboard**: Real-time analytics and metrics
- **Property Management**: CRUD operations for properties
- **Transfer Workflow**: Step-by-step transfer process
- **Document Viewer**: IPFS-based document display
- **Notification System**: Real-time updates

### UI/UX Features
- **Dark/Light Theme**: System preference detection
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling
- **Form Validation**: Real-time validation feedback
- **Interactive Maps**: Property location visualization

---

## 🔄 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/land-registration
git add .
git commit -m "feat: implement land registration API"
git push origin feature/land-registration

# Create pull request for review
```

### Code Standards
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Standardized commit messages

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: Feature development
- **hotfix/***: Critical bug fixes

---

## 🧪 Testing

### Frontend Testing
```bash
cd frontend

# Unit tests
npm run test

# Integration tests  
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Backend Testing
```bash
cd backend

# Unit tests
npm run test

# API tests
npm run test:api

# Integration tests
npm run test:integration
```

### Smart Contract Testing
```bash
cd blockchain

# Contract tests
npx hardhat test

# Coverage analysis
npx hardhat coverage

# Gas analysis
npx hardhat test --gas-reporter
```

### Testing Standards
- **Unit Tests**: 90%+ coverage target
- **Integration Tests**: Critical user flows
- **E2E Tests**: Complete user journeys
- **Performance Tests**: Load and stress testing

---

## 🚀 Deployment

### Development Environment
```bash
# Start all services
npm run dev:all

# Individual services
npm run dev:frontend
npm run dev:backend
npm run dev:blockchain
```

### Production Deployment

#### Docker Deployment
```bash
# Build all services
docker-compose build

# Start production stack
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Cloud Deployment (AWS/Vercel)
```bash
# Frontend to Vercel
cd frontend
vercel --prod

# Backend to AWS
cd backend
npm run deploy:aws

# Database migration
npm run migrate:prod
```

### Environment Configurations
- **Development**: Local with hot reload
- **Staging**: Cloud environment for testing
- **Production**: Optimized for performance and security

---

## 📈 Monitoring & Analytics

### Application Monitoring
- **Performance Metrics**: Response times and throughput
- **Error Tracking**: Real-time error monitoring
- **User Analytics**: Usage patterns and behavior
- **System Health**: Uptime and availability

### Blockchain Monitoring
- **Transaction Status**: Success/failure rates
- **Gas Usage**: Optimization opportunities
- **Contract Events**: Real-time event tracking
- **Network Health**: Node synchronization status

---

## 🔐 Security Considerations

### Frontend Security
- **Content Security Policy**: XSS prevention
- **HTTPS Enforcement**: Secure data transmission
- **Input Validation**: Client-side sanitization
- **Authentication**: Secure token management

### Backend Security  
- **JWT Authentication**: Stateless authentication
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Cross-origin security
- **Data Encryption**: Sensitive data protection

### Blockchain Security
- **Access Control**: Role-based permissions
- **Input Validation**: Parameter sanitization
- **Reentrancy Guards**: Attack prevention
- **Gas Limits**: DoS attack mitigation

---

## 🤝 Contributing

### Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Implement** your changes
5. **Add** tests for new functionality
6. **Submit** a pull request

### Contribution Guidelines
- **Code Style**: Follow established patterns
- **Documentation**: Update relevant docs
- **Testing**: Maintain test coverage
- **Commit Messages**: Use conventional commits

### Issue Reporting
- **Bug Reports**: Use issue templates
- **Feature Requests**: Detailed requirements
- **Security Issues**: Use security contact

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

### Team Contacts
- **Technical Lead**: Yashodip More - [yashodip.more@example.com](mailto:yashodip.more@example.com)
- **Frontend Lead**: Komal Kumavat - [komal.kumavat@example.com](mailto:komal.kumavat@example.com)
- **DevOps Lead**: Sejal Sonar - [sejal.sonar@example.com](mailto:sejal.sonar@example.com)
- **Infrastructure**: Chinmay Chavan - [chinmay.chavan@example.com](mailto:chinmay.chavan@example.com)

### Institution
**Sandip University**  
Computer Science & Engineering Department  
SunHacks 2025 Project

### Resources
- **Documentation**: [GitHub Wiki](https://github.com/yashodipmore/LandLedger/wiki)
- **Issues**: [GitHub Issues](https://github.com/yashodipmore/LandLedger/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yashodipmore/LandLedger/discussions)

---

<div align="center">

**Built with ❤️ by Team LandLedger | Sandip University | SunHacks 2025**

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Built with Solidity](https://img.shields.io/badge/Built%20with-Solidity-blue?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![Powered by Ethereum](https://img.shields.io/badge/Powered%20by-Ethereum-gray?style=flat-square&logo=ethereum)](https://ethereum.org/)

</div>
