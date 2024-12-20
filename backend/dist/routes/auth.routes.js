"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.router = express_1.default.Router();
exports.router.post('/login', auth_controller_1.AuthController.login);
exports.router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.me);
exports.router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.logout);
module.exports = exports.router;
//# sourceMappingURL=auth.routes.js.map