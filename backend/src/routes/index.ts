import express from 'express'
import authRoutes from './auth.routes'
import residentRoutes from './resident.routes'
import roomRoutes from './room.routes'
import paymentRoutes from './payment.routes'
import facilityRoutes from './facility.routes'

const router = express.Router()

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API routes working',
    timestamp: new Date().toISOString()
  })
})

// Mount routes
router.use('/auth', authRoutes)
router.use('/residents', residentRoutes)
router.use('/rooms', roomRoutes)
router.use('/payments', paymentRoutes)
router.use('/facilities', facilityRoutes)

export default router