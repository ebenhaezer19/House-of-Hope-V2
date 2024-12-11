"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name } = req.body;
                const user = yield this.authService.register(email, password, name);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.authService.login(email, password);
                res.json(result);
            }
            catch (error) {
                res.status(401).json({ message: error.message });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const user = yield this.authService.getProfile(req.user.userId);
                res.json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const user = yield this.authService.updateProfile(req.user.userId, req.body);
                res.json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const { oldPassword, newPassword } = req.body;
                const result = yield this.authService.changePassword(req.user.userId, oldPassword, newPassword);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    requestPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.authService.requestPasswordReset(email);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                const result = yield this.authService.resetPassword(token, newPassword);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const user = yield this.authService.getProfile(req.user.userId);
                res.json(user);
            }
            catch (error) {
                res.status(401).json({ message: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
