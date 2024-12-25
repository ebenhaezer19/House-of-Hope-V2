import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

// Essential middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

const corsOptions = {
  origin: [
    'https://frontend-house-of-hope.vercel.app',
    'https://frontend-n02jogx9n-house-of-hope.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}

// Apply CORS globally
app.use(cors(corsOptions))

// Handle preflight requests
app.options('*', cors(corsOptions))

// Logging middleware
app.use((req, res, next) => {
  console.log('\n=== Incoming Request ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('======================\n');
  next();
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