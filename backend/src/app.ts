import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import routes from './routes'
import { errorMiddleware } from './middleware/error.middleware'

const app = express()

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Essential middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log('\n=== Incoming Request ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('=====================\n');

  // Log response
  const oldSend = res.send;
  res.send = function(data) {
    console.log('\n=== Outgoing Response ===');
    console.log(`Status: ${res.statusCode}`);
    console.log('Data:', data);
    console.log('=====================\n');
    return oldSend.apply(res, arguments);
  };

  // Log completion
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`\n=== Request Completed ===`);
    console.log(`${req.method} ${req.url}`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Duration: ${duration}ms`);
    console.log('=====================\n');
  });

  next();
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve static files
app.use('/uploads', express.static(uploadsDir))

// Debug routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  
  // Get routes from app
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });

  res.json({
    message: 'Available routes',
    routes
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api', routes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.url}`);
  res.status(404).json({ 
    status: 'error',
    message: 'Not Found',
    path: req.url
  });
});

// Error handling middleware - must be last
app.use(errorMiddleware);

export default app; 