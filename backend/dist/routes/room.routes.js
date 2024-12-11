"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = require("../controllers/room.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const roomController = new room_controller_1.RoomController();
// Protect all routes with middleware
router.all('*', auth_middleware_1.authMiddleware);
// GET /api/rooms
router.get('/', roomController.getAllRooms.bind(roomController));
// GET /api/rooms/:id
router.get('/:id', roomController.getRoom.bind(roomController));
// POST /api/rooms
router.post('/', roomController.createRoom.bind(roomController));
// PUT /api/rooms/:id
router.put('/:id', roomController.updateRoom.bind(roomController));
// DELETE /api/rooms/:id
router.delete('/:id', roomController.deleteRoom.bind(roomController));
exports.default = router;
