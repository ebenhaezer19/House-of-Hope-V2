"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ResidentService {
    async create(data) {
        return prisma.resident.create({
            data,
            include: {
                room: true,
                documents: true
            }
        });
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, search = '' } = query, filters = __rest(query, ["page", "limit", "search"]);
        const skip = (page - 1) * limit;
        const where = Object.assign({ OR: search ? [
                { name: { contains: search, mode: 'insensitive' } },
                { nik: { contains: search, mode: 'insensitive' } }
            ] : undefined }, filters);
        const [residents, total] = await Promise.all([
            prisma.resident.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    room: true,
                    documents: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.resident.count({ where })
        ]);
        return {
            data: residents,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    async findOne(id) {
        const resident = await prisma.resident.findUnique({
            where: { id },
            include: {
                room: true,
                documents: true
            }
        });
        if (!resident) {
            throw new Error('Resident not found');
        }
        return resident;
    }
    async update(id, data) {
        const resident = await prisma.resident.findUnique({ where: { id } });
        if (!resident) {
            throw new Error('Resident not found');
        }
        return prisma.resident.update({
            where: { id },
            data,
            include: {
                room: true,
                documents: true
            }
        });
    }
    async delete(id) {
        const resident = await prisma.resident.findUnique({ where: { id } });
        if (!resident) {
            throw new Error('Resident not found');
        }
        return prisma.resident.delete({
            where: { id },
            include: {
                room: true,
                documents: true
            }
        });
    }
}
exports.ResidentService = ResidentService;
//# sourceMappingURL=resident.service.js.map