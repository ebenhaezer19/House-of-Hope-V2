import nodemailer from 'nodemailer'
import { baseTemplate } from '../templates/email/base.template'
import { resetPasswordTemplate } from '../templates/email/reset-password.template'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async sendResetPasswordEmail(email: string, name: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    
    try {
      const info = await this.transporter.sendMail({
        from: `"House of Hope" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'Reset Password - House of Hope',
        html: baseTemplate(resetPasswordTemplate(name, resetLink))
      })

      console.log('Reset password email sent:', info.messageId)
      return info
    } catch (error) {
      console.error('Error sending reset password email:', error)
      throw error
    }
  }

  // Tambahkan method untuk tipe email lainnya
  async sendWelcomeEmail(email: string, name: string) {
    // Implementasi welcome email
  }

  async sendPasswordChangedEmail(email: string, name: string) {
    // Implementasi notifikasi password berubah
  }
} 