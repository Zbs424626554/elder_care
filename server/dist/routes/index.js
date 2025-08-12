"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const complaint_routes_1 = __importDefault(require("./complaint.routes"));
const admin_1 = __importDefault(require("./admin"));
const router = express_1.default.Router();
// API版本前缀
const API_PREFIX = '/api';
// 身份验证路由
router.use(`${API_PREFIX}/auth`, auth_routes_1.default);
// 评价路由（兼容单复数）
router.use(`${API_PREFIX}/review`, review_routes_1.default);
router.use(`${API_PREFIX}/reviews`, review_routes_1.default);
// 投诉路由
router.use(`${API_PREFIX}/complaints`, complaint_routes_1.default);
// 管理后台路由
router.use(`${API_PREFIX}/admin`, admin_1.default);
// API根路径
router.get(`${API_PREFIX}`, (req, res) => {
    res.json({
        message: '智慧养老综合服务平台API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
