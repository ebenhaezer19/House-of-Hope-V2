import express from 'express'
import authRoutes from './auth.routes'
import residentRoutes from './resident.routes'
import roomRoutes from './room.routes'

const router = express.Router()

// Debug logging middleware
router.use((req, res, next) => {
  console.log('\n=== API Route ===');
  console.log(`${req.method} ${req.baseUrl}${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('================\n');
  next();
})

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// Mount routes
router.use('/auth', authRoutes)
router.use('/residents', residentRoutes)
router.use('/rooms', roomRoutes)

// Debug endpoint untuk melihat registered routes
router.get('/debug/routes', (req, res) => {
  const routes = router.stack
    .filter(r => r.route)
    .map(r => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods)
    }));
  res.json(routes);
})

export default router 