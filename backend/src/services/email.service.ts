import nodemailer from 'nodemailer'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    
    try {
      console.log('Sending email with config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: '***'
        }
      })

      const result = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset Password - House of Hope',
        html: `
          <h1>Reset Password</h1>
          <p>Klik link berikut untuk reset password Anda:</p>
          <a href="${resetLink}">${resetLink}</a>
        `
      })

      console.log('Email sent successfully:', result)
      return result
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  }
} 