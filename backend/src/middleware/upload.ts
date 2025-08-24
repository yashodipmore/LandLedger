import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

// Set storage engine
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Check file type
const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  // Allowed file extensions
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  
  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Error: Only images (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX) are allowed!'));
  }
};

// Initialize upload
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    checkFileType(file, cb);
  }
});

// Multiple files upload
export const uploadMultiple = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    checkFileType(file, cb);
  }
}).array('documents', 5);
