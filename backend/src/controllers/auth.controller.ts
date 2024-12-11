import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { PrismaClient } from '@prisma/client'

const authService = new AuthService()
const prisma = new PrismaClient()

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body
      const user = await authService.register(email, password, name)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.json(result)
    } catch (error: any) {
      res.status(401).json({ message: error.message })
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.json(user)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body
      const result = await authService.requestPasswordReset(email)
      
      // Log untuk debugging
      console.log('Reset password request:', {
        email,
        result
      })
      
      res.json(result)
    } catch (error: any) {
      console.error('Reset password error:', error)
      res.status(400).json({ message: error.message })
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body
      const result = await authService.resetPassword(token, newPassword)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { oldPassword, newPassword } = req.body
      const result = await authService.changePassword(userId, oldPassword, newPassword)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
} 