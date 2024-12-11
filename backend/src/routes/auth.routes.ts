import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const authController = new AuthController()

// Public routes
router.post('/register', (req, res) => authController.register(req, res))
router.post('/login', (req, res) => authController.login(req, res))
router.post('/forgot-password', (req, res) => authController.requestPasswordReset(req, res))
router.post('/reset-password', (req, res) => authController.resetPassword(req, res))

// Protected routes
router.use(authMiddleware)
router.get('/verify', (req, res) => authController.verifyToken(req, res))
router.get('/profile', (req, res) => authController.getProfile(req, res))
router.put('/profile', (req, res) => authController.updateProfile(req, res))
router.post('/change-password', (req, res) => authController.changePassword(req, res))

export default router 