import { Router } from 'express'
import { ResidentController } from '../controllers/resident.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()
const residentController = new ResidentController()

// Protect all routes
router.use(authenticateToken)

// Routes
router.get('/', residentController.getAllResidents.bind(residentController))
router.post('/', residentController.createResident.bind(residentController))
router.get('/:id', residentController.getResident.bind(residentController))
router.put('/:id', residentController.updateResident.bind(residentController))
router.delete('/:id', residentController.deleteResident.bind(residentController))

export default router 