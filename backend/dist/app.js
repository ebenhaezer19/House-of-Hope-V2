"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log('\n=== Incoming Request ===');
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('======================\n');
    next();
});
app.use('/api', (req, _res, next) => {
    console.log('\n=== API Request ===');
    console.log(`${req.method} ${req.baseUrl}${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('=================\n');
    next();
}, routes_1.default);
console.log('\n=== Registered Routes ===');
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Route: ${middleware.route.path}`);
        console.log(`Methods: ${Object.keys(middleware.route.methods)}`);
    }
    else if (middleware.name === 'router') {
        console.log(`Router: ${middleware.regexp}`);
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`  ${Object.keys(handler.route.methods)} ${handler.route.path}`);
            }
        });
    }
});
console.log('=====================\n');
app.get('/debug/routes', (_req, res) => {
    const routes = [];
    console.log('\n=== Registered Routes ===');
    app._router.stack.forEach((middleware) => {
        var _a;
        console.log('Middleware:', middleware.name);
        if (middleware.route) {
            console.log('Route:', middleware.route.path);
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods || {})
            });
        }
        else if (middleware.name === 'router' && ((_a = middleware.handle) === null || _a === void 0 ? void 0 : _a.stack)) {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    console.log('Handler:', handler.route.path);
                    routes.push({
                        path: `${middleware.regexp}${handler.route.path}`,
                        methods: Object.keys(handler.route.methods || {})
                    });
                }
            });
        }
    });
    console.log('======================\n');
    res.json({
        message: 'Available routes',
        routes: routes
    });
});
app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
});
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});
exports.default = app;
//# sourceMappingURL=app.js.map