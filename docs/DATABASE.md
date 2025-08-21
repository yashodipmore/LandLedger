# 🗄️ Database Development Guide

## 📊 Status: **0% Complete** ❌

Database design and implementation required for storing land records, user data, and transaction history.

---

## 🏗️ Database Architecture

### **Tech Stack**
- **Primary Database**: MongoDB with Mongoose ODM
- **Alternative**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session and frequently accessed data
- **Search**: MongoDB Atlas Search / Elasticsearch
- **Backup**: MongoDB Atlas / AWS RDS automated backups

### **Project Structure (TO BE CREATED)**
```
database/
├── models/                     # Database schemas
│   ├── User.ts                # User authentication data
│   ├── Land.ts                # Land registration records
│   ├── Transfer.ts            # Property transfer records
│   ├── Document.ts            # Document metadata
│   ├── Transaction.ts         # Blockchain transaction logs
│   └── AuditLog.ts           # System audit trails
├── migrations/                # Database migrations
│   ├── 001_initial_schema.ts
│   ├── 002_add_indexes.ts
│   └── 003_add_audit_logs.ts
├── seeds/                     # Sample data for development
│   ├── users.seed.ts
│   ├── lands.seed.ts
│   └── transfers.seed.ts
├── config/                    # Database configuration
│   ├── mongodb.config.ts
│   ├── redis.config.ts
│   └── database.config.ts
├── utils/                     # Database utilities
│   ├── connection.ts          # Database connection
│   ├── validation.ts          # Data validation
│   └── pagination.ts          # Pagination helpers
└── package.json
```

---

## 📋 Database Schema Design

### **1. User Model (Authentication & Roles)**
```typescript
// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'owner' | 'official' | 'admin';
  walletAddress?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profile: {
    avatar?: string;
    dateOfBirth?: Date;
    nationalId?: string;
    occupation?: string;
  };
  verification: {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isKYCVerified: boolean;
    verificationDate?: Date;
  };
  settings: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      publicProfile: boolean;
      showEmail: boolean;
      showPhone: boolean;
    };
  };
  lastLogin: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['citizen', 'owner', 'official', 'admin'],
    default: 'citizen',
    required: true
  },
  walletAddress: {
    type: String,
    sparse: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format']
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  profile: {
    avatar: String,
    dateOfBirth: Date,
    nationalId: String,
    occupation: String
  },
  verification: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isKYCVerified: { type: Boolean, default: false },
    verificationDate: Date
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      publicProfile: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    }
  },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'verification.isKYCVerified': 1 });

export default mongoose.model<IUser>('User', userSchema);
```

### **2. Land Model (Property Records)**
```typescript
// models/Land.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILand extends Document {
  _id: mongoose.Types.ObjectId;
  landId: string;
  owner: mongoose.Types.ObjectId;
  ownerWallet: string;
  propertyDetails: {
    title: string;
    description?: string;
    propertyType: 'residential' | 'commercial' | 'agricultural' | 'industrial';
    subType?: string;
  };
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    boundaries?: Array<{
      latitude: number;
      longitude: number;
    }>;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    landmark?: string;
  };
  measurements: {
    area: number;
    unit: 'sqft' | 'sqm' | 'acre' | 'hectare';
    frontage?: number;
    depth?: number;
  };
  legal: {
    surveyNumber?: string;
    registrationNumber?: string;
    khataNumber?: string;
    plotNumber?: string;
    blockNumber?: string;
  };
  blockchain: {
    transactionHash: string;
    blockNumber?: number;
    contractAddress?: string;
    gasUsed?: number;
  };
  documents: Array<{
    _id: mongoose.Types.ObjectId;
    documentType: 'deed' | 'survey' | 'tax' | 'approval' | 'other';
    name: string;
    ipfsHash: string;
    documentHash: string;
    uploadDate: Date;
    uploadedBy: mongoose.Types.ObjectId;
    isVerified: boolean;
    expiryDate?: Date;
  }>;
  valuation: {
    marketValue?: number;
    governmentValue?: number;
    lastUpdated?: Date;
    currency: string;
  };
  status: 'active' | 'pending_transfer' | 'transferred' | 'disputed' | 'inactive';
  registrationDate: Date;
  lastTransferDate?: Date;
  transferHistory: mongoose.Types.ObjectId[];
  restrictions?: Array<{
    type: string;
    description: string;
    validUntil?: Date;
  }>;
  taxes: {
    propertyTax?: number;
    lastPaidDate?: Date;
    nextDueDate?: Date;
    status: 'paid' | 'pending' | 'overdue';
  };
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const landSchema = new Schema<ILand>({
  landId: {
    type: String,
    required: true,
    unique: true,
    match: [/^LD\d{6}$/, 'Land ID must be in format LD000000']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerWallet: {
    type: String,
    required: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address']
  },
  propertyDetails: {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 1000 },
    propertyType: {
      type: String,
      enum: ['residential', 'commercial', 'agricultural', 'industrial'],
      required: true
    },
    subType: String
  },
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    boundaries: [{
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 }
    }],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    landmark: String
  },
  measurements: {
    area: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      enum: ['sqft', 'sqm', 'acre', 'hectare'],
      default: 'sqft'
    },
    frontage: { type: Number, min: 0 },
    depth: { type: Number, min: 0 }
  },
  legal: {
    surveyNumber: String,
    registrationNumber: String,
    khataNumber: String,
    plotNumber: String,
    blockNumber: String
  },
  blockchain: {
    transactionHash: { type: String, required: true },
    blockNumber: Number,
    contractAddress: String,
    gasUsed: Number
  },
  documents: [{
    documentType: {
      type: String,
      enum: ['deed', 'survey', 'tax', 'approval', 'other'],
      required: true
    },
    name: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    documentHash: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isVerified: { type: Boolean, default: false },
    expiryDate: Date
  }],
  valuation: {
    marketValue: { type: Number, min: 0 },
    governmentValue: { type: Number, min: 0 },
    lastUpdated: Date,
    currency: { type: String, default: 'INR' }
  },
  status: {
    type: String,
    enum: ['active', 'pending_transfer', 'transferred', 'disputed', 'inactive'],
    default: 'active'
  },
  registrationDate: { type: Date, default: Date.now },
  lastTransferDate: Date,
  transferHistory: [{ type: Schema.Types.ObjectId, ref: 'Transfer' }],
  restrictions: [{
    type: String,
    description: String,
    validUntil: Date
  }],
  taxes: {
    propertyTax: { type: Number, min: 0 },
    lastPaidDate: Date,
    nextDueDate: Date,
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending'
    }
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
landSchema.index({ landId: 1 });
landSchema.index({ owner: 1 });
landSchema.index({ ownerWallet: 1 });
landSchema.index({ status: 1 });
landSchema.index({ 'location.coordinates': '2dsphere' });
landSchema.index({ 'propertyDetails.propertyType': 1 });
landSchema.index({ registrationDate: -1 });

export default mongoose.model<ILand>('Land', landSchema);
```

### **3. Transfer Model (Property Transfers)**
```typescript
// models/Transfer.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransfer extends Document {
  _id: mongoose.Types.ObjectId;
  transferId: string;
  landId: mongoose.Types.ObjectId;
  fromOwner: mongoose.Types.ObjectId;
  toOwner: mongoose.Types.ObjectId;
  transferDetails: {
    transferType: 'sale' | 'gift' | 'inheritance' | 'lease' | 'mortgage';
    salePrice?: number;
    currency?: string;
    transferReason?: string;
    conditions?: string[];
  };
  timeline: {
    requestDate: Date;
    approvalDate?: Date;
    completionDate?: Date;
    deadlineDate?: Date;
  };
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  approval: {
    approvedBy?: mongoose.Types.ObjectId;
    rejectedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
    approvalNotes?: string;
    requiresAdditionalDocs?: boolean;
  };
  documents: Array<{
    documentType: 'agreement' | 'noc' | 'tax_clearance' | 'identity' | 'other';
    name: string;
    ipfsHash: string;
    documentHash: string;
    uploadDate: Date;
    uploadedBy: mongoose.Types.ObjectId;
    isRequired: boolean;
    isVerified: boolean;
  }>;
  blockchain: {
    initiationTxHash?: string;
    approvalTxHash?: string;
    completionTxHash?: string;
    gasUsed?: number;
    blockNumber?: number;
  };
  fees: {
    registrationFee?: number;
    stampDuty?: number;
    processingFee?: number;
    totalFees?: number;
    paymentStatus: 'pending' | 'paid' | 'waived';
    paymentDate?: Date;
    paymentReference?: string;
  };
  notifications: Array<{
    recipient: mongoose.Types.ObjectId;
    message: string;
    sentDate: Date;
    isRead: boolean;
  }>;
  auditTrail: Array<{
    action: string;
    performedBy: mongoose.Types.ObjectId;
    timestamp: Date;
    details?: Record<string, any>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const transferSchema = new Schema<ITransfer>({
  transferId: {
    type: String,
    required: true,
    unique: true,
    match: [/^TR\d{8}$/, 'Transfer ID must be in format TR00000000']
  },
  landId: {
    type: Schema.Types.ObjectId,
    ref: 'Land',
    required: true
  },
  fromOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transferDetails: {
    transferType: {
      type: String,
      enum: ['sale', 'gift', 'inheritance', 'lease', 'mortgage'],
      required: true
    },
    salePrice: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    transferReason: String,
    conditions: [String]
  },
  timeline: {
    requestDate: { type: Date, default: Date.now },
    approvalDate: Date,
    completionDate: Date,
    deadlineDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  approval: {
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String,
    approvalNotes: String,
    requiresAdditionalDocs: { type: Boolean, default: false }
  },
  documents: [{
    documentType: {
      type: String,
      enum: ['agreement', 'noc', 'tax_clearance', 'identity', 'other'],
      required: true
    },
    name: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    documentHash: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isRequired: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }
  }],
  blockchain: {
    initiationTxHash: String,
    approvalTxHash: String,
    completionTxHash: String,
    gasUsed: Number,
    blockNumber: Number
  },
  fees: {
    registrationFee: { type: Number, min: 0 },
    stampDuty: { type: Number, min: 0 },
    processingFee: { type: Number, min: 0 },
    totalFees: { type: Number, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'waived'],
      default: 'pending'
    },
    paymentDate: Date,
    paymentReference: String
  },
  notifications: [{
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    sentDate: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }],
  auditTrail: [{
    action: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    details: Schema.Types.Mixed
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
transferSchema.index({ transferId: 1 });
transferSchema.index({ landId: 1 });
transferSchema.index({ fromOwner: 1 });
transferSchema.index({ toOwner: 1 });
transferSchema.index({ status: 1 });
transferSchema.index({ 'timeline.requestDate': -1 });

export default mongoose.model<ITransfer>('Transfer', transferSchema);
```

### **4. Document Model (File Metadata)**
```typescript
// models/Document.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  _id: mongoose.Types.ObjectId;
  documentId: string;
  landId?: mongoose.Types.ObjectId;
  transferId?: mongoose.Types.ObjectId;
  name: string;
  originalName: string;
  documentType: 'deed' | 'survey' | 'tax' | 'agreement' | 'noc' | 'identity' | 'other';
  category: 'land_document' | 'transfer_document' | 'user_document';
  storage: {
    ipfsHash: string;
    documentHash: string;
    encryptionKey?: string;
    isEncrypted: boolean;
  };
  metadata: {
    size: number;
    mimeType: string;
    extension: string;
    pages?: number;
    resolution?: string;
    checksum: string;
  };
  access: {
    uploadedBy: mongoose.Types.ObjectId;
    visibility: 'public' | 'private' | 'restricted';
    allowedUsers?: mongoose.Types.ObjectId[];
    allowedRoles?: string[];
  };
  verification: {
    isVerified: boolean;
    verifiedBy?: mongoose.Types.ObjectId;
    verificationDate?: Date;
    verificationMethod?: 'manual' | 'automatic' | 'third_party';
    trustScore?: number;
  };
  lifecycle: {
    uploadDate: Date;
    expiryDate?: Date;
    lastAccessDate?: Date;
    accessCount: number;
    downloadCount: number;
  };
  tags: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  documentId: {
    type: String,
    required: true,
    unique: true,
    match: [/^DOC\d{8}$/, 'Document ID must be in format DOC00000000']
  },
  landId: { type: Schema.Types.ObjectId, ref: 'Land' },
  transferId: { type: Schema.Types.ObjectId, ref: 'Transfer' },
  name: { type: String, required: true, maxlength: 200 },
  originalName: { type: String, required: true },
  documentType: {
    type: String,
    enum: ['deed', 'survey', 'tax', 'agreement', 'noc', 'identity', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['land_document', 'transfer_document', 'user_document'],
    required: true
  },
  storage: {
    ipfsHash: { type: String, required: true },
    documentHash: { type: String, required: true },
    encryptionKey: String,
    isEncrypted: { type: Boolean, default: false }
  },
  metadata: {
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    extension: { type: String, required: true },
    pages: Number,
    resolution: String,
    checksum: { type: String, required: true }
  },
  access: {
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    visibility: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'private'
    },
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    allowedRoles: [String]
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verificationDate: Date,
    verificationMethod: {
      type: String,
      enum: ['manual', 'automatic', 'third_party']
    },
    trustScore: { type: Number, min: 0, max: 100 }
  },
  lifecycle: {
    uploadDate: { type: Date, default: Date.now },
    expiryDate: Date,
    lastAccessDate: Date,
    accessCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 }
  },
  tags: [String],
  notes: String,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
documentSchema.index({ documentId: 1 });
documentSchema.index({ landId: 1 });
documentSchema.index({ transferId: 1 });
documentSchema.index({ 'storage.ipfsHash': 1 });
documentSchema.index({ 'storage.documentHash': 1 });
documentSchema.index({ 'access.uploadedBy': 1 });
documentSchema.index({ documentType: 1 });

export default mongoose.model<IDocument>('Document', documentSchema);
```

---

## 📊 Database Configuration

### **MongoDB Configuration (TO BE IMPLEMENTED)**
```typescript
// config/mongodb.config.ts
import mongoose from 'mongoose';

export interface MongoConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

export const mongoConfig: MongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/landledger',
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    bufferCommands: false,
    bufferMaxEntries: 0,
  }
};

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(mongoConfig.uri, mongoConfig.options);
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('Database connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Database connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

### **Redis Configuration (TO BE IMPLEMENTED)**
```typescript
// config/redis.config.ts
import Redis from 'ioredis';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  maxRetriesPerRequest: number;
  retryDelayOnFailover: number;
  lazyConnect: boolean;
}

export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
};

class RedisService {
  private client: Redis;
  private subscriber: Redis;

  constructor() {
    this.client = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  // Cache operations
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.client.setex(key, ttl, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  // Session management
  async setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    await this.set(`session:${sessionId}`, data, ttl);
  }

  async getSession(sessionId: string): Promise<any> {
    return this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`);
  }

  // Pub/Sub for real-time updates
  async publish(channel: string, message: any): Promise<void> {
    await this.client.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(JSON.parse(message));
      }
    });
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
    await this.subscriber.quit();
  }
}

export const redisService = new RedisService();
```

---

## 🔍 Database Queries & Operations

### **Land Search Queries (TO BE IMPLEMENTED)**
```typescript
// utils/landQueries.ts
import { Land, ILand } from '../models/Land';

export class LandQueries {
  
  // Advanced search with filters
  static async searchLands(params: {
    query?: string;
    propertyType?: string;
    minArea?: number;
    maxArea?: number;
    city?: string;
    state?: string;
    owner?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    lands: ILand[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const {
      query,
      propertyType,
      minArea,
      maxArea,
      city,
      state,
      owner,
      status,
      page = 1,
      limit = 10,
      sortBy = 'registrationDate',
      sortOrder = 'desc'
    } = params;

    // Build search criteria
    const searchCriteria: any = {};

    // Text search
    if (query) {
      searchCriteria.$or = [
        { landId: { $regex: query, $options: 'i' } },
        { 'propertyDetails.title': { $regex: query, $options: 'i' } },
        { 'propertyDetails.description': { $regex: query, $options: 'i' } },
        { 'location.address.street': { $regex: query, $options: 'i' } }
      ];
    }

    // Filters
    if (propertyType) searchCriteria['propertyDetails.propertyType'] = propertyType;
    if (city) searchCriteria['location.address.city'] = { $regex: city, $options: 'i' };
    if (state) searchCriteria['location.address.state'] = { $regex: state, $options: 'i' };
    if (status) searchCriteria.status = status;
    if (owner) {
      // Search by owner name or wallet address
      const ownerCriteria = await User.findOne({
        $or: [
          { name: { $regex: owner, $options: 'i' } },
          { walletAddress: owner }
        ]
      });
      if (ownerCriteria) {
        searchCriteria.owner = ownerCriteria._id;
      }
    }

    // Area range
    if (minArea || maxArea) {
      searchCriteria['measurements.area'] = {};
      if (minArea) searchCriteria['measurements.area'].$gte = minArea;
      if (maxArea) searchCriteria['measurements.area'].$lte = maxArea;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [lands, totalCount] = await Promise.all([
      Land.find(searchCriteria)
        .populate('owner', 'name email walletAddress')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Land.countDocuments(searchCriteria)
    ]);

    return {
      lands,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    };
  }

  // Geographic search (nearby lands)
  static async findNearbyLands(
    latitude: number,
    longitude: number,
    radiusInMeters: number = 1000,
    limit: number = 20
  ): Promise<ILand[]> {
    return Land.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInMeters
        }
      }
    })
    .populate('owner', 'name walletAddress')
    .limit(limit)
    .lean();
  }

  // Get lands by owner
  static async getLandsByOwner(
    ownerId: string,
    status?: string
  ): Promise<ILand[]> {
    const criteria: any = { owner: ownerId };
    if (status) criteria.status = status;

    return Land.find(criteria)
      .sort({ registrationDate: -1 })
      .lean();
  }

  // Land statistics
  static async getLandStatistics(): Promise<{
    totalLands: number;
    activeOwners: number;
    totalArea: number;
    propertyTypeDistribution: Array<{ type: string; count: number }>;
    statusDistribution: Array<{ status: string; count: number }>;
  }> {
    const [
      totalLands,
      activeOwners,
      totalAreaResult,
      propertyTypes,
      statusDistribution
    ] = await Promise.all([
      Land.countDocuments(),
      Land.distinct('owner').then(owners => owners.length),
      Land.aggregate([
        { $group: { _id: null, totalArea: { $sum: '$measurements.area' } } }
      ]),
      Land.aggregate([
        { $group: { _id: '$propertyDetails.propertyType', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } }
      ]),
      Land.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } }
      ])
    ]);

    return {
      totalLands,
      activeOwners,
      totalArea: totalAreaResult[0]?.totalArea || 0,
      propertyTypeDistribution: propertyTypes,
      statusDistribution
    };
  }
}
```

---

## 📦 Required Dependencies

### **Core Dependencies**
```json
{
  "dependencies": {
    "mongoose": "^7.5.0",
    "ioredis": "^5.3.2",
    "bcryptjs": "^2.4.3",
    "validator": "^13.11.0",
    "mongodb": "^6.0.0"
  },
  "devDependencies": {
    "@types/mongoose": "^5.11.97",
    "@types/bcryptjs": "^2.4.4",
    "@types/validator": "^13.11.1"
  }
}
```

### **Environment Variables**
```bash
# .env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/landledger
MONGODB_URI_PROD=mongodb+srv://user:pass@cluster.mongodb.net/landledger

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Database Settings
DB_MAX_POOL_SIZE=10
DB_TIMEOUT=5000
DB_BUFFER_MAX_ENTRIES=0

# Backup Settings
BACKUP_ENABLED=true
BACKUP_FREQUENCY=daily
BACKUP_RETENTION_DAYS=30
```

---

## 📊 Implementation Priority

### **Phase 1: Core Schema & Connection (Week 1)**
1. **Database Models** → Create all Mongoose schemas
2. **Connection Setup** → MongoDB and Redis configuration
3. **Basic CRUD** → Implement basic operations
4. **Validation** → Add data validation

**Estimated Time: 15-20 hours**

### **Phase 2: Advanced Queries (Week 2)**
1. **Search Functionality** → Implement advanced search
2. **Aggregation Pipelines** → Statistics and analytics
3. **Geographic Queries** → Location-based search
4. **Indexing** → Optimize query performance

**Estimated Time: 15-20 hours**

### **Phase 3: Caching & Performance (Week 3)**
1. **Redis Integration** → Implement caching layer
2. **Session Management** → User session handling
3. **Real-time Updates** → Pub/Sub for notifications
4. **Performance Optimization** → Query optimization

**Estimated Time: 10-15 hours**

### **Phase 4: Migration & Seeding (Week 4)**
1. **Database Migrations** → Version control for schema
2. **Data Seeding** → Sample data for development
3. **Backup Strategy** → Automated backups
4. **Monitoring** → Database health monitoring

**Estimated Time: 10-15 hours**

---

## 🛠️ Quick Start Commands

```bash
# Install MongoDB locally
# Download from: https://www.mongodb.com/download-center

# Start MongoDB
mongod --dbpath /data/db

# Install Redis locally
# Download from: https://redis.io/download

# Start Redis
redis-server

# Install dependencies
npm install mongoose ioredis bcryptjs validator

# Create database directory
mkdir database
cd database
mkdir models config utils seeds migrations

# Initialize MongoDB connection
node -e "require('./config/mongodb.config.ts').connectDatabase()"
```

---

## ⚠️ Critical Implementation Notes

### **Security Considerations**
- **Input Validation** → Validate all data before database operations
- **Access Control** → Implement proper user permissions
- **Data Encryption** → Encrypt sensitive data at rest
- **Backup Security** → Secure backup storage and access
- **Audit Logging** → Track all database modifications

### **Performance Optimization**
- **Indexing Strategy** → Create appropriate indexes for queries
- **Connection Pooling** → Optimize database connections
- **Query Optimization** → Use aggregation pipelines efficiently
- **Caching** → Cache frequently accessed data
- **Pagination** → Implement proper pagination for large datasets

### **Data Integrity**
- **Referential Integrity** → Maintain relationships between documents
- **Transactions** → Use transactions for multi-document operations
- **Validation** → Comprehensive data validation at model level
- **Constraints** → Implement business rule constraints

---

**Current Status**: Not Started - Complete Database Implementation Required  
**Next Priority**: Create database models and connection setup  
**Estimated Development Time**: 50-70 hours  
**Required Skills**: MongoDB, Mongoose, Redis, Database Design, Query Optimization
