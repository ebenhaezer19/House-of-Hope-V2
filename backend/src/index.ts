import app from './app'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { checkRequiredEnvVars } from './utils/checkEnv'

dotenv.config()

// Debug database connection
console.log('Database connection details:');
try {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  // Replace template literals if they exist
  const processedUrl = dbUrl
    .replace(/\${([^}]+)}/g, (_, key) => process.env[key] || '');

  // Log parsed URL components for debugging (hide sensitive info)
  const urlObj = new URL(processedUrl);
  console.log('Database connection components:', {
    protocol: urlObj.protocol,
    host: urlObj.hostname,
    port: urlObj.port,
    database: urlObj.pathname.slice(1),
    params: urlObj.search,
    auth: urlObj.username ? 'present (hidden)' : 'not present'
  });
  
  console.log('Database URL validation:', 'Passed');
} catch (error) {
  console.error('Error with DATABASE_URL:', error.message);
  console.error('Please make sure DATABASE_URL is properly set in Railway variables');
  process.exit(1);
}

const validatePort = () => {
  const port = process.env.PGPORT;
  if (!port) {
    throw new Error('PGPORT is not set');
  }
  const numPort = Number(port);
  if (isNaN(numPort)) {
    throw new Error(`Invalid port number: ${port}`);
  }
  return numPort;
};

try {
  const port = validatePort();
  console.log('Port validation passed:', port);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
} catch (error) {
  console.error('Port validation failed:', error.message);
  process.exit(1);
}

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
console.log('Port validation:', {
  PGPORT: process.env.PGPORT,
  isNumeric: !isNaN(Number(process.env.PGPORT)),
  portValue: Number(process.env.PGPORT)
});

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

console.log('Database URL format check:', {
  hasProtocol: process.env.DATABASE_URL?.startsWith('postgresql://'),
  hasHost: process.env.PGHOST ? 'Yes' : 'No',
  hasPort: process.env.PGPORT ? 'Yes' : 'No',
  hasDatabase: process.env.PGDATABASE ? 'Yes' : 'No'
});