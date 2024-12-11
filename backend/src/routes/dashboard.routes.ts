import { Router } from 'express'
import { DashboardController } from '../controllers/dashboard.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()
const dashboardController = new DashboardController()

// Protect all dashboard routes
router.use(authenticateToken)

// Dashboard routes
router.get('/stats', dashboardController.getDashboardStats.bind(dashboardController))
router.get('/residents-by-gender', dashboardController.getResidentsByGender.bind(dashboardController))
router.get('/residents-by-education', dashboardController.getResidentsByEducation.bind(dashboardController))
router.get('/recent-residents', dashboardController.getRecentResidents.bind(dashboardController))
router.get('/room-occupancy', dashboardController.getRoomOccupancy.bind(dashboardController))

export default router 