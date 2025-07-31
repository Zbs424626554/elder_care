import { Router } from 'express';
import { auth as authMiddleware } from '../middleware/auth.middleware';
import { roleCheckMiddleware } from '../middleware/roleCheck.middleware';
import { NurseController } from '../controllers/nurse.controller';

const router = Router();

// 护工端API路由
export const nurseRoutes = router;

// 完善护工信息
router.put('/profile',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.updateProfile
);

// 上传资质证书
router.post('/certifications',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.uploadCertification
);

// 获取资质证书列表
router.get('/certifications',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getCertifications
);

// 更新护工状态
router.patch('/status',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.updateStatus
);

// 获取可接订单列表
router.get('/available-orders',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getAvailableOrders
);

// 接单
router.patch('/orders/:orderId/accept',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.acceptOrder
);

// 获取我的订单列表
router.get('/orders',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getOrders
);

// 获取订单详情
router.get('/orders/:orderId',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getOrderDetail
);

// 开始服务
router.patch('/orders/:orderId/start',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.startService
);

// 完成服务
router.patch('/orders/:orderId/complete',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.completeService
);

// 创建服务记录
router.post('/service-records',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.createServiceRecord
);

// 获取服务记录列表
router.get('/service-records',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getServiceRecords
);

// 获取收入统计
router.get('/income',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getIncome
);

// 申请提现
router.post('/withdrawals',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.withdraw
);

// 获取提现记录
router.get('/withdrawals',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getWithdrawals
);

// 获取收到的评价
router.get('/reviews',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getReviews
);

// 申诉评价
router.post('/reviews/:reviewId/appeal',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.appealReview
);

// 获取日程安排
router.get('/schedule',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getSchedule
);

// 获取通知列表
router.get('/notifications',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.getNotifications
);

// 标记通知为已读
router.patch('/notifications/:notificationId/read',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.markNotificationRead
);

// 创建客服工单
router.post('/support-tickets',
  authMiddleware,
  roleCheckMiddleware(['nurse']),
  NurseController.createSupportTicket
); 