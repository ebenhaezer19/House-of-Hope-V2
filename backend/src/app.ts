import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

// Konfigurasi CORS yang lebih permisif
app.use(cors({
  origin: true, // Mengizinkan semua origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With'
  ],
  exposedHeaders: ['Authorization']
}));

// Nonaktifkan beberapa fitur helmet yang bisa mengganggu CORS
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pre-flight request handler
app.options('*', cors());

// Health check endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? 'Configured' : 'Not Configured'
  });
});

export default app;
