export function checkRequiredEnvVars() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }

  console.log('Environment variables loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: 'present (hidden)',
    JWT_SECRET: 'present (hidden)',
    PORT: process.env.PORT || 5002
  });
} 