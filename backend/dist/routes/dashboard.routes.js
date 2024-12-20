"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
router.use(auth_middleware_1.authMiddleware);
router.get('/stats', dashboardController.getStats);
router.get('/residents/gender', dashboardController.getResidentsByGender);
router.get('/rooms/occupancy', dashboardController.getRoomsOccupancy);
router.get('/recent-activities', dashboardController.getRecentActivities);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map