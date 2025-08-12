"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// 公开路由
router.post('/register', auth_controller_1.AuthController.register);
router.post('/login', auth_controller_1.AuthController.login);
router.post('/logout', auth_controller_1.AuthController.logout);
router.post('/refresh-token', auth_middleware_1.refreshToken);
// 调试路由
router.post('/debug-login', (req, res) => {
    console.log('调试登录请求:', req.body);
    auth_controller_1.AuthController.login(req, res);
});
// 受保护路由
router.get('/profile', auth_middleware_1.authenticateJWT, auth_controller_1.AuthController.getProfile);
exports.default = router;
