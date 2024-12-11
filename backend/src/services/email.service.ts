import nodemailer from 'nodemailer'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  private getEmailTemplate(type: string, data: any) {
    switch (type) {
      case 'reset':
        return `
          <h1>Reset Password</h1>
          <p>Hi ${data.name || 'there'},</p>
          <p>Click the link below to reset your password:</p>
          <a href="${data.resetUrl}">${data.resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
        `
      case 'welcome':
        return `
          <h1>Selamat Datang di House of Hope</h1>
          <p>Hi ${data.name},</p>
          <p>Terima kasih telah bergabung dengan House of Hope.</p>
        `
      case 'passwordChanged':
        return `
          <h1>Password Berhasil Diubah</h1>
          <p>Hi ${data.name},</p>
          <p>Password akun Anda telah berhasil diubah.</p>
        `
      default:
        return ''
    }
  }

  async sendResetPasswordEmail(email: string, resetToken: string, name?: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    
    await this.transporter.sendMail({
      from: `"House of Hope" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Reset Password - House of Hope',
      html: this.getEmailTemplate('reset', { name, resetUrl })
    })
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.transporter.sendMail({
      from: `"House of Hope" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Selamat Datang di House of Hope',
      html: this.getEmailTemplate('welcome', { name })
    })
  }

  async sendPasswordChangedEmail(email: string, name: string) {
    await this.transporter.sendMail({
      from: `"House of Hope" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Password Berhasil Diubah - House of Hope',
      html: this.getEmailTemplate('passwordChanged', { name })
    })
  }
} 