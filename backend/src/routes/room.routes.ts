import { Router } from 'express'
import { RoomController } from '../controllers/room.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()
const roomController = new RoomController()

// Protect all routes
router.use(authenticateToken)

// Routes
router.get('/', roomController.getAllRooms.bind(roomController))
router.post('/', roomController.createRoom.bind(roomController))
router.get('/:id', roomController.getRoom.bind(roomController))
router.put('/:id', roomController.updateRoom.bind(roomController))
router.delete('/:id', roomController.deleteRoom.bind(roomController))

export default router 