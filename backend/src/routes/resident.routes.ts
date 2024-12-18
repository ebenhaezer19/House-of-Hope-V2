import express from 'express'
import { ResidentController } from '../controllers/resident.controller'
import { upload } from '../middleware/upload.middleware'

const router = express.Router()
const residentController = new ResidentController()

// Debug logging
router.use((req, res, next) => {
  console.log('=== Resident Route ===');
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('===================');
  next();
});

// GET /api/residents
router.get('/', async (req, res) => {
  console.log('[Resident Route] GET / called');
  try {
    console.log('Calling residentController.getAllResidents');
    await residentController.getAllResidents(req, res);
    console.log('getAllResidents completed');
  } catch (error) {
    console.error('[Resident Route] Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      message: 'Error in resident route handler',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

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
    { name: 'documents', maxCount: 5 }
  ]),
  residentController.updateResident.bind(residentController)
)

// DELETE /api/residents/:id
router.delete('/:id', residentController.deleteResident.bind(residentController))

export default router 