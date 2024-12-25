export const checkRequiredEnvVars = () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'FRONTEND_URL',
    'PORT'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
      console.error(`- ${envVar}`);
    });
    process.exit(1);
  }

  console.log('All required environment variables are set');
}; 