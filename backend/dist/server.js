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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const PORT = parseInt(process.env.PORT || '5001', 10);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Test database connection
            yield prisma.$connect();
            console.log('Successfully connected to database');
            const server = app_1.default.listen(PORT, '0.0.0.0', () => {
                console.log('=================================');
                console.log(`Server is running on port ${PORT}`);
                console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
                console.log(`API URL: http://localhost:${PORT}/api`);
                console.log('=================================');
            });
            // Graceful shutdown
            process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
                console.log('SIGTERM received. Shutting down gracefully');
                yield prisma.$disconnect();
                server.close(() => {
                    console.log('Process terminated');
                });
            }));
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    });
}
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
startServer();
