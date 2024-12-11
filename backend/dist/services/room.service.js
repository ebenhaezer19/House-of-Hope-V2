"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RoomService {
    async create(data) {
        return prisma.room.create({
            data,
            include: {
                residents: true
            }
        });
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, search = '', type } = query;
        const skip = (page - 1) * limit;
        const where = {
            AND: [
                search ? {
                    number: { contains: search, mode: 'insensitive' }
                } : {},
                type ? { type } : {}
            ]
        };
        const [rooms, total] = await Promise.all([
            prisma.room.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    residents: true
                },
                orderBy: {
                    number: 'asc'
                }
            }),
            prisma.room.count({ where })
        ]);
        const roomsWithOccupancy = rooms.map(room => (Object.assign(Object.assign({}, room), { occupancy: room.residents.length, isAvailable: room.residents.length < room.capacity })));
        return {
            data: roomsWithOccupancy,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    async findOne(id) {
        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                residents: true
            }
        });
        if (!room) {
            throw new Error('Kamar tidak ditemukan');
        }
        return Object.assign(Object.assign({}, room), { occupancy: room.residents.length, isAvailable: room.residents.length < room.capacity });
    }
    async update(id, data) {
        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                residents: true
            }
        });
        if (!room) {
            throw new Error('Kamar tidak ditemukan');
        }
        if (data.capacity && data.capacity < room.residents.length) {
            throw new Error('Kapasitas baru tidak boleh lebih kecil dari jumlah penghuni saat ini');
        }
        return prisma.room.update({
            where: { id },
            data,
            include: {
                residents: true
            }
        });
    }
    async delete(id) {
        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                residents: true
            }
        });
        if (!room) {
            throw new Error('Kamar tidak ditemukan');
        }
        if (room.residents.length > 0) {
            throw new Error('Tidak dapat menghapus kamar yang masih memiliki penghuni');
        }
        return prisma.room.delete({
            where: { id },
            include: {
                residents: true
            }
        });
    }
    async checkAvailability(id) {
        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                residents: true
            }
        });
        if (!room) {
            throw new Error('Kamar tidak ditemukan');
        }
        return {
            room,
            occupancy: room.residents.length,
            isAvailable: room.residents.length < room.capacity,
            remainingCapacity: room.capacity - room.residents.length
        };
    }
}
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map