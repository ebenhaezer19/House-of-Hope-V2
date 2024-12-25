import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient, ResidentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from './types/error';

// Di bagian atas file, hanya definisikan interface yang digunakan
interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

const app = express();
const prisma = new PrismaClient();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 600, // 10 menit
  preflightContinue: false
};

// Basic middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists first
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  }
}));

// Multer configuration
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: Function) => {
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: Function) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Format file ${file.originalname} tidak didukung`));
    }
  }
});

// Upload middleware
const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const uploadFields = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]);

  uploadFields(req, res, (err: any) => {
    if (err) {
      console.error('Upload error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            message: 'Error upload file',
            error: 'Ukuran file terlalu besar (maksimal 20MB)'
          });
          return;
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({
            message: 'Error upload file',
            error: 'Terlalu banyak file (maksimal 5 dokumen)'
          });
          return;
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          res.status(400).json({
            message: 'Error upload file',
            error: 'Field tidak sesuai (gunakan photo atau documents)'
          });
          return;
        }
      }
      res.status(400).json({
        message: 'Error upload file',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
      return;
    }

    // Log request body dan files untuk debug
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ 
        message: 'Email dan password harus diisi' 
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      res.status(401).json({ 
        message: 'Email atau password salah' 
      });
      return;
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ 
        message: 'Email atau password salah' 
      });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Send response
    res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Test route
app.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Residents routes
app.get('/api/residents', async (_req: Request, res: Response) => {
  try {
    const residents = await prisma.resident.findMany({
      include: {
        documents: true,
        room: true
      }
    });
    res.json(residents);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Create resident
app.post('/api/residents', uploadMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = JSON.parse(req.body.data);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validasi status
    if (!Object.values(ResidentStatus).includes(data.status)) {
      res.status(400).json({
        message: `Status tidak valid: ${data.status}`
      });
      return;
    }

    // Validasi field berdasarkan status
    const requiredFields = [
      'name', 'nik', 'birthPlace', 'birthDate', 'gender',
      'address', 'education', 'schoolName', 'assistance',
      'roomId', 'status'
    ];

    // Tambahkan validasi khusus untuk ALUMNI
    if (data.status === ResidentStatus.ALUMNI) {
      requiredFields.push('exitDate', 'alumniNotes');
    }

    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        message: 'Semua field wajib harus diisi',
        missingFields
      });
      return;
    }

    // Cek apakah NIK sudah ada
    const existingResident = await prisma.resident.findUnique({
      where: { nik: data.nik }
    });

    if (existingResident) {
      res.status(400).json({
        message: 'NIK sudah terdaftar',
        error: 'DUPLICATE_NIK'
      });
      return;
    }

    // Format data untuk create
    const residentData = {
      name: data.name,
      nik: data.nik,
      birthPlace: data.birthPlace,
      birthDate: data.birthDate,
      gender: data.gender,
      address: data.address,
      phone: data.phone || null,
      education: data.education,
      schoolName: data.schoolName,
      grade: data.grade || null,
      major: data.major || null,
      assistance: data.assistance,
      details: data.details || null,
      status: data.status as ResidentStatus,
      createdAt: new Date(),
      ...(data.status === ResidentStatus.ALUMNI ? {
        exitDate: new Date(data.exitDate),
        alumniNotes: data.alumniNotes
      } : {
        exitDate: null,
        alumniNotes: null
      }),
      room: {
        connect: { id: parseInt(data.roomId) }
      },
      documents: {
        create: [
          ...(files?.photo ? [{
            name: files.photo[0].originalname,
            path: `/uploads/${files.photo[0].filename}`,
            type: 'photo'
          }] : []),
          ...(files?.documents ? 
            files.documents.map(file => ({
              name: file.originalname,
              path: `/uploads/${file.filename}`,
              type: 'document'
            }))
            : []
          )
        ]
      }
    };

    // Buat resident
    const resident = await prisma.resident.create({
      data: residentData,
      include: {
        room: true,
        documents: true
      }
    });

    // Kirim response
    res.status(201).json({
      message: 'Data penghuni berhasil ditambahkan',
      data: {
        id: resident.id,
        name: resident.name,
        status: resident.status,
        exitDate: resident.exitDate
      }
    });
    return;

  } catch (error) {
    console.error('Error creating resident:', error);
    
    // Handle Prisma errors
    if (error.code === 'P2002' && error.meta?.target?.includes('nik')) {
      res.status(400).json({
        message: 'NIK sudah terdaftar',
        error: 'DUPLICATE_NIK'
      });
      return;
    }

    res.status(500).json({ 
      message: 'Gagal membuat data penghuni',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
    return;
  }
});

// Rooms routes
app.get('/api/rooms', async (_req: Request, res: Response) => {
  try {
    console.log('Fetching rooms...');
    
    const rooms = await prisma.room.findMany({
      include: {
        residents: true,
        _count: {
          select: { residents: true }
        }
      }
    });

    // Transform data untuk menambahkan info okupansi
    const roomsWithOccupancy = rooms.map(room => ({
      id: room.id,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      floor: room.floor,
      description: room.description,
      occupancy: room._count.residents,
      availableSpace: room.capacity - room._count.residents,
      residents: room.residents
    }));

    res.json(roomsWithOccupancy);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data kamar',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Get single room
app.get('/api/rooms/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        residents: true,
        _count: {
          select: { residents: true }
        }
      }
    });

    if (!room) {
      res.status(404).json({ message: 'Kamar tidak ditemukan' });
      return;
    }

    // Add occupancy info
    const roomWithOccupancy = {
      ...room,
      occupancy: room._count.residents,
      availableSpace: room.capacity - room._count.residents
    };

    res.json(roomWithOccupancy);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data kamar',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Get single resident
app.get('/api/residents/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const resident = await prisma.resident.findUnique({
      where: { id },
      include: {
        documents: true,
        room: true
      }
    });

    if (!resident) {
      res.status(404).json({ message: 'Penghuni tidak ditemukan' });
      return;
    }

    res.json(resident);
  } catch (error) {
    console.error('Error fetching resident:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data penghuni',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Update resident
app.put('/api/residents/:id', uploadMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log('Update request for resident:', id);
    console.log('Request body:', req.body);
    console.log('Request files:', files);

    // Parse resident data
    let data;
    try {
      data = JSON.parse(req.body.data);
    } catch (e) {
      console.error('Error parsing data:', e);
      res.status(400).json({ 
        message: 'Format data tidak valid',
        error: e.message 
      });
      return;
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update resident data
      await tx.resident.update({
        where: { id: Number(id) },
        data: {
          name: data.name,
          nik: data.nik,
          birthPlace: data.birthPlace,
          birthDate: data.birthDate,
          gender: data.gender,
          address: data.address,
          phone: data.phone || null,
          education: data.education,
          schoolName: data.schoolName,
          grade: data.grade || null,
          major: data.major || null,
          assistance: data.assistance,
          details: data.details || null,
          status: data.status,
          exitDate: data.exitDate ? new Date(data.exitDate) : null,
          alumniNotes: data.alumniNotes || null,
          roomId: parseInt(data.roomId)
        }
      });

      // Handle photo if uploaded
      if (files?.photo?.[0]) {
        console.log('Processing photo:', files.photo[0].originalname);
        
        // Delete old photo
        await tx.document.deleteMany({
          where: {
            residentId: Number(id),
            type: 'photo'
          }
        });

        // Create new photo
        await tx.document.create({
          data: {
            name: files.photo[0].originalname,
            path: `/uploads/${files.photo[0].filename}`,
            type: 'photo',
            residentId: Number(id)
          }
        });
      }

      // Handle documents if uploaded
      if (files?.documents?.length) {
        console.log('Processing documents:', files.documents.map(f => f.originalname));
        
        // Delete old documents
        await tx.document.deleteMany({
          where: {
            residentId: Number(id),
            type: 'document'
          }
        });

        // Create new documents
        await tx.document.createMany({
          data: files.documents.map(file => ({
            name: file.originalname,
            path: `/uploads/${file.filename}`,
            type: 'document',
            residentId: Number(id)
          }))
        });
      }

      // Get final data
      return await tx.resident.findUnique({
        where: { id: Number(id) },
        include: {
          room: true,
          documents: true
        }
      });
    });

    console.log('Update completed successfully');
    res.json({
      message: 'Data penghuni berhasil diperbarui',
      data: result
    });

  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({
      message: 'Gagal memperbarui data penghuni',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Auth middleware
const authMiddleware = async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Token tidak ditemukan' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: number;
      email: string;
      role: string;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
    return;
  }
};

// Check auth status
app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User tidak terautentikasi' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    res.json({
      user,
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ 
      message: 'Gagal memeriksa status autentikasi',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Delete resident
app.delete('/api/residents/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Hapus dokumen terkait
    await prisma.document.deleteMany({
      where: { residentId: id }
    });

    // Hapus data penghuni
    const deleted = await prisma.resident.delete({
      where: { id }
    });

    res.json({ 
      message: 'Data penghuni berhasil dihapus',
      data: deleted
    });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus data penghuni',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Payments routes
app.get('/api/payments', async (req: Request, res: Response) => {
  try {
    const { residentId } = req.query;
    console.log('Getting payments with query:', { residentId });

    const payments = await prisma.payment.findMany({
      where: {
        residentId: residentId ? Number(residentId) : undefined
      },
      include: {
        resident: {
          include: {
            room: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    console.log(`Found ${payments.length} payments`);
    res.json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data pembayaran',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

app.post('/api/payments', async (req: Request, res: Response) => {
  try {
    const { residentId, amount, type, status, notes } = req.body;
    console.log('Creating payment:', req.body);

    const payment = await prisma.payment.create({
      data: {
        residentId: Number(residentId),
        amount: Number(amount),
        type,
        status,
        notes,
        date: new Date()
      },
      include: {
        resident: {
          include: {
            room: true
          }
        }
      }
    });

    console.log('Payment created:', payment);
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ 
      message: 'Gagal membuat pembayaran',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

app.get('/api/payments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: Number(id) },
      include: {
        resident: {
          include: {
            room: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    return res.json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    return res.status(500).json({ message: 'Gagal mengambil data pembayaran' });
  }
});

app.put('/api/payments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, type, status, notes } = req.body;

    const payment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        amount: Number(amount),
        type,
        status,
        notes
      },
      include: {
        resident: {
          include: {
            room: true
          }
        }
      }
    });

    return res.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({ message: 'Gagal mengupdate pembayaran' });
  }
});

app.delete('/api/payments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({
      where: { id: Number(id) }
    });
    return res.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return res.status(500).json({ message: 'Gagal menghapus pembayaran' });
  }
});

// Facilities routes
app.get('/api/facilities', async (_req: Request, res: Response) => {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        bookings: {
          where: {
            startTime: {
              lte: new Date()
            },
            endTime: {
              gte: new Date()
            }
          },
          include: {
            resident: true
          }
        },
        maintenanceLogs: {
          orderBy: {
            startDate: 'desc'
          }
        }
      }
    });

    res.json(facilities);
  } catch (error) {
    console.error('Error getting facilities:', error);
    res.status(500).json({ message: 'Gagal mengambil data fasilitas' });
  }
});

app.post('/api/facilities', async (req: Request, res: Response) => {
  try {
    const { name, type, capacity, status, image, description, location, maintenanceSchedule } = req.body;

    console.log('Creating facility with data:', req.body);

    const facility = await prisma.facility.create({
      data: {
        name,
        type,
        capacity: parseInt(capacity),
        status,
        image,
        description,
        location,
        maintenanceSchedule
      }
    });

    console.log('Facility created:', facility);
    res.status(201).json(facility);
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({ 
      message: 'Gagal membuat fasilitas baru',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/facilities/:id/bookings', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { residentId, startTime, endTime, purpose, notes } = req.body;

    const booking = await prisma.booking.create({
      data: {
        facilityId: parseInt(id),
        residentId: parseInt(residentId),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        purpose,
        notes,
        status: 'pending'
      },
      include: {
        facility: true,
        resident: true
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Gagal membuat booking' });
  }
});

app.post('/api/facilities/:id/maintenance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, description, startDate, status, notes } = req.body;

    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        facilityId: parseInt(id),
        type,
        description,
        startDate: new Date(startDate),
        status,
        notes
      },
      include: {
        facility: true
      }
    });

    if (status === 'in_progress') {
      await prisma.facility.update({
        where: { id: parseInt(id) },
        data: { status: 'maintenance' }
      });
    }

    res.status(201).json(maintenanceLog);
  } catch (error) {
    console.error('Error creating maintenance log:', error);
    res.status(500).json({ message: 'Gagal membuat log maintenance' });
  }
});

// Update facility
app.put('/api/facilities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, capacity, status, image, description, location, maintenanceSchedule } = req.body;

    const facility = await prisma.facility.update({
      where: { id: Number(id) },
      data: {
        name,
        type,
        capacity: parseInt(capacity),
        status,
        image,
        description,
        location,
        maintenanceSchedule
      }
    });

    res.json(facility);
  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({ message: 'Gagal memperbarui fasilitas' });
  }
});

// Delete facility
app.delete('/api/facilities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.facility.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Fasilitas berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({ message: 'Gagal menghapus fasilitas' });
  }
});

// Get facility by ID
app.get('/api/facilities/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const facility = await prisma.facility.findUnique({
      where: { 
        id: Number(id) 
      },
      include: {
        bookings: {
          include: {
            resident: true
          },
          orderBy: {
            startTime: 'asc'
          }
        },
        maintenanceLogs: {
          where: {
            status: 'in_progress'
          }
        }
      }
    });

    if (!facility) {
      res.status(404).json({ message: 'Fasilitas tidak ditemukan' });
      return;
    }

    res.json(facility);
    return;
  } catch (error) {
    console.error('Error getting facility:', error);
    res.status(500).json({ message: 'Gagal mengambil data fasilitas' });
    return;
  }
});

// Update maintenance log
app.put('/api/facilities/maintenance/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, description, startDate, status, endDate, notes } = req.body;

    const maintenanceLog = await prisma.maintenanceLog.update({
      where: { id: Number(id) },
      data: {
        type,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        notes
      },
      include: {
        facility: true
      }
    });

    // Update facility status if maintenance is completed
    if (status === 'completed') {
      await prisma.facility.update({
        where: { id: maintenanceLog.facilityId },
        data: { status: 'available' }
      });
    }

    res.json(maintenanceLog);
    return;
  } catch (error) {
    console.error('Error updating maintenance log:', error);
    res.status(500).json({ message: 'Gagal mengupdate log maintenance' });
    return;
  }
});

// Delete maintenance log
app.delete('/api/facilities/maintenance/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get maintenance log first to check facility status
    const maintenanceLog = await prisma.maintenanceLog.findUnique({
      where: { id: Number(id) },
      include: {
        facility: true
      }
    });

    if (!maintenanceLog) {
      res.status(404).json({ message: 'Log maintenance tidak ditemukan' });
      return;
    }

    // Delete the maintenance log
    await prisma.maintenanceLog.delete({
      where: { id: Number(id) }
    });

    // If this was an active maintenance, update facility status back to available
    if (maintenanceLog.status === 'in_progress' && maintenanceLog.facility.status === 'maintenance') {
      await prisma.facility.update({
        where: { id: maintenanceLog.facilityId },
        data: { status: 'available' }
      });
    }

    res.json({ message: 'Log maintenance berhasil dihapus' });
    return;
  } catch (error) {
    console.error('Error deleting maintenance log:', error);
    res.status(500).json({ message: 'Gagal menghapus log maintenance' });
    return;
  }
});

// Log registered routes on startup
console.log('\n=== Registered Routes ===');
console.log('Available endpoints:');
console.log('- Test: http://localhost:5002/test');
console.log('- Health: http://localhost:5002/health');
console.log('- Login: http://localhost:5002/api/auth/login');
console.log('- Rooms: http://localhost:5002/api/rooms');
console.log('- Residents: http://localhost:5002/api/residents');
console.log('- Payments: http://localhost:5002/api/payments');
console.log('- Facilities: http://localhost:5002/api/facilities');
console.log('=================================');

// Start server
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('Available endpoints:');
  console.log('- Test: http://localhost:5002/test');
  console.log('- Health: http://localhost:5002/health');
  console.log('- Login: http://localhost:5002/api/auth/login');
  console.log('- Rooms: http://localhost:5002/api/rooms');
  console.log('- Residents: http://localhost:5002/api/residents');
  console.log('- Payments: http://localhost:5002/api/payments');
  console.log('=================================');
});

// Handle shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

// Upload files for resident
app.post('/api/residents/:id/files', uploadMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log('Files upload request for resident:', id);
    console.log('Files:', files);

    // Check if resident exists
    const existingResident = await prisma.resident.findUnique({
      where: { id: Number(id) }
    });

    if (!existingResident) {
      res.status(404).json({ message: 'Penghuni tidak ditemukan' });
      return;
    }

    // Handle photo
    if (files?.photo?.[0]) {
      await prisma.document.deleteMany({
        where: {
          residentId: Number(id),
          type: 'photo'
        }
      });

      await prisma.document.create({
        data: {
          name: files.photo[0].originalname,
          path: `/uploads/${files.photo[0].filename}`,
          type: 'photo',
          residentId: Number(id)
        }
      });
    }

    // Handle documents
    if (files?.documents?.length) {
      await prisma.document.deleteMany({
        where: {
          residentId: Number(id),
          type: 'document'
        }
      });

      await prisma.document.createMany({
        data: files.documents.map(file => ({
          name: file.originalname,
          path: `/uploads/${file.filename}`,
          type: 'document',
          residentId: Number(id)
        }))
      });
    }

    // Get updated data
    const updatedResident = await prisma.resident.findUnique({
      where: { id: Number(id) },
      include: {
        room: true,
        documents: true
      }
    });

    res.json({
      message: 'File berhasil diupload',
      data: updatedResident
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      message: 'Gagal mengupload file',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Upload photo for resident
app.post('/api/residents/:id/photo', upload.single('photo'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Tidak ada file yang diupload' });
      return;
    }

    // Check if resident exists
    const existingResident = await prisma.resident.findUnique({
      where: { id: Number(id) }
    });

    if (!existingResident) {
      res.status(404).json({ message: 'Penghuni tidak ditemukan' });
      return;
    }

    // Delete old photo
    await prisma.document.deleteMany({
      where: {
        residentId: Number(id),
        type: 'photo'
      }
    });

    // Create new photo document
    await prisma.document.create({
      data: {
        name: file.originalname,
        path: `/uploads/${file.filename}`,
        type: 'photo',
        residentId: Number(id)
      }
    });

    res.json({ message: 'Foto berhasil diupload' });

  } catch (error: unknown) {
    console.error('Error uploading photo:', error);
    res.status(500).json({
      message: 'Gagal mengupload foto',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : String(error)) : 
        undefined
    });
  }
});

// Upload single document for resident
app.post('/api/residents/:id/document', upload.single('document'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Tidak ada file yang diupload' });
      return;
    }

    // Check if resident exists
    const existingResident = await prisma.resident.findUnique({
      where: { id: Number(id) }
    });

    if (!existingResident) {
      res.status(404).json({ message: 'Penghuni tidak ditemukan' });
      return;
    }

    // Create new document
    await prisma.document.create({
      data: {
        name: file.originalname,
        path: `/uploads/${file.filename}`,
        type: 'document',
        residentId: Number(id)
      }
    });

    res.json({ message: 'Dokumen berhasil diupload' });

  } catch (error: unknown) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      message: 'Gagal mengupload dokumen',
      error: process.env.NODE_ENV === 'development' ? 
        error instanceof Error ? error.message : String(error) : 
        undefined
    });
  }
});

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? 
      err instanceof Error ? err.message : String(err) : 
      undefined
  });
});

// Handle unknown errors
process.on('uncaughtException', (error: unknown) => {
  console.error('Uncaught Exception:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason instanceof Error ? reason.message : String(reason));
});

export default app;