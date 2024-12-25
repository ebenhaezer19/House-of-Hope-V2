import app from './app'
import dotenv from 'dotenv'

dotenv.config()

const port = Number(process.env.PORT) || 5002

app.listen(port, '0.0.0.0', () => {
  console.log(`\n=== Server running on port ${port} ===\n`)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
})