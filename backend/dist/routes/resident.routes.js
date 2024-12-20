"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resident_controller_1 = require("../controllers/resident.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = express_1.default.Router();
const residentController = new resident_controller_1.ResidentController();
router.use((req, _res, next) => {
    console.log('Resident Route:', req.method, req.path);
    next();
});
router.get('/', async (req, res) => {
    console.log('[Resident Route] GET / called');
    try {
        console.log('Calling residentController.getAllResidents');
        await residentController.getAllResidents(req, res);
        console.log('getAllResidents completed');
    }
    catch (error) {
        console.error('[Resident Route] Error:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({
            message: 'Error in resident route handler',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});
router.get('/:id', residentController.getResident.bind(residentController));
router.post('/', upload_middleware_1.upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]), residentController.createResident.bind(residentController));
router.put('/:id', upload_middleware_1.upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]), residentController.updateResident.bind(residentController));
router.delete('/:id', residentController.deleteResident.bind(residentController));
exports.default = router;
//# sourceMappingURL=resident.routes.js.map