import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { loginLimiter } from '../middleware/rate-limit.middleware'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()
const authController = new AuthController()

// Basic auth routes
router.post('/register', loginLimiter, authController.register.bind(authController))
router.post('/login', loginLimiter, authController.login.bind(authController))
router.get('/me', authenticateToken, authController.getProfile.bind(authController))

// Password reset routes
router.post('/forgot-password', loginLimiter, authController.requestPasswordReset.bind(authController))
router.post('/reset-password', loginLimiter, authController.resetPassword.bind(authController))
router.post('/change-password', authenticateToken, authController.changePassword.bind(authController))

export default router 