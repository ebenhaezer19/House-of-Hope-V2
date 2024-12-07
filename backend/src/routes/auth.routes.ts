import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { loginLimiter } from '../middleware/rate-limit.middleware'

const router = Router()
const authController = new AuthController()

router.post('/register', loginLimiter, authController.register)
router.post('/login', loginLimiter, authController.login)
router.get('/me', authMiddleware, authController.getProfile)

// Password reset routes
router.post('/forgot-password', loginLimiter, authController.requestPasswordReset)
router.post('/reset-password', loginLimiter, authController.resetPassword)
router.post('/change-password', authMiddleware, authController.changePassword)

export default router 