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
exports.RoomController = void 0;
const room_service_1 = require("../services/room.service");
const roomService = new room_service_1.RoomService();
class RoomController {
    getAllRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield roomService.findAll();
                res.json(rooms);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    createRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield roomService.create(req.body);
                res.status(201).json(room);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const room = yield roomService.findOne(id);
                res.json(room);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    updateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const room = yield roomService.update(id, req.body);
                res.json(room);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const room = yield roomService.delete(id);
                res.json(room);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.RoomController = RoomController;
