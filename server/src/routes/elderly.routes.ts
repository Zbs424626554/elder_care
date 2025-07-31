import { Router } from 'express';
import { auth as authMiddleware } from '../middleware/auth.middleware';
import { roleCheckMiddleware } from '../middleware/roleCheck.middleware';
import { ElderlyController } from '../controllers/elderly.controller';

const router = Router();

// 老人端API路由
export const elderlyRoutes = router;

// 完善老人信息
router.put('/profile',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  ElderlyController.updateProfile
);

// 获取老人健康信息
router.get('/health',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  ElderlyController.getHealth
);

// 获取推荐护工列表
router.get('/nurses',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { serviceType, location, rating, page = 1, limit = 10 } = req.query;
      // TODO: 实现护工推荐逻辑
      res.json({
        code: 200,
        message: '获取成功',
        data: {
          nurses: [],
          total: 0,
          page: Number(page),
          limit: Number(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 收藏护工
router.post('/collect/:nurseId',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { nurseId } = req.params;
      // TODO: 实现收藏护工逻辑
      res.json({
        code: 200,
        message: '收藏成功',
        data: { nurseId }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 取消收藏护工
router.delete('/collect/:nurseId',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { nurseId } = req.params;
      // TODO: 实现取消收藏逻辑
      res.json({
        code: 200,
        message: '取消收藏成功',
        data: { nurseId }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 获取收藏的护工列表
router.get('/collect',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      // TODO: 实现获取收藏列表逻辑
      res.json({
        code: 200,
        message: '获取成功',
        data: { nurses: [] }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 获取订单列表
router.get('/orders',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      // TODO: 实现获取订单列表逻辑
      res.json({
        code: 200,
        message: '获取成功',
        data: {
          orders: [],
          total: 0,
          page: Number(page),
          limit: Number(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 获取订单详情
router.get('/orders/:orderId',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      // TODO: 实现获取订单详情逻辑
      res.json({
        code: 200,
        message: '获取成功',
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 紧急呼叫
router.post('/emergency',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { location, audioClip } = req.body;
      // TODO: 实现紧急呼叫逻辑
      res.json({
        code: 200,
        message: '警报已发送',
        data: {
          id: 'emergency_id',
          status: 'pending',
          triggerTime: new Date()
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 获取通知列表
router.get('/notifications',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { type, isRead, page = 1, limit = 10 } = req.query;
      // TODO: 实现获取通知列表逻辑
      res.json({
        code: 200,
        message: '获取成功',
        data: {
          notifications: [],
          total: 0,
          page: Number(page),
          limit: Number(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 标记通知为已读
router.patch('/notifications/:notificationId/read',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      // TODO: 实现标记已读逻辑
      res.json({
        code: 200,
        message: '标记成功',
        data: { notificationId, isRead: true }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
);

// 获取健康数据
router.get('/health-data',
  authMiddleware,
  roleCheckMiddleware(['elderly']),
  async (req, res) => {
    try {
      const { startDate, endDate, recordType } = req.query;
      // TODO: 实现获取健康数据逻辑
      res.json({
        code: 200,
        message: '获取成功',
        data: {
          records: [],
          total: 0
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: '服务器错误',
        error: error.message
      });
    }
  }
); 