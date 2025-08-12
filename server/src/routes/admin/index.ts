import * as express from 'express';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/role.middleware';
import AdminStatisticsController from '../../controllers/admin/statistics.controller';
import AdminUserController from '../../controllers/admin/user.controller';
import orderRoutes from './order.routes';
import serviceRoutes from './service.routes';
import userRoutes from './user.routes';
import financeRoutes from './finance.routes';

const router = express.Router();

// 统一管理员接口，采用 Controllers → Routes → Index 的风格
// 在此统一挂载鉴权中间件，子路由只负责声明绑定
router.use(authenticateJWT, isAdmin);

// 系统统计
router.get('/statistics', AdminStatisticsController.getStatistics);

// 用户管理（子路由）
router.use('/user', userRoutes);

// 订单、服务模块子路由（保持清晰的资源划分）
router.use('/orders', orderRoutes);
router.use('/services', serviceRoutes);

// 财务相关（子路由）
router.use('/finance', financeRoutes);

export default router;