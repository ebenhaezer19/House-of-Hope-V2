import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { checkRequiredEnvVars } from './utils/checkEnv'

dotenv.config()

// Debug database connection
console.log('Database connection details:');
const dbUrl = new URL(process.env.DATABASE_URL || '');
console.log({
  host: dbUrl.hostname,
  port: dbUrl.port,
  database: dbUrl.pathname.replace('/', ''),
  ssl: process.env.NODE_ENV === 'production',
  user: 'hidden'
});

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

const port = Number(process.env.PORT) || 5002

// Debug environment variables
console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

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
      host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'not found',
      database: 'railway',
      ssl: process.env.NODE_ENV === 'production'
    })
    process.exit(1)
  })

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
})