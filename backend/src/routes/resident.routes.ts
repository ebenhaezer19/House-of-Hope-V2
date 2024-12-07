import { Router } from 'express'
import { ResidentController } from '../controllers/resident.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { uploadMiddleware } from '../middleware/upload.middleware'
import { createResidentSchema, updateResidentSchema } from '../schemas/resident.schema'

const router = Router()
const residentController = new ResidentController()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Get all residents
router.get('/', residentController.getAll)

// Get one resident
router.get('/:id', residentController.getOne)

// Create resident with documents
router.post('/', 
  uploadMiddleware.array('documents', 5),
  validate(createResidentSchema), 
  residentController.create
)

// Update resident
router.put('/:id', 
  uploadMiddleware.array('documents', 5),
  validate(updateResidentSchema), 
  residentController.update
)

// Delete resident
router.delete('/:id', residentController.delete)

// Upload additional documents
router.post('/:id/documents',
  uploadMiddleware.array('documents', 5),
  residentController.uploadDocuments
)

export default router 