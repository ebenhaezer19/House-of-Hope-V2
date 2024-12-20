import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, ResidentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Basic middleware
app.use(cors(corsOptions));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_req, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ensure uploads directory exists
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
app.post('/api/residents', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), async (req: Request, res: Response): Promise<void> => {
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
app.put('/api/residents/:id', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
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

    // Cek apakah resident exists
    const existingResident = await prisma.resident.findUnique({
      where: { id: Number(id) },
      include: { documents: true }
    });

    if (!existingResident) {
      res.status(404).json({ message: 'Penghuni tidak ditemukan' });
      return;
    }

    // Cek NIK duplikat hanya jika NIK berubah
    if (data.nik !== existingResident.nik) {
      const duplicateNik = await prisma.resident.findFirst({
        where: {
          nik: data.nik,
          id: { not: Number(id) }
        }
      });

      if (duplicateNik) {
        res.status(400).json({
          message: 'NIK sudah terdaftar',
          error: 'DUPLICATE_NIK'
        });
        return;
      }
    }

    // Update resident
    const resident = await prisma.resident.update({
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
        status: data.status as ResidentStatus,
        exitDate: data.exitDate ? new Date(data.exitDate) : null,
        alumniNotes: data.alumniNotes || null,
        room: {
          connect: { id: parseInt(data.roomId) }
        },
        // Hanya tambah dokumen baru jika ada
        ...(files && Object.keys(files).length > 0 ? {
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
        } : {})
      },
      include: {
        room: true,
        documents: true
      }
    });

    res.json({
      message: 'Data penghuni berhasil diperbarui',
      data: resident
    });
    return;

  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ 
      message: 'Gagal memperbarui data penghuni',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
    return;
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

export default app;