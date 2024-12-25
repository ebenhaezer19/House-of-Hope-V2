import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config/jwt.config'
import { sendEmail } from './email.service'
import crypto from 'crypto'

export class AuthService {
  private static prisma = new PrismaClient()

  async register(email: string, password: string, name: string): Promise<Omit<User, 'password'>> {
    const existingUser = await this.prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error('Email already registered')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    // Send welcome email directly
    await sendEmail(
      email,
      'Welcome to House of Hope',
      `<h1>Welcome ${name}!</h1><p>Thank you for registering.</p>`
    )

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.secret,
      { expiresIn: config.expiresIn }
    )

    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token
    }
  }

  async getProfile(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateProfile(userId: number, data: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data
    })

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid old password')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return { message: 'Password changed successfully' }
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } })
      if (!user) {
        throw new Error('Email tidak terdaftar')
      }

      const resetToken = crypto.randomBytes(32).toString('hex')
      const hashedToken = await bcrypt.hash(resetToken, 10)

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: new Date(Date.now() + 3600000) // 1 jam
        }
      })

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

      try {
        await sendEmail(
          email,
          'Reset Password',
          `
            <h1>Reset Password</h1>
            <p>Anda menerima email ini karena Anda (atau seseorang) telah meminta reset password.</p>
            <p>Klik link berikut untuk mereset password Anda:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>Link ini akan kadaluarsa dalam 1 jam.</p>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
          `
        )
      } catch (error) {
        // Rollback perubahan jika email gagal terkirim
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            resetToken: null,
            resetTokenExpiry: null
          }
        })
        throw new Error('Gagal mengirim email reset password. Silakan coba lagi nanti.')
      }

      return { message: 'Link reset password telah dikirim ke email Anda' }
    } catch (error) {
      throw error
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: { not: null },
        resetTokenExpiry: { gt: new Date() }
      }
    })

    if (!user) {
      throw new Error('Invalid or expired reset token')
    }

    const isValidToken = await bcrypt.compare(token, user.resetToken!)
    if (!isValidToken) {
      throw new Error('Invalid reset token')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return { message: 'Password reset successfully' }
  }

  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');

      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'reset-secret',
        { expiresIn: '1h' }
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 3600000)
        }
      });

      await sendEmail(
        email,
        'Reset Password',
        `Click here to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      );
    } catch (error) {
      console.error('Send reset email error:', error);
      throw error;
    }
  }
} 