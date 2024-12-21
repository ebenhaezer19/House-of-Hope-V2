import express from 'express';
import { FacilityController } from '../controllers/facility.controller';

const router = express.Router();
const facilityController = new FacilityController();

// Debug logging
router.use((req, res, next) => {
  console.log('\n=== Facility Route ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('===================\n');
  next();
});

// CRUD routes
router.get('/', facilityController.getAllFacilities);
router.post('/', facilityController.createFacility);
router.post('/:id/bookings', facilityController.createBooking);
router.post('/:id/maintenance', facilityController.createMaintenanceLog);

export default router; 