import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { checkRequiredEnvVars } from './utils/checkEnv'

dotenv.config()

// Debug database connection
console.log('Database connection details:');
try {
  const dbUrl = process.env.DATABASE_URL || '';
  console.log('Raw DATABASE_URL:', dbUrl ? 'Present' : 'Not set');
  
  // Simple check if URL is present
  if (!dbUrl) {
    throw new Error('DATABASE_URL is empty');
  }

  // Log parsed URL components for debugging
  const urlObj = new URL(dbUrl);
  console.log('Database connection components:', {
    protocol: urlObj.protocol,
    host: urlObj.hostname,
    port: urlObj.port,
    database: urlObj.pathname.slice(1),
    params: urlObj.search
  });
  
  console.log('Database URL validation:', 'Passed');
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