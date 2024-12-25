import express from 'express'
import cors from 'cors'
import routes from './routes'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

// Essential middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'https://frontend-house-of-hope.vercel.app',
      'https://frontend-n02jogx9n-house-of-hope.vercel.app',
      'http://localhost:5173'
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight
app.options('*', cors(corsOptions));

// Add CORS headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Improved health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error : 'Database connection failed'
    });
  }
});

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

// API Routes with prefix
app.use('/api', routes)

// Debug route
app.get('/debug/routes', (req, res) => {
  const registeredRoutes = app._router.stack
    .filter((r: any) => r.route || r.name === 'router')
    .map((r: any) => {
      if (r.route) {
        return {
          path: r.route.path,
          methods: Object.keys(r.route.methods)
        }
      }
      return {
        name: r.name,
        regexp: r.regexp.toString()
      }
    })
  res.json(registeredRoutes)
})

export default app
