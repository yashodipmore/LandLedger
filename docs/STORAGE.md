# 💾 Storage & IPFS Integration Guide

## 📊 Status: **0% Complete** ❌

IPFS integration is required for decentralized document storage and hash-based verification system.

---

## 🏗️ Storage Architecture

### **Tech Stack**
- **IPFS**: InterPlanetary File System for document storage
- **Gateway**: Pinata/Infura IPFS gateway
- **Hashing**: SHA-256 for document verification
- **File Types**: PDF, DOC, DOCX, Images (JPG, PNG)
- **Encryption**: Optional AES encryption for sensitive docs

### **Project Structure (TO BE CREATED)**
```
storage/
├── src/
│   ├── services/
│   │   ├── ipfsService.ts          # Core IPFS operations
│   │   ├── hashService.ts          # Document hashing
│   │   ├── encryptionService.ts    # Optional encryption
│   │   └── validationService.ts    # File validation
│   ├── utils/
│   │   ├── fileUtils.ts            # File operations
│   │   ├── constants.ts            # File size limits, types
│   │   └── logger.ts               # Logging utilities
│   └── types/
│       ├── ipfs.types.ts           # IPFS-related types
│       └── document.types.ts       # Document interfaces
├── config/
│   ├── ipfs.config.ts              # IPFS configuration
│   └── storage.config.ts           # Storage settings
├── tests/
│   ├── ipfs.test.ts                # IPFS service tests
│   └── hash.test.ts                # Hash verification tests
└── package.json
```

---

## 📁 IPFS Service Implementation

### **Core IPFS Service (TO BE IMPLEMENTED)**
```typescript
// src/services/ipfsService.ts
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';

export interface IPFSUploadResult {
  hash: string;
  path: string;
  size: number;
  url: string;
}

export interface IPFSConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  headers?: Record<string, string>;
}

class IPFSService {
  private client: IPFSHTTPClient;
  private gatewayUrl: string;

  constructor(config: IPFSConfig) {
    this.client = create({
      host: config.host,
      port: config.port,
      protocol: config.protocol,
      headers: config.headers,
    });
    
    this.gatewayUrl = process.env.IPFS_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/';
  }

  // Upload file to IPFS
  async uploadFile(file: Buffer, metadata?: Record<string, any>): Promise<IPFSUploadResult> {
    try {
      const fileWithMetadata = {
        content: file,
        path: metadata?.fileName || 'document.pdf',
        meta: metadata
      };

      const result = await this.client.add(fileWithMetadata, {
        pin: true,
        wrapWithDirectory: false,
        timeout: 60000
      });

      return {
        hash: result.cid.toString(),
        path: result.path,
        size: result.size,
        url: `${this.gatewayUrl}${result.cid.toString()}`
      };
    } catch (error) {
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files: Array<{
    content: Buffer,
    name: string,
    metadata?: Record<string, any>
  }>): Promise<IPFSUploadResult[]> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file.content, { 
          fileName: file.name, 
          ...file.metadata 
        })
      );

      return Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(`Multiple file upload failed: ${error.message}`);
    }
  }

  // Retrieve file from IPFS
  async getFile(hash: string): Promise<Buffer> {
    try {
      const chunks: Uint8Array[] = [];
      
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      throw new Error(`IPFS retrieval failed: ${error.message}`);
    }
  }

  // Check if file exists on IPFS
  async fileExists(hash: string): Promise<boolean> {
    try {
      const stat = await this.client.object.stat(hash);
      return stat !== null;
    } catch (error) {
      return false;
    }
  }

  // Get file metadata
  async getFileMetadata(hash: string): Promise<any> {
    try {
      const stat = await this.client.object.stat(hash);
      return {
        hash,
        size: stat.CumulativeSize,
        links: stat.NumLinks,
        blockSize: stat.BlockSize,
        dataSize: stat.DataSize
      };
    } catch (error) {
      throw new Error(`Metadata retrieval failed: ${error.message}`);
    }
  }

  // Pin file to ensure persistence
  async pinFile(hash: string): Promise<void> {
    try {
      await this.client.pin.add(hash);
    } catch (error) {
      throw new Error(`Pinning failed: ${error.message}`);
    }
  }

  // Unpin file (remove from local node)
  async unpinFile(hash: string): Promise<void> {
    try {
      await this.client.pin.rm(hash);
    } catch (error) {
      throw new Error(`Unpinning failed: ${error.message}`);
    }
  }

  // Generate IPFS URL
  getFileUrl(hash: string): string {
    return `${this.gatewayUrl}${hash}`;
  }
}

export default IPFSService;
```

### **Document Hashing Service (TO BE IMPLEMENTED)**
```typescript
// src/services/hashService.ts
import crypto from 'crypto';
import { Buffer } from 'buffer';

export interface HashResult {
  sha256: string;
  md5: string;
  size: number;
  algorithm: string;
}

export interface VerificationResult {
  isValid: boolean;
  expectedHash: string;
  actualHash: string;
  message: string;
}

class HashService {
  
  // Generate SHA-256 hash of file
  generateSHA256(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Generate MD5 hash of file
  generateMD5(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  // Generate multiple hashes
  generateHashes(buffer: Buffer): HashResult {
    return {
      sha256: this.generateSHA256(buffer),
      md5: this.generateMD5(buffer),
      size: buffer.length,
      algorithm: 'SHA-256'
    };
  }

  // Verify document hash against expected hash
  verifyDocumentHash(
    documentBuffer: Buffer, 
    expectedHash: string, 
    algorithm: string = 'sha256'
  ): VerificationResult {
    const actualHash = algorithm === 'sha256' 
      ? this.generateSHA256(documentBuffer)
      : this.generateMD5(documentBuffer);

    const isValid = actualHash === expectedHash;

    return {
      isValid,
      expectedHash,
      actualHash,
      message: isValid 
        ? 'Document hash matches. Document is authentic.'
        : 'Document hash mismatch. Document may have been tampered with.'
    };
  }

  // Generate hash from file path
  async generateHashFromFile(filePath: string): Promise<HashResult> {
    const fs = await import('fs');
    const buffer = fs.readFileSync(filePath);
    return this.generateHashes(buffer);
  }

  // Create document fingerprint (combination of multiple hashes)
  createDocumentFingerprint(buffer: Buffer): string {
    const sha256 = this.generateSHA256(buffer);
    const md5 = this.generateMD5(buffer);
    const size = buffer.length;
    
    // Combine hashes for unique fingerprint
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${sha256}:${md5}:${size}`)
      .digest('hex');
    
    return fingerprint;
  }
}

export default HashService;
```

### **File Validation Service (TO BE IMPLEMENTED)**
```typescript
// src/services/validationService.ts
import { Buffer } from 'buffer';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fileType: string;
  size: number;
}

export interface FileValidationConfig {
  maxSizeBytes: number;
  allowedTypes: string[];
  allowedExtensions: string[];
}

class ValidationService {
  private config: FileValidationConfig;

  constructor(config: FileValidationConfig) {
    this.config = config;
  }

  // Validate file based on configuration
  validateFile(buffer: Buffer, fileName: string, mimeType: string): ValidationResult {
    const errors: string[] = [];
    const fileExtension = this.getFileExtension(fileName);
    const detectedType = this.detectFileType(buffer);

    // Size validation
    if (buffer.length > this.config.maxSizeBytes) {
      errors.push(`File size ${buffer.length} exceeds maximum ${this.config.maxSizeBytes} bytes`);
    }

    // MIME type validation
    if (!this.config.allowedTypes.includes(mimeType)) {
      errors.push(`File type ${mimeType} is not allowed`);
    }

    // Extension validation
    if (!this.config.allowedExtensions.includes(fileExtension)) {
      errors.push(`File extension ${fileExtension} is not allowed`);
    }

    // Magic number validation (file signature)
    if (detectedType && detectedType !== mimeType) {
      errors.push(`File signature mismatch: expected ${mimeType}, detected ${detectedType}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileType: detectedType || mimeType,
      size: buffer.length
    };
  }

  // Detect file type by magic numbers
  private detectFileType(buffer: Buffer): string | null {
    const magicNumbers = {
      'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
      'image/jpeg': [0xFF, 0xD8, 0xFF],             // JPEG
      'image/png': [0x89, 0x50, 0x4E, 0x47],        // PNG
      'application/zip': [0x50, 0x4B],              // ZIP (DOCX)
    };

    for (const [mimeType, signature] of Object.entries(magicNumbers)) {
      if (this.matchesSignature(buffer, signature)) {
        return mimeType;
      }
    }

    return null;
  }

  // Check if buffer matches file signature
  private matchesSignature(buffer: Buffer, signature: number[]): boolean {
    if (buffer.length < signature.length) return false;
    
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) return false;
    }
    
    return true;
  }

  // Get file extension
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  // Sanitize file name
  sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }
}

export default ValidationService;
```

---

## 🔧 Configuration & Setup

### **IPFS Configuration (TO BE CREATED)**
```typescript
// config/ipfs.config.ts
export const ipfsConfig = {
  // Pinata configuration
  pinata: {
    host: 'api.pinata.cloud',
    port: 443,
    protocol: 'https' as const,
    headers: {
      'pinata_api_key': process.env.PINATA_API_KEY || '',
      'pinata_secret_api_key': process.env.PINATA_SECRET_KEY || '',
    },
  },

  // Infura IPFS configuration
  infura: {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https' as const,
    headers: {
      authorization: `Basic ${Buffer.from(
        `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
      ).toString('base64')}`,
    },
  },

  // Local IPFS node configuration
  local: {
    host: 'localhost',
    port: 5001,
    protocol: 'http' as const,
  },

  // Gateway URLs
  gateways: {
    pinata: 'https://gateway.pinata.cloud/ipfs/',
    infura: 'https://ipfs.infura.io/ipfs/',
    cloudflare: 'https://cloudflare-ipfs.com/ipfs/',
    dweb: 'https://dweb.link/ipfs/',
  },

  // Upload settings
  upload: {
    timeout: 60000,
    retries: 3,
    pin: true,
    wrapWithDirectory: false,
  },
};

export default ipfsConfig;
```

### **Storage Configuration (TO BE CREATED)**
```typescript
// config/storage.config.ts
export const storageConfig = {
  // File validation settings
  validation: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
    ],
    allowedExtensions: [
      'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'
    ],
  },

  // Encryption settings (optional)
  encryption: {
    algorithm: 'aes-256-gcm',
    keyDerivation: 'pbkdf2',
    iterations: 100000,
  },

  // Metadata settings
  metadata: {
    includeTimestamp: true,
    includeChecksum: true,
    includeFileInfo: true,
  },

  // Backup settings
  backup: {
    multipleGateways: true,
    redundantStorage: true,
    verificationChecks: true,
  },
};

export default storageConfig;
```

---

## 🔗 Backend Integration

### **Express Middleware for File Upload (TO BE IMPLEMENTED)**
```typescript
// backend/middleware/uploadMiddleware.ts
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import IPFSService from '../services/ipfsService';
import HashService from '../services/hashService';
import ValidationService from '../services/validationService';

export interface UploadedFileData {
  originalName: string;
  ipfsHash: string;
  documentHash: string;
  size: number;
  mimeType: string;
  uploadDate: Date;
}

class UploadMiddleware {
  private ipfsService: IPFSService;
  private hashService: HashService;
  private validationService: ValidationService;
  private upload: multer.Multer;

  constructor() {
    this.ipfsService = new IPFSService(ipfsConfig.pinata);
    this.hashService = new HashService();
    this.validationService = new ValidationService(storageConfig.validation);
    
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: storageConfig.validation.maxSizeBytes,
      },
      fileFilter: this.fileFilter.bind(this),
    });
  }

  // File filter for multer
  private fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const validation = this.validationService.validateFile(
      Buffer.from([]), // Empty buffer for initial check
      file.originalname,
      file.mimetype
    );

    if (validation.isValid) {
      cb(null, true);
    } else {
      cb(new Error(validation.errors.join(', ')));
    }
  }

  // Upload to IPFS middleware
  uploadToIPFS = (fieldName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      this.upload.single(fieldName)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
          // Validate file
          const validation = this.validationService.validateFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
          );

          if (!validation.isValid) {
            return res.status(400).json({ 
              error: 'File validation failed',
              details: validation.errors 
            });
          }

          // Generate document hash
          const documentHash = this.hashService.generateSHA256(req.file.buffer);

          // Upload to IPFS
          const ipfsResult = await this.ipfsService.uploadFile(
            req.file.buffer,
            {
              fileName: this.validationService.sanitizeFileName(req.file.originalname),
              originalName: req.file.originalname,
              mimeType: req.file.mimetype,
              documentHash,
              uploadDate: new Date().toISOString(),
            }
          );

          // Attach file data to request
          req.fileData = {
            originalName: req.file.originalname,
            ipfsHash: ipfsResult.hash,
            documentHash,
            size: req.file.size,
            mimeType: req.file.mimetype,
            uploadDate: new Date(),
          };

          next();
        } catch (error) {
          res.status(500).json({ 
            error: 'Upload failed',
            message: error.message 
          });
        }
      });
    };
  };

  // Multiple file upload
  uploadMultipleToIPFS = (fieldName: string, maxCount: number = 5) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      this.upload.array(fieldName, maxCount)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
          return res.status(400).json({ error: 'No files uploaded' });
        }

        try {
          const uploadPromises = req.files.map(async (file) => {
            // Validate each file
            const validation = this.validationService.validateFile(
              file.buffer,
              file.originalname,
              file.mimetype
            );

            if (!validation.isValid) {
              throw new Error(`Validation failed for ${file.originalname}: ${validation.errors.join(', ')}`);
            }

            // Generate hash and upload
            const documentHash = this.hashService.generateSHA256(file.buffer);
            const ipfsResult = await this.ipfsService.uploadFile(file.buffer, {
              fileName: file.originalname,
              documentHash,
            });

            return {
              originalName: file.originalname,
              ipfsHash: ipfsResult.hash,
              documentHash,
              size: file.size,
              mimeType: file.mimetype,
              uploadDate: new Date(),
            };
          });

          req.filesData = await Promise.all(uploadPromises);
          next();
        } catch (error) {
          res.status(500).json({ 
            error: 'Multiple upload failed',
            message: error.message 
          });
        }
      });
    };
  };
}

export default UploadMiddleware;
```

### **Document Controller (TO BE IMPLEMENTED)**
```typescript
// backend/controllers/documentController.ts
import { Request, Response } from 'express';
import IPFSService from '../services/ipfsService';
import HashService from '../services/hashService';

class DocumentController {
  private ipfsService: IPFSService;
  private hashService: HashService;

  constructor() {
    this.ipfsService = new IPFSService(ipfsConfig.pinata);
    this.hashService = new HashService();
  }

  // Upload document
  uploadDocument = async (req: Request, res: Response) => {
    try {
      const { landId } = req.body;
      const fileData = req.fileData; // From upload middleware

      if (!fileData) {
        return res.status(400).json({ error: 'No file data found' });
      }

      // Save document info to database
      const document = await Document.create({
        landId,
        originalName: fileData.originalName,
        ipfsHash: fileData.ipfsHash,
        documentHash: fileData.documentHash,
        size: fileData.size,
        mimeType: fileData.mimeType,
        uploadDate: fileData.uploadDate,
        uploadedBy: req.user.id,
      });

      res.status(201).json({
        success: true,
        document: {
          id: document._id,
          ipfsHash: fileData.ipfsHash,
          documentHash: fileData.documentHash,
          url: this.ipfsService.getFileUrl(fileData.ipfsHash),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Verify document
  verifyDocument = async (req: Request, res: Response) => {
    try {
      const { documentHash, landId } = req.body;
      const uploadedFile = req.file;

      if (!uploadedFile) {
        return res.status(400).json({ error: 'No file provided for verification' });
      }

      // Get stored document hash from database
      const storedDocument = await Document.findOne({ landId });
      
      if (!storedDocument) {
        return res.status(404).json({ error: 'Document not found for this land' });
      }

      // Generate hash of uploaded file
      const uploadedFileHash = this.hashService.generateSHA256(uploadedFile.buffer);

      // Compare hashes
      const verificationResult = this.hashService.verifyDocumentHash(
        uploadedFile.buffer,
        storedDocument.documentHash
      );

      res.json({
        success: true,
        verification: verificationResult,
        storedHash: storedDocument.documentHash,
        uploadedHash: uploadedFileHash,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get document by hash
  getDocument = async (req: Request, res: Response) => {
    try {
      const { hash } = req.params;

      // Check if document exists in database
      const document = await Document.findOne({ 
        $or: [
          { ipfsHash: hash },
          { documentHash: hash }
        ]
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Get file from IPFS
      const fileBuffer = await this.ipfsService.getFile(document.ipfsHash);

      res.setHeader('Content-Type', document.mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
      res.send(fileBuffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get document metadata
  getDocumentMetadata = async (req: Request, res: Response) => {
    try {
      const { hash } = req.params;

      const document = await Document.findOne({
        $or: [
          { ipfsHash: hash },
          { documentHash: hash }
        ]
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const ipfsMetadata = await this.ipfsService.getFileMetadata(document.ipfsHash);

      res.json({
        success: true,
        metadata: {
          ...document.toObject(),
          ipfsMetadata,
          url: this.ipfsService.getFileUrl(document.ipfsHash),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default DocumentController;
```

---

## 📦 Required Dependencies

### **Core Dependencies**
```json
{
  "dependencies": {
    "ipfs-http-client": "^60.0.1",
    "crypto": "^1.0.1",
    "buffer": "^6.0.3",
    "multer": "^1.4.5",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "@types/multer": "^1.4.7",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.5"
  }
}
```

### **Environment Variables**
```bash
# .env
# Pinata IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Infura IPFS
INFURA_PROJECT_ID=your_infura_project_id
INFURA_PROJECT_SECRET=your_infura_project_secret

# Gateway URLs
IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/

# File Upload Settings
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png
```

---

## 🧪 Testing Strategy

### **IPFS Service Tests (TO BE IMPLEMENTED)**
```typescript
// tests/ipfs.test.ts
import IPFSService from '../src/services/ipfsService';
import { Buffer } from 'buffer';

describe('IPFS Service', () => {
  let ipfsService: IPFSService;
  const testFile = Buffer.from('Test document content');

  beforeAll(() => {
    ipfsService = new IPFSService(ipfsConfig.local);
  });

  describe('File Upload', () => {
    it('should upload file to IPFS', async () => {
      const result = await ipfsService.uploadFile(testFile, {
        fileName: 'test.txt'
      });

      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('size');
      expect(result.size).toBe(testFile.length);
    });

    it('should handle upload errors', async () => {
      const invalidFile = Buffer.alloc(0);
      
      await expect(
        ipfsService.uploadFile(invalidFile)
      ).rejects.toThrow();
    });
  });

  describe('File Retrieval', () => {
    it('should retrieve uploaded file', async () => {
      const uploadResult = await ipfsService.uploadFile(testFile);
      const retrievedFile = await ipfsService.getFile(uploadResult.hash);

      expect(retrievedFile).toEqual(testFile);
    });

    it('should check file existence', async () => {
      const uploadResult = await ipfsService.uploadFile(testFile);
      const exists = await ipfsService.fileExists(uploadResult.hash);

      expect(exists).toBe(true);
    });
  });
});
```

---

## 📊 Implementation Priority

### **Phase 1: Core IPFS Integration (Week 1)**
1. **IPFS Service** → Basic upload/download functionality
2. **Hash Service** → Document hash generation and verification
3. **Validation Service** → File type and size validation
4. **Configuration** → Environment setup

**Estimated Time: 20-25 hours**

### **Phase 2: Backend Integration (Week 2)**
1. **Upload Middleware** → Express middleware for file handling
2. **Document Controller** → API endpoints for document operations
3. **Database Models** → Document storage schema
4. **Error Handling** → Comprehensive error management

**Estimated Time: 15-20 hours**

### **Phase 3: Frontend Integration (Week 3)**
1. **Upload Components** → File upload UI components
2. **Progress Tracking** → Upload progress indicators
3. **Verification UI** → Document verification interface
4. **Error Handling** → User-friendly error messages

**Estimated Time: 15-20 hours**

### **Phase 4: Advanced Features (Week 4)**
1. **Batch Uploads** → Multiple file handling
2. **Encryption** → Optional document encryption
3. **Metadata Management** → Rich document metadata
4. **Performance Optimization** → Caching and optimization

**Estimated Time: 10-15 hours**

---

## 🛠️ Quick Start Commands

```bash
# Install IPFS dependencies
npm install ipfs-http-client crypto buffer multer

# Setup IPFS node (optional - for local development)
# Download IPFS: https://ipfs.io/
ipfs init
ipfs daemon

# Test IPFS connection
curl -X POST "http://localhost:5001/api/v0/version"

# Create Pinata account (recommended)
# Visit: https://pinata.cloud/
# Get API keys and add to .env
```

---

## ⚠️ Critical Implementation Notes

### **Security Considerations**
- **File Validation** → Always validate file types and sizes
- **Hash Integrity** → Use SHA-256 for cryptographic security
- **Access Control** → Restrict file access based on user roles
- **Malware Scanning** → Consider adding virus scanning
- **Rate Limiting** → Prevent abuse of upload endpoints

### **Performance Optimization**
- **Chunked Uploads** → Support large file uploads
- **Compression** → Compress files before IPFS upload
- **Caching** → Cache frequently accessed files
- **CDN Integration** → Use IPFS gateways with CDN

### **IPFS Best Practices**
- **Pinning** → Always pin important files
- **Redundancy** → Use multiple IPFS gateways
- **Backup** → Maintain backup copies
- **Monitoring** → Monitor IPFS node health

---

**Current Status**: Not Started - Complete IPFS Integration Required  
**Next Priority**: Implement core IPFS service and file handling  
**Estimated Development Time**: 60-80 hours  
**Required Skills**: IPFS, Node.js, File Handling, Cryptography, Express
