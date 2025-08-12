"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const aiController = new ai_controller_1.AIController();
/**
 * @route   POST /api/ai/health/process
 * @desc    处理健康数据并生成预警
 * @access  Private (Admin/System only)
 */
router.post('/health/process', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin', 'system'), aiController.processHealthData);
/**
 * @route   GET /api/ai/recommendations/:userId
 * @desc    为特定用户生成服务推荐
 * @access  Private (Admin/System/User)
 */
router.get('/recommendations/:userId', auth_middleware_1.authMiddleware.protect, aiController.generateRecommendations);
/**
 * @route   GET /api/ai/insights
 * @desc    生成业务洞察报告
 * @access  Private (Admin only)
 */
router.get('/insights', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin'), aiController.getBusinessInsights);
exports.default = router;
