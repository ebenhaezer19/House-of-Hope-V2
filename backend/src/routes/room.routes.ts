import { Router } from 'express'
import { RoomController } from '../controllers/room.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const roomController = new RoomController()

router.use(authMiddleware)

router.get('/', roomController.getAllRooms)

export default router 