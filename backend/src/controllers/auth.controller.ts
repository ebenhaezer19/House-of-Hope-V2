import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { PrismaClient } from '@prisma/client'
import { EmailService } from '../services/email.service'
import crypto from 'crypto'

export class AuthController {
  private prisma: PrismaClient
  private authService: AuthService

  constructor() {
    this.prisma = new PrismaClient()
    this.authService = new AuthService()
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body
      const user = await this.authService.register(email, password, name)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await this.authService.login(email, password)
      res.json(result)
    } catch (error: any) {
      res.status(401).json({ message: error.message })
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const user = await this.prisma.user.findUnique({
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
      const user = await this.prisma.user.findUnique({ 
        where: { email },
        select: {
          id: true,
          email: true,
          name: true
        }
      })
      
      if (!user) {
        return res.status(404).json({ 
          message: 'Jika email terdaftar, link reset password akan dikirim' 
        })
      }

      const token = crypto.randomBytes(32).toString('hex')
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 3600000) // 1 jam
        }
      })

      const emailService = new EmailService()
      await emailService.sendResetPasswordEmail(
        user.email,
        user.name,
        token
      )

      res.json({ 
        message: 'Jika email terdaftar, link reset password akan dikirim' 
      })
    } catch (error) {
      console.error('Reset password request error:', error)
      res.status(500).json({ 
        message: 'Terjadi kesalahan saat memproses permintaan' 
      })
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body
      const result = await this.authService.resetPassword(token, newPassword)
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
      const result = await this.authService.changePassword(userId, oldPassword, newPassword)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
} 