"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
// 1. Storage Configuration: We use MemoryStorage to keep files in RAM
// so we can stream them directly to Cloudinary without saving them on our disk.
const storage = multer_1.default.memoryStorage();
// 2. File Filter: Check if the uploaded file is an image
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept file
    }
    else {
        cb(new AppError_1.default(400, 'Not an image! Please upload only images.'), false); // Reject file
    }
};
// 3. Initialize Multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit: 5MB per image
    }
});
