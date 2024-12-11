import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { PrismaClient } from '@prisma/client'

export class AuthController {
  private authService: AuthService
  private prisma: PrismaClient

  constructor() {
    this.authService = new AuthService()
    this.prisma = new PrismaClient()
  }

  // Public endpoints
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const result = await this.authService.login(email, password)
      res.json(result)
    } catch (error: any) {
      res.status(401).json({ message: error.message })
    }
  }

  // Protected endpoints
  getProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const user = await this.authService.getProfile(req.user.userId)
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body
      const user = await this.authService.register(email, password, name)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  updateProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const user = await this.authService.updateProfile(req.user.userId, req.body)
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  changePassword = async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { oldPassword, newPassword } = req.body
      const result = await this.authService.changePassword(
        req.user.userId,
        oldPassword,
        newPassword
      )
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  requestPasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body
      const result = await this.authService.requestPasswordReset(email)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body
      const result = await this.authService.resetPassword(token, newPassword)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
} 