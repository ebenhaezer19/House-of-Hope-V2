import { Router } from 'express'
import { dashboardController } from '../controllers/dashboard.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()

router.get('/stats', authenticateToken, dashboardController.getStats)
router.get('/gender', authenticateToken, dashboardController.getGenderDistribution)
router.get('/education', authenticateToken, dashboardController.getEducationDistribution)
router.get('/recent-residents', authenticateToken, dashboardController.getRecentResidents)
router.get('/room-occupancy', authenticateToken, dashboardController.getRoomOccupancy)

export default router