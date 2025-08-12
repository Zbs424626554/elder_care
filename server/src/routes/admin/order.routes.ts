import express from 'express';
import AdminOrderController from '../../controllers/admin/order.controller';

const router = express.Router();

// Controllers → Routes: 仅声明路由与控制器的绑定，鉴权在上层 index 统一处理
router.get('/list', AdminOrderController.list);

export default router;