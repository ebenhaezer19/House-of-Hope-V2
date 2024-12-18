"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
// Konfigurasi penyimpanan sementara
const storage = multer_1.default.memoryStorage();
// Filter file yang diizinkan
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF'));
    }
};
// Konfigurasi multer dengan limit file yang lebih besar
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Menaikkan limit menjadi 10MB
    }
});
