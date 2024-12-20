"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = 5002;
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((_req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${_req.method} ${_req.url}`);
    next();
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: 'Email dan password harus diisi'
            });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({
                message: 'Email atau password salah'
            });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({
                message: 'Email atau password salah'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
app.get('/test', (_req, res) => {
    res.json({ message: 'Server is running' });
});
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
app.get('/api/residents', async (_req, res) => {
    try {
        const residents = await prisma.resident.findMany({
            include: {
                documents: true,
                room: true
            }
        });
        res.json(residents);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        }
    })
});
app.post('/api/residents', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]), async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const files = req.files;
        if (!Object.values(client_1.ResidentStatus).includes(data.status)) {
            return res.status(400).json({
                message: `Status tidak valid: ${data.status}`
            });
        }
        const requiredFields = [
            'name', 'nik', 'birthPlace', 'birthDate', 'gender',
            'address', 'education', 'schoolName', 'assistance',
            'roomId', 'status'
        ];
        if (data.status === client_1.ResidentStatus.ALUMNI) {
            requiredFields.push('exitDate', 'alumniNotes');
        }
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Semua field wajib harus diisi',
                missingFields
            });
        }
        const residentData = Object.assign(Object.assign({ name: data.name, nik: data.nik, birthPlace: data.birthPlace, birthDate: data.birthDate, gender: data.gender, address: data.address, phone: data.phone || null, education: data.education, schoolName: data.schoolName, grade: data.grade || null, major: data.major || null, assistance: data.assistance, details: data.details || null, status: data.status, createdAt: new Date() }, (data.status === client_1.ResidentStatus.ALUMNI ? {
            exitDate: new Date(data.exitDate),
            alumniNotes: data.alumniNotes
        } : {
            exitDate: null,
            alumniNotes: null
        })), { room: {
                connect: { id: parseInt(data.roomId) }
            }, documents: {
                create: [
                    ...((files === null || files === void 0 ? void 0 : files.photo) ? [{
                            name: files.photo[0].originalname,
                            path: `/uploads/${files.photo[0].filename}`,
                            type: 'photo'
                        }] : []),
                    ...((files === null || files === void 0 ? void 0 : files.documents) ?
                        files.documents.map(file => ({
                            name: file.originalname,
                            path: `/uploads/${file.filename}`,
                            type: 'document'
                        }))
                        : [])
                ]
            } });
        const resident = await prisma.resident.create({
            data: residentData,
            include: {
                room: true,
                documents: true
            }
        });
        return res.status(201).json({
            message: 'Data penghuni berhasil ditambahkan',
            data: {
                id: resident.id,
                name: resident.name,
                status: resident.status,
                exitDate: resident.exitDate
            }
        });
    }
    catch (error) {
        console.error('Error creating resident:', error);
        return res.status(400).json({
            message: 'Gagal membuat data penghuni',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
app.get('/api/rooms', async (_req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({
            message: 'Gagal mengambil data kamar',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
app.get('/api/rooms/:id', async (req, res) => {
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
        const roomWithOccupancy = Object.assign(Object.assign({}, room), { occupancy: room._count.residents, availableSpace: room.capacity - room._count.residents });
        res.json(roomWithOccupancy);
    }
    catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({
            message: 'Gagal mengambil data kamar',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsDir, {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        }
        else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        }
    }
}));
app.get('/api/residents/:id', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching resident:', error);
        res.status(500).json({
            message: 'Gagal mengambil data penghuni',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
app.put('/api/residents/:id', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const files = req.files;
        const residentData = JSON.parse(req.body.data);
        const existingResident = await prisma.resident.findUnique({
            where: { id },
            include: { documents: true }
        });
        if (!existingResident) {
            res.status(404).json({ message: 'Penghuni tidak ditemukan' });
            return;
        }
        const documents = [];
        if (files === null || files === void 0 ? void 0 : files.photo) {
            const photo = files.photo[0];
            documents.push({
                name: photo.originalname,
                path: `/uploads/${photo.filename}`,
                type: 'photo'
            });
        }
        if (files === null || files === void 0 ? void 0 : files.documents) {
            files.documents.forEach(file => {
                documents.push({
                    name: file.originalname,
                    path: `/uploads/${file.filename}`,
                    type: 'document'
                });
            });
        }
        const updatedResident = await prisma.resident.update({
            where: { id },
            data: {
                name: residentData.name,
                nik: residentData.nik,
                birthPlace: residentData.birthPlace,
                birthDate: residentData.birthDate,
                gender: residentData.gender,
                address: residentData.address,
                phone: residentData.phone || null,
                education: residentData.education,
                schoolName: residentData.schoolName,
                grade: residentData.grade || null,
                major: residentData.major || null,
                assistance: residentData.assistance,
                details: residentData.details || null,
                status: residentData.status,
                createdAt: residentData.createdAt,
                exitDate: residentData.exitDate ? new Date(residentData.exitDate) : null,
                alumniNotes: residentData.alumniNotes || null,
                room: {
                    connect: { id: parseInt(residentData.roomId) }
                },
                documents: documents.length > 0 ? {
                    create: documents
                } : undefined
            },
            include: {
                room: true,
                documents: true
            }
        });
        res.json({
            message: 'Data penghuni berhasil diperbarui',
            data: updatedResident
        });
    }
    catch (error) {
        console.error('Error updating resident:', error);
        res.status(500).json({
            message: 'Gagal memperbarui data penghuni',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
const authMiddleware = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token tidak ditemukan' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token tidak valid' });
    }
};
app.get('/api/auth/me', authMiddleware, async (req, res) => {
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
    }
    catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({
            message: 'Gagal memeriksa status autentikasi',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
app.delete('/api/residents/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.document.deleteMany({
            where: { residentId: id }
        });
        const deleted = await prisma.resident.delete({
            where: { id }
        });
        res.json({
            message: 'Data penghuni berhasil dihapus',
            data: deleted
        });
    }
    catch (error) {
        console.error('Error deleting resident:', error);
        res.status(500).json({
            message: 'Gagal menghapus data penghuni',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
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
process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    await prisma.$disconnect();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map