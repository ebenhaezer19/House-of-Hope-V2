"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const resident_routes_1 = __importDefault(require("./resident.routes"));
const room_routes_1 = __importDefault(require("./room.routes"));
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            database: 'connected',
            redis: 'connected'
        }
    });
});
// Mount routes
router.use('/auth', auth_routes_1.default);
router.use('/residents', resident_routes_1.default);
router.use('/rooms', room_routes_1.default);
exports.default = router;
