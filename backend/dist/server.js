"use strict";
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
async function startServer() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to database');
        const server = app_1.default.listen(PORT, '0.0.0.0', () => {
            console.log('=================================');
            console.log(`Server is running on port ${PORT}`);
            console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
            console.log(`API URL: http://localhost:${PORT}/api`);
            console.log('=================================');
        });
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received. Shutting down gracefully');
            await prisma.$disconnect();
            server.close(() => {
                console.log('Process terminated');
            });
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
startServer();
//# sourceMappingURL=server.js.map