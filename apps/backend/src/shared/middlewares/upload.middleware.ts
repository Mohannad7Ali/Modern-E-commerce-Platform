import multer from 'multer';
import AppError from '@/shared/errors/AppError';

// 1. Storage Configuration: We use MemoryStorage to keep files in RAM
// so we can stream them directly to Cloudinary without saving them on our disk.
const storage = multer.memoryStorage();

// 2. File Filter: Check if the uploaded file is an image
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new AppError(400, 'Not an image! Please upload only images.'), false); // Reject file
  }
};

// 3. Initialize Multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit: 5MB per image
  }
});
