import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

// Essential middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

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