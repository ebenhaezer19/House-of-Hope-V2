"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resident_controller_1 = require("../controllers/resident.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const residentController = new resident_controller_1.ResidentController();
router.all('*', auth_middleware_1.authMiddleware);
router.get('/', residentController.getAllResidents.bind(residentController));
router.get('/:id', residentController.getResident.bind(residentController));
router.post('/', residentController.createResident.bind(residentController));
router.put('/:id', residentController.updateResident.bind(residentController));
router.delete('/:id', residentController.deleteResident.bind(residentController));
exports.default = router;
//# sourceMappingURL=resident.routes.js.map