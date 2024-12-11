"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resident_controller_1 = require("../controllers/resident.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const residentController = new resident_controller_1.ResidentController();
// Protect all routes with middleware
router.all('*', auth_middleware_1.authMiddleware);
// GET /api/residents
router.get('/', residentController.getAllResidents.bind(residentController));
// GET /api/residents/:id
router.get('/:id', residentController.getResident.bind(residentController));
// POST /api/residents
router.post('/', residentController.createResident.bind(residentController));
// PUT /api/residents/:id
router.put('/:id', residentController.updateResident.bind(residentController));
// DELETE /api/residents/:id
router.delete('/:id', residentController.deleteResident.bind(residentController));
exports.default = router;
