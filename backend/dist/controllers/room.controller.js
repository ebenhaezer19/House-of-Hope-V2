"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const room_service_1 = require("../services/room.service");
const roomService = new room_service_1.RoomService();
class RoomController {
    async getAllRooms(req, res) {
        try {
            const rooms = await roomService.findAll();
            res.json(rooms);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async createRoom(req, res) {
        try {
            const room = await roomService.create(req.body);
            res.status(201).json(room);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getRoom(req, res) {
        try {
            const id = Number(req.params.id);
            const room = await roomService.findOne(id);
            res.json(room);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async updateRoom(req, res) {
        try {
            const id = Number(req.params.id);
            const room = await roomService.update(id, req.body);
            res.json(room);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteRoom(req, res) {
        try {
            const id = Number(req.params.id);
            const room = await roomService.delete(id);
            res.json(room);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map