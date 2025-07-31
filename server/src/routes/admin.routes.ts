import { Router } from 'express';
import { auth as authMiddleware } from '../middleware/auth.middleware';
import { checkRole as roleCheckMiddleware } from '../middleware/roleCheck.middleware';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

// 后台管理API路由
export const adminRoutes = router;

// 获取统计数据
router.get('/statistics',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getStatistics
);

// 获取用户列表
router.get('/users',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getUsers
);

// 获取用户详情
router.get('/users/:userId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getUserDetail
);

// 更新用户状态
router.patch('/users/:userId/status',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.updateUserStatus
);

// 审核护工资质
router.patch('/certifications/:certId/verify',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.verifyCertification
);

// 获取资质审核列表
router.get('/certifications',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getCertifications
);

// 获取订单列表
router.get('/orders',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getOrders
);

// 获取订单详情
router.get('/orders/:orderId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getOrderDetail
);

// 处理异常订单
router.patch('/orders/:orderId/handle',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.handleOrder
);

// 创建服务类型
router.post('/services',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.createService
);

// 更新服务类型
router.put('/services/:serviceId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.updateService
);

// 删除服务类型
router.delete('/services/:serviceId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.deleteService
);

// 处理评价申诉
router.patch('/reviews/:reviewId/appeal',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.handleReviewAppeal
);

// 处理投诉
router.patch('/complaints/:complaintId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.handleComplaint
);

// 处理客服工单
router.patch('/support-tickets/:ticketId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.processSupportTicket
);

// 处理提现申请
router.patch('/withdrawals/:withdrawalId/process',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.processWithdrawal
);

// 发布平台公告
router.post('/announcements',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.createAnnouncement
);

// 获取公告列表
router.get('/announcements',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getAnnouncements
);

// 更新公告
router.put('/announcements/:announcementId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.updateAnnouncement
);

// 删除公告
router.delete('/announcements/:announcementId',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.deleteAnnouncement
);

// 获取系统配置
router.get('/config',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.getConfig
);

// 更新系统配置
router.put('/config',
  authMiddleware,
  roleCheckMiddleware(['admin']),
  AdminController.updateConfig
); 