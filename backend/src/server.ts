import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()
const PORT = parseInt(process.env.PORT || '5001', 10)

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Successfully connected to database')

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('=================================')
      console.log(`Server is running on port ${PORT}`)
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`)
      console.log(`API URL: http://localhost:${PORT}/api`)
      console.log('=================================')
    })

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully')
      await prisma.$disconnect()
      server.close(() => {
        console.log('Process terminated')
      })
    })

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  process.exit(1)
})

startServer() 