import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/jwt.config'
import { Role } from '@prisma/client'

// Definisikan tipe untuk decoded JWT
interface JwtPayload {
  userId: number
  email: string
  role: Role
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.secret) as JwtPayload

    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ message: 'Unauthorized - Invalid token' })
  }
} 