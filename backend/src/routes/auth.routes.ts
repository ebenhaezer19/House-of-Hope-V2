import type { Router as ExpressRouter } from 'express';
import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import cors from 'cors';

const router: ExpressRouter = express.Router();

const corsOptions = {
  origin: [
    'https://frontend-house-of-hope.vercel.app',
    'https://frontend-n02jogx9n-house-of-hope.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Handle preflight untuk route spesifik
router.options('/login', cors(corsOptions));
router.options('/me', cors(corsOptions));
router.options('/logout', cors(corsOptions));

// Public routes
router.post('/login', cors(corsOptions), AuthController.login);

// Protected routes
router.get('/me', cors(corsOptions), authMiddleware, AuthController.me);
router.post('/logout', cors(corsOptions), authMiddleware, AuthController.logout);

export default router; 