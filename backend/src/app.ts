import express from 'express'
import cors from 'cors'
import routes from './routes'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`)
  })
  next()
})

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parser
app.use(express.json())

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'House of Hope API' })
})

app.use('/api', routes)

// Serve static files
app.use('/uploads', express.static('uploads'))

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

export default app 