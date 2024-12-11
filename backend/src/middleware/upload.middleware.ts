import multer from 'multer'

// Gunakan memory storage agar bisa akses buffer
const storage = multer.memoryStorage()

// Tambahkan filter untuk tipe file yang diizinkan
const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format file tidak didukung'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}) 