"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const client_1 = require("@prisma/client");
class AuthController {
    constructor() {
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login(email, password);
                res.json(result);
            }
            catch (error) {
                res.status(401).json({ message: error.message });
            }
        };
        this.getProfile = async (req, res) => {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const user = await this.authService.getProfile(req.user.userId);
                res.json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.register = async (req, res) => {
            try {
                const { email, password, name } = req.body;
                const user = await this.authService.register(email, password, name);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.updateProfile = async (req, res) => {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const user = await this.authService.updateProfile(req.user.userId, req.body);
                res.json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.changePassword = async (req, res) => {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const { oldPassword, newPassword } = req.body;
                const result = await this.authService.changePassword(req.user.userId, oldPassword, newPassword);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.requestPasswordReset = async (req, res) => {
            try {
                const { email } = req.body;
                const result = await this.authService.requestPasswordReset(email);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { token, newPassword } = req.body;
                const result = await this.authService.resetPassword(token, newPassword);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.authService = new auth_service_1.AuthService();
        this.prisma = new client_1.PrismaClient();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map