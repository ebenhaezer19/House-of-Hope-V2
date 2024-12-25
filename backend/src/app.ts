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
    'http://localhost:5173',
    'https://house-of-hope-v2-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

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