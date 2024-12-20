"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const client_1 = require("@prisma/client");
class RoomService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findAll() {
        return this.prisma.room.findMany({
            include: {
                residents: true
            }
        });
    }
    async findOne(id) {
        return this.prisma.room.findUnique({
            where: { id },
            include: {
                residents: true
            }
        });
    }
    async create(data) {
        return this.prisma.room.create({
            data,
            include: {
                residents: true
            }
        });
    }
    async update(id, data) {
        return this.prisma.room.update({
            where: { id },
            data,
            include: {
                residents: true
            }
        });
    }
    async delete(id) {
        return this.prisma.room.delete({
            where: { id }
        });
    }
}
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map