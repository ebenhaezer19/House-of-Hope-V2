import express from 'express'
import { ResidentController } from '../controllers/resident.controller'
import { upload } from '../middleware/upload.middleware'

const router = express.Router()
const residentController = new ResidentController()

// Debug logging
router.use((req, res, next) => {
  console.log('\n=== Resident Route Handler ===');
  console.log(`${req.method} ${req.path}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('==========================\n');
  next();
});

// GET /api/residents
router.get('/', residentController.getAllResidents);

// GET /api/residents/:id
router.get('/:id', residentController.getResident);

// POST /api/residents
router.post('/', 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  residentController.createResident
)

// PUT /api/residents/:id
router.put('/:id',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  residentController.updateResident
)

// DELETE /api/residents/:id
router.delete('/:id', residentController.deleteResident)

export default router 