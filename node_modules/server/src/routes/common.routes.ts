import { Router } from 'express';
import { auth as authMiddleware } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../services/upload.service';
import { CommonController } from '../controllers/common.controller';

const router = Router();

// 公共API路由
export const commonRoutes = router;

// 获取服务类型列表
router.get('/services',
  CommonController.getServices
);

// 获取服务类型详情
router.get('/services/:serviceId',
  CommonController.getServiceDetail
);

// 文件上传
router.post('/upload',
  authMiddleware,
  uploadMiddleware.single('file'),
  CommonController.uploadFile
);

// 获取通知列表
router.get('/notifications',
  authMiddleware,
  CommonController.getNotifications
);

// 标记通知为已读
router.patch('/notifications/:notificationId/read',
  authMiddleware,
  CommonController.markNotificationRead
);

// 标记所有通知为已读
router.patch('/notifications/read-all',
  authMiddleware,
  CommonController.markAllNotificationsRead
);

// 创建评价
router.post('/reviews',
  authMiddleware,
  CommonController.createReview
);

// 获取评价列表
router.get('/reviews',
  CommonController.getReviews
);

// 创建客服工单
router.post('/support-tickets',
  authMiddleware,
  CommonController.createSupportTicket
);

// 获取工单列表
router.get('/support-tickets',
  authMiddleware,
  CommonController.getSupportTickets
);

// 获取工单详情
router.get('/support-tickets/:ticketId',
  authMiddleware,
  CommonController.getSupportTicketDetail
); 