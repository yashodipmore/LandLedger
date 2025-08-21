# 🔌 Backend Development Guide

## 📊 Status: **0% Complete** ❌

The backend needs to be built from scratch to provide REST APIs, authentication, and business logic.

---

## 🏗️ Required Architecture

### **Tech Stack**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + IPFS
- **Validation**: Joi/Zod
- **Testing**: Jest + Supertest

### **Project Structure (TO BE CREATED)**
```
backend/
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── authController.ts
│   │   ├── landController.ts
│   │   ├── transferController.ts
│   │   ├── documentController.ts
│   │   └── dashboardController.ts
│   ├── models/              # Database schemas
│   │   ├── User.ts
│   │   ├── Land.ts
│   │   ├── Transfer.ts
│   │   └── Document.ts
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   ├── landRoutes.ts
│   │   ├── transferRoutes.ts
│   │   └── documentRoutes.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── upload.ts
│   ├── services/            # Business logic
│   │   ├── blockchainService.ts
│   │   ├── ipfsService.ts
│   │   ├── emailService.ts
│   │   └── cryptoService.ts
│   ├── utils/               # Helper functions
│   │   ├── logger.ts
│   │   ├── constants.ts
│   │   └── validators.ts
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   ├── blockchain.ts
│   │   └── environment.ts
│   └── app.ts               # Express app setup
├── tests/                   # Test files
├── uploads/                 # Temporary file storage
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 🎯 Required API Endpoints

### **1. Authentication APIs (Priority: HIGH)**
```typescript
// Auth Controller Implementation Needed
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
GET    /api/auth/profile         # Get user profile
PUT    /api/auth/profile         # Update profile
POST   /api/auth/refresh         # Refresh JWT token
```

**Required Implementation:**
```typescript
// controllers/authController.ts
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, walletAddress } = req.body
  
  // 1. Validate input
  // 2. Check if user exists
  // 3. Hash password
  // 4. Create user in database
  // 5. Generate JWT token
  // 6. Return user data + token
}

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body
  
  // 1. Validate credentials
  // 2. Check password hash
  // 3. Generate JWT token
  // 4. Return token + user data
}
```

### **2. Land Management APIs (Priority: HIGH)**
```typescript
// Land Controller Implementation Needed
GET    /api/land/search          # Search lands
GET    /api/land/:id             # Get land details
POST   /api/land/register        # Register new land (Official only)
PUT    /api/land/:id             # Update land details (Official only)
DELETE /api/land/:id             # Delete land record (Official only)
GET    /api/land/owner/:wallet   # Get lands by owner
```

**Required Implementation:**
```typescript
// controllers/landController.ts
export const searchLand = async (req: Request, res: Response) => {
  const { query, limit = 10, offset = 0 } = req.query
  
  // 1. Build search criteria
  // 2. Query database with text search
  // 3. Apply pagination
  // 4. Return results
}

export const registerLand = async (req: Request, res: Response) => {
  const { landId, owner, coordinates, area, documents } = req.body
  
  // 1. Validate input data
  // 2. Check if landId exists
  // 3. Upload documents to IPFS
  // 4. Create blockchain transaction
  // 5. Save to database
  // 6. Return confirmation
}
```

### **3. Transfer Management APIs (Priority: HIGH)**
```typescript
// Transfer Controller Implementation Needed
POST   /api/transfer/initiate    # Initiate transfer (Owner only)
GET    /api/transfer/pending     # Get pending transfers (Official only)
PUT    /api/transfer/:id/approve # Approve transfer (Official only)
PUT    /api/transfer/:id/reject  # Reject transfer (Official only)
GET    /api/transfer/history/:landId # Transfer history
```

### **4. Document Management APIs (Priority: MEDIUM)**
```typescript
// Document Controller Implementation Needed
POST   /api/document/upload      # Upload document
POST   /api/document/verify      # Verify document hash
GET    /api/document/:hash       # Get document by hash
DELETE /api/document/:id         # Delete document
```

### **5. Dashboard APIs (Priority: LOW)**
```typescript
// Dashboard Controller Implementation Needed
GET    /api/dashboard/stats      # Get dashboard statistics
GET    /api/dashboard/analytics  # Get analytics data
GET    /api/dashboard/activity   # Get recent activity
```

---

## 🗄️ Database Schema Design

### **User Model**
```typescript
// models/User.ts
interface IUser {
  _id: ObjectId
  name: string
  email: string
  password: string           // Hashed
  role: 'citizen' | 'owner' | 'official'
  walletAddress?: string     // For blockchain interaction
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### **Land Model**
```typescript
// models/Land.ts
interface ILand {
  _id: ObjectId
  landId: string            // Unique identifier
  owner: ObjectId           // Reference to User
  ownerWallet: string       // Blockchain wallet address
  coordinates: {
    lat: number
    lng: number
    boundaries?: Array<{lat: number, lng: number}>
  }
  area: number              // In square meters
  address: string
  description?: string
  documents: Array<{
    name: string
    ipfsHash: string
    documentHash: string
    uploadDate: Date
  }>
  blockchainTxHash: string  // Transaction hash
  registrationDate: Date
  status: 'active' | 'pending_transfer' | 'transferred'
  transferHistory: ObjectId[] // Reference to Transfer
  createdAt: Date
  updatedAt: Date
}
```

### **Transfer Model**
```typescript
// models/Transfer.ts
interface ITransfer {
  _id: ObjectId
  landId: ObjectId          // Reference to Land
  fromOwner: ObjectId       // Reference to User
  toOwner: ObjectId         // Reference to User
  transferDate: Date
  status: 'pending' | 'approved' | 'rejected'
  officialId?: ObjectId     // Reference to approving official
  approvalDate?: Date
  rejectionReason?: string
  blockchainTxHash?: string
  documents: Array<{
    name: string
    ipfsHash: string
  }>
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔐 Authentication & Security

### **JWT Implementation Needed**
```typescript
// middleware/auth.ts
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

// Role-based access control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}
```

### **Input Validation**
```typescript
// middleware/validation.ts
import Joi from 'joi'

export const validateLandRegistration = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    landId: Joi.string().required(),
    owner: Joi.string().email().required(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).required(),
    area: Joi.number().positive().required()
  })
  
  const { error } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}
```

---

## 📦 Required Dependencies

### **Core Dependencies**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.0",
    "joi": "^17.9.0",
    "multer": "^1.4.5",
    "ipfs-http-client": "^60.0.0",
    "crypto": "^1.0.1",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.15.0",
    "@types/bcryptjs": "^2.4.2",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/cors": "^2.8.13",
    "@types/morgan": "^1.9.4",
    "@types/multer": "^1.4.7",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "supertest": "^6.3.3"
  }
}
```

---

## 🔧 Environment Configuration

### **Required Environment Variables**
```bash
# .env.example
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/landledger
DB_NAME=landledger

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Blockchain Configuration
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your-ethereum-private-key
CONTRACT_ADDRESS=deployed-contract-address

# IPFS Configuration
IPFS_URL=https://ipfs.infura.io:5001
IPFS_PROJECT_ID=your-ipfs-project-id
IPFS_PROJECT_SECRET=your-ipfs-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🛠️ Development Setup Commands

### **Initial Setup**
```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors helmet morgan dotenv joi multer

# Install dev dependencies
npm install --save-dev @types/express @types/node typescript ts-node nodemon jest supertest

# Create TypeScript config
npx tsc --init

# Create directory structure
mkdir -p src/{controllers,models,routes,middleware,services,utils,config}
mkdir tests uploads

# Create basic files
touch src/app.ts src/server.ts .env .env.example
```

### **Development Scripts**
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

---

## 🧪 Testing Strategy

### **Required Test Files**
```
tests/
├── unit/
│   ├── controllers/
│   ├── services/
│   └── utils/
├── integration/
│   ├── auth.test.ts
│   ├── land.test.ts
│   └── transfer.test.ts
└── setup/
    ├── testDb.ts
    └── fixtures.ts
```

### **Test Implementation Example**
```typescript
// tests/integration/auth.test.ts
import request from 'supertest'
import app from '../../src/app'

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'owner'
      }
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)
      
      expect(response.body).toHaveProperty('token')
      expect(response.body.user.email).toBe(userData.email)
    })
  })
})
```

---

## 📊 Implementation Priority

### **Phase 1: Core Setup (Week 1)**
1. **Project Structure** → Create all directories and files
2. **Database Connection** → MongoDB setup and models
3. **Basic Express App** → Server setup with middleware
4. **Authentication** → JWT implementation

**Estimated Time: 15-20 hours**

### **Phase 2: Land Management (Week 2)**
1. **Land Registration API** → CRUD operations
2. **Search Functionality** → Text and geo search
3. **File Upload** → Multer integration
4. **Input Validation** → Joi/Zod schemas

**Estimated Time: 20-25 hours**

### **Phase 3: Transfer System (Week 3)**
1. **Transfer Initiation** → Owner requests
2. **Approval Workflow** → Official actions
3. **Status Tracking** → Transfer history
4. **Notifications** → Email/SMS alerts

**Estimated Time: 15-20 hours**

### **Phase 4: Integration (Week 4)**
1. **Frontend Integration** → API connection
2. **Error Handling** → Comprehensive error responses
3. **Testing** → Unit and integration tests
4. **Documentation** → API documentation

**Estimated Time: 10-15 hours**

---

## 🚀 Quick Start Implementation

### **1. Create Basic Express Server**
```typescript
// src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

export default app
```

### **2. Database Connection**
```typescript
// src/config/database.ts
import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}
```

---

## ⚠️ Critical Implementation Notes

### **Security Considerations**
- **Input Validation** → Sanitize all user inputs
- **Rate Limiting** → Prevent API abuse
- **SQL Injection** → Use parameterized queries
- **CORS Policy** → Restrict origins in production
- **File Upload** → Validate file types and sizes

### **Performance Optimization**
- **Database Indexing** → Index frequently queried fields
- **Caching** → Redis for frequently accessed data
- **Pagination** → Limit large result sets
- **Connection Pooling** → Optimize database connections

### **Error Handling**
- **Consistent Format** → Standardized error responses
- **Logging** → Comprehensive error logging
- **Graceful Degradation** → Handle service failures

---

**Current Status**: Not Started - Requires Complete Implementation  
**Next Priority**: Create project structure and basic Express setup  
**Estimated Development Time**: 60-80 hours  
**Required Skills**: Node.js, Express, MongoDB, TypeScript, JWT
