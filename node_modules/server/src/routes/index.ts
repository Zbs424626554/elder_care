import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { elderlyRoutes } from './elderly.routes';
import { familyRoutes } from './family.routes';
import { nurseRoutes } from './nurse.routes';
import { commonRoutes } from './common.routes';
import { adminRoutes } from './admin.routes';

const router = Router();

// API路由统一管理
export const apiRoutes = router;

// 认证相关路由
router.use('/auth', authRoutes);

// 老人端路由
router.use('/elderly', elderlyRoutes);

// 家属端路由
router.use('/family', familyRoutes);

// 护工端路由
router.use('/nurse', nurseRoutes);

// 后台管理路由
router.use('/admin', adminRoutes);

// 公共路由
router.use('/common', commonRoutes);

// 健康记录相关路由
router.get('/health-records', async (req, res) => {
  try {
    const { elderlyId, recordType, startDate, endDate, page = 1, limit = 10 } = req.query;
    // TODO: 实现获取健康记录列表逻辑
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        records: [],
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
});

router.post('/health-records', async (req, res) => {
  try {
    const { elderlyId, recordType, value, measuredAt } = req.body;
    // TODO: 实现创建健康记录逻辑
    res.json({
      code: 200,
      message: '记录创建成功',
      data: {
        id: 'record_id',
        elderlyId,
        recordType,
        value,
        measuredAt
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message
    });
  }
});

// 紧急警报相关路由
router.post('/emergency-alerts', async (req, res) => {
  try {
    const { location, audioClip } = req.body;
    // TODO: 实现触发紧急警报逻辑
    res.json({
      code: 200,
      message: '警报已发送',
      data: {
        id: 'alert_id',
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
});

router.get('/emergency-alerts', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    // TODO: 实现获取警报列表逻辑
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        alerts: [],
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
});

router.patch('/emergency-alerts/:alertId/handle', async (req, res) => {
  try {
    const { alertId } = req.params;
    // TODO: 实现处理警报逻辑
    res.json({
      code: 200,
      message: '警报已处理',
      data: {
        alertId,
        status: 'handled',
        handledBy: 'user_id'
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message
    });
  }
});

// 支付相关路由
router.post('/payments', async (req, res) => {
  try {
    const { orderId, amount, payMethod } = req.body;
    // TODO: 实现创建支付订单逻辑
    res.json({
      code: 200,
      message: '支付订单创建成功',
      data: {
        id: 'payment_id',
        orderId,
        amount,
        payMethod,
        transactionId: 'transaction_id',
        status: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message
    });
  }
});

router.post('/payments/callback', async (req, res) => {
  try {
    const { transactionId, status, amount } = req.body;
    // TODO: 实现支付回调逻辑
    res.json({
      code: 200,
      message: '回调处理成功',
      data: {
        transactionId,
        status
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message
    });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    // TODO: 实现获取支付记录逻辑
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        payments: [],
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
});

// AI推荐相关路由
router.get('/ai/recommendations', async (req, res) => {
  try {
    const { serviceType, location, elderlyId } = req.query;
    // TODO: 实现获取服务推荐逻辑
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        recommendations: []
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message
    });
  }
});

router.get('/ai/health-warnings', async (req, res) => {
  try {
    const { elderlyId, severity, page = 1, limit = 10 } = req.query;
    // TODO: 实现获取健康预警逻辑
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        warnings: [],
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
});

// 订单相关路由（通用）
router.get('/orders', async (req, res) => {
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
});

router.post('/orders', async (req, res) => {
  try {
    const { serviceType, nurseId, duration, price, address, remarks, healthSnapshot } = req.body;
    // TODO: 实现创建订单逻辑
    res.json({
      code: 200,
      message: '订单创建成功',
      data: {
        id: 'order_id',
        orderNumber: 'ORDER123456',
        status: 'pending',
        price
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message
    });
  }
});

router.get('/orders/:orderId', async (req, res) => {
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
});

// 404处理
router.use('*', (req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    error: {
      field: 'url',
      detail: `路径 ${req.originalUrl} 不存在`
    }
  });
}); 