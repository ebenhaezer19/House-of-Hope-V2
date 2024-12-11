"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.requestPasswordReset(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));
// Protected routes
router.use(auth_middleware_1.authMiddleware);
router.get('/verify', (req, res) => authController.verifyToken(req, res));
router.get('/profile', (req, res) => authController.getProfile(req, res));
router.put('/profile', (req, res) => authController.updateProfile(req, res));
router.post('/change-password', (req, res) => authController.changePassword(req, res));
exports.default = router;
