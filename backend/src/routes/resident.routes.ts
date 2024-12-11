import { Router } from 'express'
import { ResidentController } from '../controllers/resident.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const residentController = new ResidentController()

// Protect all routes with middleware
router.all('*', authMiddleware)

// GET /api/residents
router.get('/', residentController.getAllResidents.bind(residentController))

// GET /api/residents/:id
router.get('/:id', residentController.getResident.bind(residentController))

// POST /api/residents
router.post('/', residentController.createResident.bind(residentController))

// PUT /api/residents/:id
router.put('/:id', residentController.updateResident.bind(residentController))

// DELETE /api/residents/:id
router.delete('/:id', residentController.deleteResident.bind(residentController))

export default router 