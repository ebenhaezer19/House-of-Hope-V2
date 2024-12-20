"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: 'Terlalu banyak percobaan login, silakan coba lagi dalam 15 menit'
    },
    standardHeaders: true,
    legacyHeaders: false
});
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 60,
    message: {
        message: 'Terlalu banyak request, silakan coba lagi nanti'
    },
    standardHeaders: true,
    legacyHeaders: false
});
//# sourceMappingURL=rate-limit.middleware.js.map