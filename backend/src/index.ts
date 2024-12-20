import app from './app'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 5002

app.listen(port, () => {
  console.log(`\n=== Server running on port ${port} ===\n`)
  
  // Log all registered routes on startup
  console.log('Registered routes:')
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      console.log('Router:', middleware.regexp);
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          console.log(`${Object.keys(handler.route.methods)} ${handler.route.path}`);
        }
      });
    }
  });
  console.log('\n');
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
})