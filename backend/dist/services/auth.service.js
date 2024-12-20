"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = require("../config/jwt.config");
const email_service_1 = require("./email.service");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async register(email, password, name) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        await email_service_1.emailService.sendEmail(email, 'Welcome to House of Hope', `<h1>Welcome ${name}!</h1><p>Thank you for registering.</p>`);
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwt_config_1.config.secret, { expiresIn: jwt_config_1.config.expiresIn });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return {
            user: userWithoutPassword,
            token
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    }
    async updateProfile(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data
        });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid old password');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        return { message: 'Password changed successfully' };
    }
    async requestPasswordReset(email) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('Email tidak terdaftar');
            }
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const hashedToken = await bcryptjs_1.default.hash(resetToken, 10);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: hashedToken,
                    resetTokenExpiry: new Date(Date.now() + 3600000)
                }
            });
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            try {
                await email_service_1.emailService.sendEmail(email, 'Reset Password', `
            <h1>Reset Password</h1>
            <p>Anda menerima email ini karena Anda (atau seseorang) telah meminta reset password.</p>
            <p>Klik link berikut untuk mereset password Anda:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>Link ini akan kadaluarsa dalam 1 jam.</p>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
          `);
            }
            catch (error) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        resetToken: null,
                        resetTokenExpiry: null
                    }
                });
                throw new Error('Gagal mengirim email reset password. Silakan coba lagi nanti.');
            }
            return { message: 'Link reset password telah dikirim ke email Anda' };
        }
        catch (error) {
            throw error;
        }
    }
    async resetPassword(token, newPassword) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: { not: null },
                resetTokenExpiry: { gt: new Date() }
            }
        });
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }
        const isValidToken = await bcryptjs_1.default.compare(token, user.resetToken);
        if (!isValidToken) {
            throw new Error('Invalid reset token');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
        return { message: 'Password reset successfully' };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map