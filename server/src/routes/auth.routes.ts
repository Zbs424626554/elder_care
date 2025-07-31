import { Router } from 'express';
import { auth as authMiddleware } from '../middleware/auth.middleware';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// 认证相关API路由
export const authRoutes = router;

// 用户注册
router.post('/register', AuthController.register);

// 用户登录
router.post('/login', AuthController.login);

// 获取用户信息
router.get('/profile', authMiddleware, AuthController.getProfile);

// 更新用户信息
router.put('/profile', authMiddleware, AuthController.updateProfile); 