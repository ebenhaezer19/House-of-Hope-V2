import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { checkRequiredEnvVars } from './utils/checkEnv'

dotenv.config()

const port = process.env.PORT || 5002

// Add debug logging
console.log('\nDatabase connection details:')
const dbUrl = process.env.DATABASE_URL || ''
const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@')
console.log('Database URL:', maskedUrl)

try {
  const url = new URL(process.env.DATABASE_URL || '')
  console.log('Database components:', {
    protocol: url.protocol,
    host: url.hostname,
    port: url.port,
    database: url.pathname.slice(1),
    params: url.search,
    auth: 'present (hidden)'
  })
} catch (error) {
  console.error('Invalid database URL format:', error)
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Debug environment variables
console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'Set (hidden)' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Check environment variables before doing anything else
checkRequiredEnvVars();

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
    console.error('Connection details:', {
      error: error.message,
      code: error.code,
      meta: error.meta
    })
    process.exit(1)
  })

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
})