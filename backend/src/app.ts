import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

// Essential middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
  origin: [
    'https://frontend-house-of-hope.vercel.app',
    'https://frontend-n02jogx9n-house-of-hope.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 jam dalam detik
}

// Aktifkan CORS untuk semua routes
app.use(cors(corsOptions))

// Tambahkan OPTIONS handler untuk preflight requests
app.options('*', cors(corsOptions))

// Tambahkan setelah middleware CORS
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

// Debug route to show all registered routes
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