import { PrismaClient, User, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config/jwt.config'
import crypto from 'crypto'
import { EmailService } from '../services/email.service'
import { addEmailToQueue } from '../queues/email.queue'

const prisma = new PrismaClient()

export class AuthService {
  private emailService: EmailService

  constructor() {
    this.emailService = new EmailService()
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error('Email already exists')
    }

    // Check if this is the first user
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? Role.ADMIN : Role.STAFF

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    })

    const { password: _, ...userWithoutPassword } = user

    // Kirim welcome email melalui queue
    await addEmailToQueue({
      type: 'welcome',
      data: { email, name }
    })

    return userWithoutPassword
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'rahasia',
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.secret) as { id: number }
      const user = await prisma.user.findUnique({ where: { id: decoded.id } })
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        throw new Error('Email tidak terdaftar')
      }

      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenHash = await bcrypt.hash(resetToken, 10)

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: resetTokenHash,
          resetTokenExpiry: new Date(Date.now() + 3600000)
        }
      })

      try {
        await addEmailToQueue({
          type: 'resetPassword',
          data: { 
            email: user.email, 
            name: user.name, 
            token: resetToken 
          }
        })
      } catch (error) {
        console.error('Failed to send reset password email:', error)
        // Tidak throw error ke user, biarkan proses tetap berlanjut
      }

      return { message: 'Jika email terdaftar, link reset password akan dikirim' }
    } catch (error) {
      console.error('Reset password request error:', error)
      throw error
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw new Error('Token tidak valid atau sudah kadaluarsa')
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password dan hapus token reset
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    // Kirim notifikasi password berubah
    await addEmailToQueue({
      type: 'passwordChanged',
      data: { 
        email: user.email, 
        name: user.name 
      }
    })

    return { message: 'Password berhasil diubah' }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User tidak ditemukan')
    }

    // Verifikasi password lama
    const isValidPassword = await bcrypt.compare(oldPassword, user.password)
    if (!isValidPassword) {
      throw new Error('Password lama tidak sesuai')
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    // Kirim notifikasi password berubah
    await addEmailToQueue({
      type: 'passwordChanged',
      data: { 
        email: user.email, 
        name: user.name 
      }
    })

    return { message: 'Password berhasil diubah' }
  }

  async updateProfile(userId: number, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return user
  }

  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
} 