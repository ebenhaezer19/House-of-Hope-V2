import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { checkRequiredEnvVars } from './utils/checkEnv'

dotenv.config()

// Validate DATABASE_URL format
function validateDatabaseUrl(url: string): boolean {
  try {
    const pattern = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+(\?.*)?$/;
    return pattern.test(url);
  } catch (error) {
    return false;
  }
}

// Debug database connection
console.log('Database connection details:');
try {
  const dbUrl = process.env.DATABASE_URL || '';
  if (!validateDatabaseUrl(dbUrl)) {
    throw new Error('Invalid DATABASE_URL format. Expected format: postgresql://user:password@host:port/database');
  }
  console.log('Database URL format:', dbUrl.replace(/:[^:@]+@/, ':****@'));
} catch (error) {
  console.error('Error with DATABASE_URL:', error.message);
  process.exit(1);
}

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
      error: error.message,
      code: error.code,
      meta: error.meta
    })
    process.exit(1)
  })

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
})