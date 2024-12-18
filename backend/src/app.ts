import express from 'express'
import cors from 'cors'
import routes from './routes'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()

// Get root directory
const rootDir = path.resolve(__dirname, '..')

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`)
  })
  next()
})

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Type']
}))

// Tambahkan middleware CORS khusus untuk route /uploads
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length, Content-Type')
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

// Body parser
app.use(express.json())

// Serve static files
const uploadsPath = path.join(rootDir, 'uploads')
console.log('Server config:', {
  rootDir,
  uploadsPath,
  cwd: process.cwd(),
  exists: fs.existsSync(uploadsPath)
})

// Pastikan folder uploads ada
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

// Log available files
const files = fs.readdirSync(uploadsPath)
console.log('Files in uploads:', {
  count: files.length,
  files: files.map((f: string) => ({
    name: f,
    path: path.join(uploadsPath, f),
    exists: fs.existsSync(path.join(uploadsPath, f))
  }))
})

// Middleware untuk logging requests
app.use('/uploads', (req, res, next) => {
  const requestedFile = path.join(uploadsPath, req.path)
  console.log('File request:', {
    url: req.url,
    path: req.path,
    fullPath: requestedFile,
    exists: fs.existsSync(requestedFile)
  })
  next()
})

// Serve static files
app.use('/uploads', (req, res) => {
  const requestedFile = path.join(uploadsPath, req.path)
  
  console.log('File request:', {
    path: req.path,
    fullPath: requestedFile,
    exists: fs.existsSync(requestedFile)
  })

  if (!fs.existsSync(requestedFile)) {
    return res.status(404).json({
      error: 'File not found',
      requestedPath: req.path
    })
  }

  // Get file extension
  const ext = path.extname(requestedFile).toLowerCase()

  // Set content type and disposition
  res.set({
    'Content-Type': {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    }[ext] || 'application/octet-stream',
    'Content-Disposition': ext === '.pdf' ? 'attachment' : 'inline',
    'Cache-Control': 'public, max-age=31536000'
  })

  // Send file
  res.sendFile(requestedFile, (err) => {
    if (err) {
      console.error('Error sending file:', err)
      res.status(500).json({ error: 'Error sending file' })
    }
  })
})

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder uploads ada
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true })
    }
    console.log('Upload destination:', uploadsPath)
    cb(null, uploadsPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now()
    // Sanitasi nama file
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${uniqueSuffix}-${sanitizedName}`
    
    console.log('Generated filename:', {
      original: file.originalname,
      sanitized: sanitizedName,
      final: filename,
      mimetype: file.mimetype
    })
    
    cb(null, filename)
  }
})

const allowedMimes = {
  'image/jpeg': true,
  'image/png': true,
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true
} as const

type AllowedMimeType = keyof typeof allowedMimes

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  // Validasi tipe file
  if (!allowedMimes[file.mimetype as AllowedMimeType]) {
    cb(new Error('Invalid file type'))
    return
  }

  console.log('Uploading file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  })
  
  cb(null, true)
}

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
})

// Import prisma client
const prisma = new PrismaClient()

// Middleware untuk upload file
app.post('/api/residents', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), async (req, res) => {
  try {
    // Log files yang diterima
    console.log('Received files:', {
      files: req.files,
      fileDetails: Object.entries(req.files || {}).map(([key, files]: [string, Express.Multer.File[]]) => ({
        field: key,
        files: files.map((f: Express.Multer.File) => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
          path: f.path
        }))
      }))
    })

    // Parse resident data
    const residentData = JSON.parse(req.body.data)
    
    // Process files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const photoPath = files?.photo?.[0]?.path
    const documentPaths = files?.documents?.map((doc: Express.Multer.File) => doc.path) || []

    console.log('Processing files:', {
      photo: photoPath ? {
        path: photoPath,
        exists: fs.existsSync(photoPath)
      } : null,
      documents: documentPaths.map((path: string) => ({
        path,
        exists: fs.existsSync(path)
      }))
    })

    // Create resident with documents
    const resident = await prisma.resident.create({
      data: {
        ...residentData,
        documents: {
          create: [
            // Photo document
            photoPath && {
              name: files.photo[0].originalname,
              path: `/uploads/${path.basename(photoPath)}`,
              type: 'photo'
            },
            // Other documents
            ...documentPaths.map(docPath => ({
              name: path.basename(docPath),
              path: `/uploads/${path.basename(docPath)}`,
              type: 'document'
            }))
          ].filter(Boolean)
        }
      },
      include: {
        documents: true,
        room: true
      }
    })

    console.log('Created resident with documents:', {
      id: resident.id,
      documents: resident.documents
    })

    // Send success response
    res.json({
      message: 'Data berhasil disimpan',
      resident,
      files: {
        photo: photoPath,
        documents: documentPaths
      }
    })
  } catch (error: any) {
    console.error('Error processing request:', error)
    res.status(500).json({
      message: 'Terjadi kesalahan saat memproses data',
      error: error?.message || 'Unknown error'
    })
  }
})

// Middleware untuk update resident
app.put('/api/residents/:id', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), async (req, res) => {
  try {
    const { id } = req.params
    
    // Log request
    console.log('Update request:', {
      id,
      body: req.body,
      files: req.files
    })

    // Parse resident data
    const residentData = JSON.parse(req.body.data)
    
    // Process files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const photoPath = files?.photo?.[0]?.path
    const documentPaths = files?.documents?.map(doc => doc.path) || []

    console.log('File paths:', {
      photo: photoPath,
      documents: documentPaths
    })

    // Update resident
    const resident = await prisma.resident.update({
      where: { id: parseInt(id) },
      data: {
        ...residentData,
        documents: {
          // Delete old documents if new ones are uploaded
          ...(photoPath && {
            deleteMany: {
              type: 'photo'
            }
          }),
          create: [
            // Photo document
            photoPath && {
              name: files.photo[0].originalname,
              path: `/uploads/${path.basename(photoPath)}`,
              type: 'photo'
            },
            // Other documents
            ...documentPaths.map(docPath => ({
              name: path.basename(docPath),
              path: `/uploads/${path.basename(docPath)}`,
              type: 'document'
            }))
          ].filter(Boolean)
        }
      },
      include: {
        documents: true,
        room: true
      }
    })

    // Send success response
    res.json({
      message: 'Data berhasil diperbarui',
      resident
    })
  } catch (error: any) {
    console.error('Error updating resident:', error)
    res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui data',
      error: error?.message || 'Unknown error'
    })
  }
})

// Routes
app.use('/api', routes)

const PORT = 5001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Uploads directory:', uploadsPath)
  console.log('Available files:', files)
})

export default app 