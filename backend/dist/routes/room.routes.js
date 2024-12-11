"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = require("../controllers/room.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const roomController = new room_controller_1.RoomController();
router.all('*', auth_middleware_1.authMiddleware);
router.get('/', roomController.getAllRooms.bind(roomController));
router.get('/:id', roomController.getRoom.bind(roomController));
router.post('/', roomController.createRoom.bind(roomController));
router.put('/:id', roomController.updateRoom.bind(roomController));
router.delete('/:id', roomController.deleteRoom.bind(roomController));
exports.default = router;
//# sourceMappingURL=room.routes.js.map