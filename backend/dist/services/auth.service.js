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
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = require("../services/email.service");
const email_queue_1 = require("../queues/email.queue");
const prisma = new client_1.PrismaClient();
class AuthService {
    constructor() {
        this.emailService = new email_service_1.EmailService();
    }
    async register(email, password, name) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? client_1.Role.ADMIN : client_1.Role.STAFF;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role
            }
        });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        await (0, email_queue_1.addEmailToQueue)({
            type: 'welcome',
            data: { email, name }
        });
        return userWithoutPassword;
    }
    async login(email, password) {
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
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'rahasia', { expiresIn: '24h' });
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
    async validateToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwt_config_1.config.secret);
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    async requestPasswordReset(email) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('Email tidak terdaftar');
            }
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const resetTokenHash = await bcryptjs_1.default.hash(resetToken, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: resetTokenHash,
                    resetTokenExpiry: new Date(Date.now() + 3600000)
                }
            });
            try {
                await (0, email_queue_1.addEmailToQueue)({
                    type: 'resetPassword',
                    data: {
                        email: user.email,
                        name: user.name,
                        token: resetToken
                    }
                });
            }
            catch (error) {
                console.error('Failed to send reset password email:', error);
            }
            return { message: 'Jika email terdaftar, link reset password akan dikirim' };
        }
        catch (error) {
            console.error('Reset password request error:', error);
            throw error;
        }
    }
    async resetPassword(token, newPassword) {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });
        if (!user) {
            throw new Error('Token tidak valid atau sudah kadaluarsa');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
        await (0, email_queue_1.addEmailToQueue)({
            type: 'passwordChanged',
            data: {
                email: user.email,
                name: user.name
            }
        });
        return { message: 'Password berhasil diubah' };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User tidak ditemukan');
        }
        const isValidPassword = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Password lama tidak sesuai');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        await (0, email_queue_1.addEmailToQueue)({
            type: 'passwordChanged',
            data: {
                email: user.email,
                name: user.name
            }
        });
        return { message: 'Password berhasil diubah' };
    }
    async updateProfile(userId, data) {
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
        });
        return user;
    }
    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map