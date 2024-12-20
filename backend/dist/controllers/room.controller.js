"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RoomController {
    async getAllRooms(_req, res) {
        try {
            const rooms = await prisma.room.findMany({
                include: {
                    residents: true
                }
            });
            return res.json(rooms);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error getting rooms' });
        }
    }
}
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map