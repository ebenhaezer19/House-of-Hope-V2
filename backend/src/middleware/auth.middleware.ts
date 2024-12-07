import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/jwt.config'
import { User } from '@prisma/client'

interface JwtPayloadWithUser extends jwt.JwtPayload {
  id: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, config.secret) as JwtPayloadWithUser
    req.user = { id: decoded.id } as User

    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
} 