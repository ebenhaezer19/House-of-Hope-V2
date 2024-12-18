import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, RoomType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Types for multer
interface FileRequest extends Request {
  files: {
    [key: string]: Express.Multer.File[];
  };
}

// Definisikan interface untuk data kamar
interface RoomData {
  number: string;
  type: RoomType;
  capacity: number;
  floor: number;
  description: string;
}

const app = express();
const prisma = new PrismaClient();
const PORT = 5002;

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

// Logging middleware
app.use((_req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${_req.method} ${_req.url}`);
  next();
});

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

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (_req, file: Express.Multer.File, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    }
  })
});

// Create resident
app.post('/api/residents', 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]) as express.RequestHandler,
  async (req: Request, res: Response) => {
    try {
      const files = (req as FileRequest).files;
      console.log('Files:', files);
      console.log('Body:', req.body);

      // Parse resident data
      const residentData = JSON.parse(req.body.data);
      console.log('Resident data:', residentData);

      const {
        name,
        nik,
        birthPlace,
        birthDate,
        gender,
        address,
        phone,
        education,
        schoolName,
        grade,
        major,
        assistance,
        details,
        roomId
      } = residentData;

      // Log required fields validation
      const requiredFields = {
        name,
        nik,
        birthPlace,
        birthDate,
        gender,
        address,
        education,
        schoolName,
        assistance,
        roomId
      };

      console.log('Checking required fields:', 
        Object.entries(requiredFields).map(([key, value]) => ({
          field: key,
          value: value,
          isValid: Boolean(value)
        }))
      );

      // Validate required fields
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        res.status(400).json({ 
          message: 'Semua field wajib harus diisi',
          missingFields 
        });
        return;
      }

      // Check if NIK already exists
      const existingResident = await prisma.resident.findUnique({
        where: { nik }
      });

      if (existingResident) {
        res.status(400).json({ message: 'NIK sudah terdaftar' });
        return;
      }

      // Create resident with files
      const resident = await prisma.resident.create({
        data: {
          name,
          nik,
          birthPlace,
          birthDate,
          gender,
          address,
          phone: phone || null,
          education,
          schoolName,
          grade: grade || null,
          major: major || null,
          assistance,
          details: details || null,
          room: {
            connect: { id: roomId }  // roomId should already be a number
          },
          // Add documents if any
          documents: {
            create: [
              // Add photo if exists
              ...(files?.photo ? [{
                name: files.photo[0].originalname,
                path: `/uploads/${files.photo[0].filename}`,
                type: 'photo'
              }] : []),
              // Add other documents if exist
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
        },
        include: {
          room: true,
          documents: true
        }
      });

      console.log('Resident created:', resident);
      res.status(201).json({
        message: 'Data penghuni berhasil ditambahkan',
        data: resident
      });

    } catch (error) {
      console.error('Error creating resident:', error);
      res.status(500).json({ 
        message: 'Gagal menambahkan data penghuni',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Rooms routes
app.get('/api/rooms', async (_req: Request, res: Response) => {
  try {
    console.log('Fetching rooms...');
    
    // Check if rooms exist
    const roomCount = await prisma.room.count();
    console.log('Total rooms in database:', roomCount);

    if (roomCount === 0) {
      console.log('No rooms found, running seed...');
      const rooms: RoomData[] = [
        {
          number: 'L1',
          type: RoomType.WARD,
          capacity: 20,
          floor: 1,
          description: 'Kamar Laki-laki 1'
        },
        {
          number: 'L2',
          type: RoomType.WARD,
          capacity: 20,
          floor: 1,
          description: 'Kamar Laki-laki 2'
        },
        {
          number: 'P1',
          type: RoomType.WARD,
          capacity: 20,
          floor: 2,
          description: 'Kamar Perempuan 1'
        },
        {
          number: 'P2',
          type: RoomType.WARD,
          capacity: 20,
          floor: 2,
          description: 'Kamar Perempuan 2'
        }
      ];

      for (const room of rooms) {
        await prisma.room.create({ data: room });
      }
    }

    const rooms = await prisma.room.findMany({
      include: {
        residents: true,
        _count: {
          select: { residents: true }
        }
      }
    });
    console.log('Found rooms:', JSON.stringify(rooms, null, 2));

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

    console.log('Rooms with occupancy:', JSON.stringify(roomsWithOccupancy, null, 2));
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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir, {
  // Set proper headers
  setHeaders: (res, path) => {
    // Enable CORS for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Set cache control
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    // Set content type for images
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// Start server
const server = app.listen(PORT, () => {
  console.log('=================================');
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('Available endpoints:');
  console.log('- Test: http://localhost:5002/test');
  console.log('- Health: http://localhost:5002/health');
  console.log('- Login: http://localhost:5002/api/auth/login');
  console.log('- Rooms: http://localhost:5002/api/rooms');
  console.log('- Residents: http://localhost:5002/api/residents');
  console.log('=================================');
});

// Handle shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});