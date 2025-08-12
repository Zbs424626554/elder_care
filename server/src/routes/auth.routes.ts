import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT, refreshToken } from '../middleware/auth.middleware';

const router = Router();

// 公开路由
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', refreshToken);

// 调试路由
router.post('/debug-login', (req, res) => {
  // console.log('调试登录请求:', req.body);
  AuthController.login(req, res);
});

// 受保护路由
router.get('/profile', authenticateJWT, AuthController.getProfile);

export default router; 