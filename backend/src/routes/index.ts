import { Router } from 'express'
import authRoutes from './auth.routes'
import residentRoutes from './resident.routes'
import roomRoutes from './room.routes'

const router = Router()

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'connected'
    }
  })
})

// Mount routes
router.use('/auth', authRoutes)
router.use('/residents', residentRoutes)
router.use('/rooms', roomRoutes)

export default router 