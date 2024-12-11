import multer from 'multer'
import path from 'path'

// Konfigurasi penyimpanan sementara
const storage = multer.memoryStorage()

// Filter file yang diizinkan
const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF'))
  }
}

// Konfigurasi multer
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}) 