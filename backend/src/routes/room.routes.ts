import { Router } from 'express'
import { RoomController } from '../controllers/room.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { createRoomSchema, updateRoomSchema } from '../schemas/room.schema'

const router = Router()
const roomController = new RoomController()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Get all rooms
router.get('/', roomController.getAll)

// Get one room
router.get('/:id', roomController.getOne)

// Create room
router.post('/',
  validate(createRoomSchema),
  roomController.create
)

// Update room
router.put('/:id',
  validate(updateRoomSchema),
  roomController.update
)

// Delete room
router.delete('/:id', roomController.delete)

// Check room availability
router.get('/:id/availability', roomController.checkAvailability)

export default router 