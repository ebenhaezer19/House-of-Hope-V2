import nodemailer from 'nodemailer'
import { emailConfig } from '../config/email.config'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass
      }
    })
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: 'Reset Password - House of Hope',
      html: `
        <h1>Reset Password</h1>
        <p>Anda menerima email ini karena ada permintaan reset password untuk akun Anda.</p>
        <p>Klik link di bawah ini untuk mereset password Anda:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4F46E5;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        ">Reset Password</a>
        <p>Link ini akan kadaluarsa dalam 1 jam.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Email ini dikirim otomatis, mohon tidak membalas.</p>
      `
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error('Gagal mengirim email reset password')
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: 'Selamat Datang di House of Hope',
      html: `
        <h1>Selamat Datang, ${name}!</h1>
        <p>Terima kasih telah bergabung dengan House of Hope.</p>
        <p>Akun Anda telah berhasil dibuat dan Anda sekarang dapat mengakses sistem manajemen House of Hope.</p>
        <a href="${process.env.FRONTEND_URL}/login" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4F46E5;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        ">Login ke Sistem</a>
        <hr>
        <p style="color: #666; font-size: 12px;">Email ini dikirim otomatis, mohon tidak membalas.</p>
      `
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error('Gagal mengirim email selamat datang')
    }
  }
} 