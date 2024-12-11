import { Router } from 'express'
import { DashboardController } from '../controllers/dashboard.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const dashboardController = new DashboardController()

router.use(authMiddleware)

router.get('/stats', dashboardController.getStats)
router.get('/residents/gender', dashboardController.getResidentsByGender)
router.get('/rooms/occupancy', dashboardController.getRoomsOccupancy)
router.get('/recent-activities', dashboardController.getRecentActivities)

export default router 