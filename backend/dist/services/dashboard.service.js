"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DashboardService {
    async getStats() {
        const [totalResidents, totalRooms, maleResidents, femaleResidents] = await Promise.all([
            prisma.resident.count(),
            prisma.room.count(),
            prisma.resident.count({ where: { gender: 'MALE' } }),
            prisma.resident.count({ where: { gender: 'FEMALE' } })
        ]);
        return {
            totalResidents,
            totalRooms,
            maleResidents,
            femaleResidents
        };
    }
    async getResidentsByGender() {
        const residents = await prisma.resident.groupBy({
            by: ['gender'],
            _count: true
        });
        return residents.map(item => ({
            gender: item.gender,
            count: item._count
        }));
    }
    async getResidentsByEducation() {
        const residents = await prisma.resident.groupBy({
            by: ['education'],
            _count: true
        });
        return residents.map(item => ({
            education: item.education,
            count: item._count
        }));
    }
    async getRecentResidents(limit = 5) {
        return prisma.resident.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                education: true,
                gender: true,
                createdAt: true,
                room: {
                    select: {
                        number: true
                    }
                }
            }
        });
    }
    async getRoomOccupancy() {
        const rooms = await prisma.room.findMany({
            include: {
                _count: {
                    select: { residents: true }
                }
            }
        });
        return rooms.map(room => ({
            roomNumber: room.number,
            capacity: room.capacity,
            occupied: room._count.residents,
            available: room.capacity - room._count.residents
        }));
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map