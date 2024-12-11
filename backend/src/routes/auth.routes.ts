import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const authController = new AuthController()

// Public routes
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/forgot-password', authController.requestPasswordReset)
router.post('/reset-password', authController.resetPassword)

// Protected routes
router.use(authMiddleware)
router.get('/me', authController.getProfile)
router.put('/profile', authController.updateProfile)
router.post('/change-password', authController.changePassword)

export default router 