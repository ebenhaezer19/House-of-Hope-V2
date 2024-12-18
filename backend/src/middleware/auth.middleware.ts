import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided'
      })
    }

    const token = authHeader.split(' ')[1] // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        message: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      })
    }

    // Attach user to request object
    req.user = user
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      message: 'Invalid token'
    })
  }
} 