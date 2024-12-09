import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import residentRoutes from './routes/resident.routes'
import roomRoutes from './routes/room.routes'
import { errorMiddleware } from './middleware/error.middleware'
import { apiLimiter } from './middleware/rate-limit.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
if (process.env.NODE_ENV === 'development') {
  // Dalam development, izinkan semua origin
  app.use(cors({
    origin: true,
    credentials: true
  }))
} else {
  // Dalam production, batasi origin
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }))
}
app.use(express.json())

// Rate limiting untuk semua routes
app.use('/api/', apiLimiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/residents', residentRoutes)
app.use('/api/rooms', roomRoutes)

// Error handling
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 