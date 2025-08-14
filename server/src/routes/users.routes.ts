import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// 获取老人用户列表
router.get('/role/elderly', authenticateToken, UserController.getElderlyList);

// 获取用户信息
router.get('/:id', authenticateToken, UserController.getUserById);

// 更新用户信息
router.put('/:id', authenticateToken, UserController.updateUser);

// 删除用户
router.delete('/:id', authenticateToken, UserController.deleteUser);

// 获取所有用户（管理员权限）
router.get('/', authenticateToken, UserController.getAllUsers);

export default router;
