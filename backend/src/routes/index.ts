import express from 'express'
import authRoutes from './auth.routes'
import residentRoutes from './resident.routes'

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

export default router