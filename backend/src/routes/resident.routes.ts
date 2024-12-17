import { Router } from 'express'
import { ResidentController } from '../controllers/resident.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()
const residentController = new ResidentController()

// Protect all routes with middleware
router.all('*', authMiddleware)

// GET /api/residents
router.get('/', residentController.getAllResidents.bind(residentController))

// GET /api/residents/:id
router.get('/:id', residentController.getResident.bind(residentController))

// POST /api/residents
router.post('/', 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  residentController.createResident.bind(residentController)
)

// PUT /api/residents/:id
router.put('/:id',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]),
  residentController.updateResident.bind(residentController)
)

// DELETE /api/residents/:id
router.delete('/:id', residentController.deleteResident.bind(residentController))

export default router 