"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const client_1 = require("@prisma/client");
class DashboardController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [totalResidents, totalRooms, totalUsers] = yield Promise.all([
                    this.prisma.resident.count(),
                    this.prisma.room.count(),
                    this.prisma.user.count()
                ]);
                res.json({
                    totalResidents,
                    totalRooms,
                    totalUsers
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getResidentsByGender(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.prisma.resident.groupBy({
                    by: ['gender'],
                    _count: true
                });
                res.json(stats);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getRoomsOccupancy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield this.prisma.room.findMany({
                    include: {
                        _count: {
                            select: { residents: true }
                        }
                    }
                });
                const occupancy = rooms.map(room => ({
                    number: room.number,
                    capacity: room.capacity,
                    occupied: room._count.residents
                }));
                res.json(occupancy);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getRecentActivities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activities = yield this.prisma.resident.findMany({
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });
                res.json(activities);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.DashboardController = DashboardController;
