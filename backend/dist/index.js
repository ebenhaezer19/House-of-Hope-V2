"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
});
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parser
app.use(express_1.default.json());
// Root endpoint
app.get('/', (_req, res) => {
    res.json({ message: 'House of Hope API' });
});
// API routes
app.use('/api', routes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json(Object.assign({ message: err.message || 'Internal Server Error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
const PORT = parseInt(process.env.PORT || '5001', 10);
app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log('=================================');
});
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
