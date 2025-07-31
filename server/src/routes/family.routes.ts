import { Router } from 'express';
import { auth as authMiddleware } from '../middleware/auth.middleware';
import { roleCheckMiddleware } from '../middleware/roleCheck.middleware';
import { FamilyController } from '../controllers/family.controller';

const router = Router();

// 家属端API路由
export const familyRoutes = router;

// 完善家属信息
router.put('/profile',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.updateProfile
);

// 绑定老人
router.post('/bind-elderly',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.bindElderly
);

// 获取绑定的老人列表
router.get('/elderly',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getElderlyList
);

// 录入老人健康数据
router.post('/health-record',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.createHealthRecord
);

// 发布服务需求
router.post('/service-requests',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.createServiceRequest
);

// 获取护工列表
router.get('/nurses',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getNurses
);

// 获取护工详情
router.get('/nurses/:nurseId',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getNurseDetail
);

// 创建订单
router.post('/orders',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.createOrder
);

// 获取订单列表
router.get('/orders',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getOrders
);

// 获取订单详情
router.get('/orders/:orderId',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getOrderDetail
);

// 确认服务完成
router.patch('/orders/:orderId/confirm',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.confirmOrder
);

// 取消订单
router.patch('/orders/:orderId/cancel',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.cancelOrder
);

// 评价护工
router.post('/reviews',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.createReview
);

// 获取老人健康数据
router.get('/elderly/:elderlyId/health-data',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getElderlyHealthData
);

// 获取健康预警
router.get('/health-warnings',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getHealthWarnings
);

// 获取通知列表
router.get('/notifications',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.getNotifications
);

// 标记通知为已读
router.patch('/notifications/:notificationId/read',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.markNotificationRead
);

// 创建客服工单
router.post('/support-tickets',
  authMiddleware,
  roleCheckMiddleware(['family']),
  FamilyController.createSupportTicket
); 