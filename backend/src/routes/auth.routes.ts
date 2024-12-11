import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { loginLimiter } from '../middleware/rate-limit.middleware'
import { authenticateToken } from '../middleware/auth.middleware'
import { EmailService } from '../services/email.service'
import rateLimit from 'express-rate-limit'

const router = Router()
const authController = new AuthController()

// Buat rate limiter untuk login
const loginLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 detik
  max: 3, // maksimal 3 percobaan dalam 10 detik
  message: {
    message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 10 detik'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Buat rate limiter untuk change password
const changePasswordLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 detik
  max: 3, // maksimal 3 percobaan dalam 10 detik
  message: {
    message: 'Terlalu banyak percobaan ganti password. Silakan coba lagi setelah 10 detik'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Basic auth routes
router.post('/register', authController.register.bind(authController))
router.post('/login', loginLimiter, authController.login.bind(authController))
router.get('/me', authenticateToken, authController.getProfile.bind(authController))

// Password reset routes
router.post('/forgot-password', authController.requestPasswordReset.bind(authController))
router.post('/reset-password', authController.resetPassword.bind(authController))
router.post('/change-password', 
  authenticateToken, 
  changePasswordLimiter, 
  authController.changePassword.bind(authController)
)

// Test email route (hanya untuk development)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-email', async (req, res) => {
    try {
      const emailService = new EmailService()
      await emailService.sendResetPasswordEmail(
        req.body.email,
        'test-token-123'
      )
      res.json({ message: 'Email sent successfully' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  })
}

export default router 