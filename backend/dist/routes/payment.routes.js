"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const paymentController = __importStar(require("../controllers/payment.controller"));
console.log('Initializing payment routes...');
const router = express_1.default.Router();
exports.router = router;
router.use((req, _res, next) => {
    console.log('\n=== Payment Route Handler ===');
    console.log('Full URL:', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Base URL:', req.baseUrl);
    console.log('Original URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('==========================\n');
    next();
});
router.get('/test', (_req, res) => {
    console.log('Payment test endpoint hit');
    res.json({ message: 'Payment routes working' });
});
console.log('Registering payment routes...');
console.log('GET /');
router.get('/', (req, res) => {
    console.log('GET /payments hit');
    return paymentController.getPayments(req, res);
});
console.log('POST /');
router.post('/', (req, res) => {
    console.log('POST /payments hit');
    return paymentController.createPayment(req, res);
});
console.log('PUT /:id');
router.put('/:id', (req, res) => {
    console.log('PUT /payments/:id hit');
    return paymentController.updatePayment(req, res);
});
console.log('DELETE /:id');
router.delete('/:id', (req, res) => {
    console.log('DELETE /payments/:id hit');
    return paymentController.deletePayment(req, res);
});
console.log('Payment routes registered.');
exports.default = router;
//# sourceMappingURL=payment.routes.js.map