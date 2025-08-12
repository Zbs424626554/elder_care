import express from 'express';
import authRoutes from './auth.routes';
import reviewRoutes from './review.routes';
import complaintRoutes from './complaint.routes';
import adminRoutes from './admin';

const router = express.Router();

// API版本前缀
const API_PREFIX = '/api';

// 身份验证路由
router.use(`${API_PREFIX}/auth`, authRoutes);

// 评价路由（兼容单复数）
router.use(`${API_PREFIX}/review`, reviewRoutes);
router.use(`${API_PREFIX}/reviews`, reviewRoutes);

// 投诉路由
router.use(`${API_PREFIX}/complaints`, complaintRoutes);

// 管理后台路由
router.use(`${API_PREFIX}/admin`, adminRoutes);

// API根路径
router.get(`${API_PREFIX}`, (req, res) => {
  res.json({
    message: '智慧养老综合服务平台API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

export default router; 