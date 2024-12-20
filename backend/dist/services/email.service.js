"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
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
        });
    }
    async sendEmail(to, subject, html) {
        try {
            const result = await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject,
                html
            });
            console.log(`Email sent to ${to}`);
            return result;
        }
        catch (error) {
            console.error('Email sending failed:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }
            else {
                throw new Error('Failed to send email: Unknown error occurred');
            }
        }
    }
}
exports.EmailService = EmailService;
exports.emailService = new EmailService();
//# sourceMappingURL=email.service.js.map