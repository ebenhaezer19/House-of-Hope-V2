import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

// Konfigurasi CORS yang lebih permisif
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Nonaktifkan helmet sementara untuk debugging
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log semua requests untuk debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: {
      origin: req.headers.origin,
      method: req.method
    }
  });
});

// Tambah error handler
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
