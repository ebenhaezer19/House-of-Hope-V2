import { PrismaClient, User, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config/jwt.config'
import crypto from 'crypto'
import { EmailService } from '../services/email.service'

const prisma = new PrismaClient()

export class AuthService {
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
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('Email tidak terdaftar')
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = await bcrypt.hash(resetToken, 10)

    // Save reset token dan expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry: new Date(Date.now() + 3600000) // 1 jam
      }
    })

    // Kirim email
    const emailService = new EmailService()
    await emailService.sendResetPasswordEmail(email, resetToken)

    return { message: 'Email reset password telah dikirim' }
  }

  async resetPassword(token: string, newPassword: string) {
    // Cari user dengan token yang belum expired
    const user = await prisma.user.findFirst({
      where: {
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user || !user.resetToken) {
      throw new Error('Token tidak valid atau sudah expired')
    }

    // Verifikasi token
    const isValidToken = await bcrypt.compare(token, user.resetToken)
    if (!isValidToken) {
      throw new Error('Token tidak valid')
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return { message: 'Password berhasil direset' }
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

    return { message: 'Password berhasil diubah' }
  }
} 