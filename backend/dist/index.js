"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5002;
app_1.default.listen(port, () => {
    console.log(`\n=== Server running on port ${port} ===\n`);
    console.log('Registered routes:');
    app_1.default._router.stack.forEach((middleware) => {
        if (middleware.route) {
            console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
        }
        else if (middleware.name === 'router') {
            console.log('Router:', middleware.regexp);
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    console.log(`${Object.keys(handler.route.methods)} ${handler.route.path}`);
                }
            });
        }
    });
    console.log('\n');
});
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
//# sourceMappingURL=index.js.map