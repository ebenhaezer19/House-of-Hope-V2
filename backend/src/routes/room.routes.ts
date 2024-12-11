import { Router } from 'express'
import { RoomController } from '../controllers/room.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const roomController = new RoomController()

// Protect all routes with middleware
router.all('*', authMiddleware)

// GET /api/rooms
router.get('/', roomController.getAllRooms.bind(roomController))

// GET /api/rooms/:id
router.get('/:id', roomController.getRoom.bind(roomController))

// POST /api/rooms
router.post('/', roomController.createRoom.bind(roomController))

// PUT /api/rooms/:id
router.put('/:id', roomController.updateRoom.bind(roomController))

// DELETE /api/rooms/:id
router.delete('/:id', roomController.deleteRoom.bind(roomController))

export default router 