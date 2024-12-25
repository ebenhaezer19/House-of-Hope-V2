import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()
const prisma = new PrismaClient()

const port = Number(process.env.PORT) || 5002

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully')
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`\n=== Server running on port ${port} ===\n`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error)
    process.exit(1)
  })

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
})