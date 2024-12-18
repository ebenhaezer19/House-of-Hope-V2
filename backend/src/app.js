const express = require('express');
const path = require('path');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const upload = require('./middleware/upload.middleware');
const { errorMiddleware } = require('./middleware/error.middleware');

// Inisialisasi express
const app = express();
const prisma = new PrismaClient();

// Konfigurasi CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Izinkan credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight request selama 10 menit
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Routes untuk residents
app.post('/residents', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);
    
    // Parse data resident
    const residentData = JSON.parse(req.body.data);
    console.log('Parsed resident data:', residentData);

    // Proses file foto
    let photoDocument = null;
    if (req.files.photo) {
      const photo = req.files.photo[0];
      photoDocument = {
        name: photo.filename,
        path: `/uploads/${photo.filename}`,
        type: 'photo'
      };
    }

    // Proses dokumen pendukung
    const supportingDocuments = req.files.documents?.map(doc => ({
      name: doc.filename,
      path: `/uploads/${doc.filename}`,
      type: 'document'
    })) || [];

    // Gabungkan semua dokumen
    const documents = photoDocument ? [photoDocument, ...supportingDocuments] : supportingDocuments;

    // Buat resident dengan dokumen
    const resident = await prisma.resident.create({
      data: {
        ...residentData,
        documents: {
          create: documents
        }
      },
      include: {
        documents: true,
        room: true
      }
    });

    res.status(201).json(resident);
    
  } catch (error) {
    console.error('Error creating resident:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat memproses data',
      error: error.message
    });
  }
});

// Error handling middleware
app.use(errorMiddleware);

// Port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

module.exports = app;