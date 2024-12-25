import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { checkRequiredEnvVars } from './utils/checkEnv'

dotenv.config()

// Validate DATABASE_URL format
function validateDatabaseUrl(url: string): { isValid: boolean; error?: string } {
  try {
    if (!url) {
      return { isValid: false, error: 'DATABASE_URL is empty' };
    }

    // Support both postgresql:// and postgres:// protocols
    const pattern = /^(postgresql|postgres):\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+(\?.*)?$/;
    const isValid = pattern.test(url);

    if (!isValid) {
      // Parse URL to give more specific error
      const urlParts = url.split('://');
      if (urlParts.length !== 2) {
        return { isValid: false, error: 'URL must start with postgresql:// or postgres://' };
      }

      const [protocol, rest] = urlParts;
      if (!['postgresql', 'postgres'].includes(protocol)) {
        return { isValid: false, error: 'Invalid protocol. Must be postgresql:// or postgres://' };
      }

      const parts = rest.split('@');
      if (parts.length !== 2) {
        return { isValid: false, error: 'Invalid format. Missing @ separator' };
      }

      const [credentials, hostPort] = parts;
      if (!credentials.includes(':')) {
        return { isValid: false, error: 'Invalid credentials format. Must be user:password' };
      }

      const hostPortParts = hostPort.split(':');
      if (hostPortParts.length !== 2) {
        return { isValid: false, error: 'Invalid host:port format' };
      }

      const [host, portDb] = hostPortParts;
      if (!portDb.includes('/')) {
        return { isValid: false, error: 'Missing database name' };
      }

      const [port] = portDb.split('/');
      if (isNaN(Number(port))) {
        return { isValid: false, error: 'Invalid port number' };
      }
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Error parsing URL: ' + error.message };
  }
}

// Debug database connection
console.log('Database connection details:');
try {
  const dbUrl = process.env.DATABASE_URL || '';
  console.log('Raw DATABASE_URL:', dbUrl ? 'Present (hidden)' : 'Not set');
  
  const validation = validateDatabaseUrl(dbUrl);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid DATABASE_URL format');
  }
  
  console.log('Database URL validation:', 'Passed');
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