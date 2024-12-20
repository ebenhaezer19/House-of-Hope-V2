"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("./auth.routes");
const resident_routes_1 = __importDefault(require("./resident.routes"));
const room_routes_1 = __importDefault(require("./room.routes"));
const payment_routes_1 = require("./payment.routes");
const router = express_1.default.Router();
router.use((req, _res, next) => {
    console.log('\n=== API Router ===');
    console.log('Full URL:', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Base URL:', req.baseUrl);
    console.log('Original URL:', req.originalUrl);
    console.log('=================\n');
    next();
});
router.get('/test', (_req, res) => {
    res.json({ message: 'API routes working' });
});
router.use('/auth', auth_routes_1.router);
router.use('/residents', resident_routes_1.default);
router.use('/rooms', room_routes_1.default);
router.use('/payments', payment_routes_1.router);
exports.default = router;
//# sourceMappingURL=index.js.map