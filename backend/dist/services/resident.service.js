"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ResidentService {
    async findAll() {
        try {
            const residents = await prisma.resident.findMany({
                include: {
                    documents: true,
                    room: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return residents;
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        const resident = await prisma.resident.findUnique({
            where: { id },
            include: {
                documents: true,
                room: true
            }
        });
        if (!resident) {
            throw new Error('Resident not found');
        }
        return resident;
    }
    async create(data) {
        try {
            return await prisma.resident.create({
                data,
                include: {
                    documents: true,
                    room: true
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, data) {
        return await prisma.resident.update({
            where: { id },
            data,
            include: {
                room: true,
                documents: true
            }
        });
    }
    async delete(id) {
        try {
            await prisma.document.deleteMany({
                where: { residentId: id }
            });
            return await prisma.resident.delete({
                where: { id }
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ResidentService = ResidentService;
//# sourceMappingURL=resident.service.js.map