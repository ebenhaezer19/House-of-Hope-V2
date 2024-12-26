import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

// Konfigurasi CORS yang lebih permisif
app.use(cors({
  origin: [
    'https://frontend-pc0niwnjr-house-of-hope.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With'
  ]
}));

// Nonaktifkan beberapa fitur helmet
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
