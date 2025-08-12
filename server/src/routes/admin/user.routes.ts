import express from 'express';
import AdminUserController from '../../controllers/admin/user.controller';

const router = express.Router();

// Controllers → Routes: 仅做路由映射，鉴权在上层 admin/index 统一处理
router.get('/list', AdminUserController.list);
router.post('/add', AdminUserController.add);
router.post('/audit', AdminUserController.audit);
router.post('/status', AdminUserController.updateStatus);
router.post('/role', AdminUserController.assignRole);
router.post('/delete', AdminUserController.batchDelete);

export default router;