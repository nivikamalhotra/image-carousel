import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import config from '../config/config';

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Multer configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, config.uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF files are allowed'));
    return;
  }
  cb(null, true);
};

// Multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

// Error handling middleware
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
};