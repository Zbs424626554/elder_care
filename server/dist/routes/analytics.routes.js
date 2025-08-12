"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataAnalytics_controller_1 = require("../controllers/dataAnalytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const dataAnalyticsController = new dataAnalytics_controller_1.DataAnalyticsController();
/**
 * @route   GET /api/analytics/overview
 * @desc    获取平台数据概览
 * @access  Private (Admin only)
 */
router.get('/overview', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin'), dataAnalyticsController.getPlatformOverview);
/**
 * @route   GET /api/analytics/users
 * @desc    获取用户数据分析
 * @access  Private (Admin only)
 */
router.get('/users', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin'), dataAnalyticsController.getUserAnalytics);
/**
 * @route   GET /api/analytics/orders
 * @desc    获取订单数据分析
 * @access  Private (Admin only)
 */
router.get('/orders', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin'), dataAnalyticsController.getOrderAnalytics);
/**
 * @route   GET /api/analytics/health
 * @desc    获取健康数据分析
 * @access  Private (Admin only)
 */
router.get('/health', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin'), dataAnalyticsController.getHealthAnalytics);
/**
 * @route   GET /api/analytics/feedback
 * @desc    获取反馈数据分析
 * @access  Private (Admin only)
 */
router.get('/feedback', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin'), dataAnalyticsController.getFeedbackAnalytics);
/**
 * @route   GET /api/analytics/ai-data
 * @desc    获取AI模块所需数据
 * @access  Private (System/AI only)
 */
router.get('/ai-data', auth_middleware_1.authMiddleware.protect, auth_middleware_1.authMiddleware.restrictTo('admin', 'system'), dataAnalyticsController.getDataForAI);
exports.default = router;
