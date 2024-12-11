"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    getEmailTemplate(type, data) {
        switch (type) {
            case 'reset':
                return `
          <h1>Reset Password</h1>
          <p>Hi ${data.name || 'there'},</p>
          <p>Click the link below to reset your password:</p>
          <a href="${data.resetUrl}">${data.resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
        `;
            case 'welcome':
                return `
          <h1>Selamat Datang di House of Hope</h1>
          <p>Hi ${data.name},</p>
          <p>Terima kasih telah bergabung dengan House of Hope.</p>
        `;
            case 'passwordChanged':
                return `
          <h1>Password Berhasil Diubah</h1>
          <p>Hi ${data.name},</p>
          <p>Password akun Anda telah berhasil diubah.</p>
        `;
            default:
                return '';
        }
    }
    async sendResetPasswordEmail(email, resetToken, name) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await this.transporter.sendMail({
            from: `"House of Hope" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Reset Password - House of Hope',
            html: this.getEmailTemplate('reset', { name, resetUrl })
        });
    }
    async sendWelcomeEmail(email, name) {
        await this.transporter.sendMail({
            from: `"House of Hope" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Selamat Datang di House of Hope',
            html: this.getEmailTemplate('welcome', { name })
        });
    }
    async sendPasswordChangedEmail(email, name) {
        await this.transporter.sendMail({
            from: `"House of Hope" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Password Berhasil Diubah - House of Hope',
            html: this.getEmailTemplate('passwordChanged', { name })
        });
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map