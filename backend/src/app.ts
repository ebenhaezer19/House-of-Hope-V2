import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

// Update CORS configuration dengan URL terbaru
const corsOptions = {
  origin: [
    'https://frontend-lx9pj4gjq-house-of-hope.vercel.app',  // URL terbaru
    'https://frontend-r2lx9cilc-house-of-hope.vercel.app',  // URL sebelumnya
    'https://frontend-house-of-hope.vercel.app',            
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
  ],
  exposedHeaders: ['Authorization']
};

// PENTING: Pasang cors sebelum middleware lainnya
app.use(cors(corsOptions));

// Konfigurasi helmet yang aman untuk CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tambahkan middleware OPTIONS global
app.options('*', cors(corsOptions));

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
