import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      console.log('Login attempt:', req.body);
      
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email dan password harus diisi'
        });
      }

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          message: 'Email atau password salah'
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Email atau password salah'
        });
      }

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        token,
        user: userWithoutPassword
      });

    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(500).json({
        message: 'Terjadi kesalahan saat login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async me(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          message: 'User tidak ditemukan'
        });
      }

      // Hapus password dari response
      const { password: _, ...userWithoutPassword } = user;

      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({
        message: 'Terjadi kesalahan saat mengambil data user'
      });
    }
  }

  static async logout(_req: Request, res: Response): Promise<Response> {
    try {
      return res.json({ message: 'Berhasil logout' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        message: 'Terjadi kesalahan saat logout'
      });
    }
  }
} 