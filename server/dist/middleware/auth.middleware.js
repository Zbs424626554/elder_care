"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.authorize = exports.refreshToken = exports.authenticateJWT = void 0;
const jwt_1 = require("../utils/jwt");
// 验证访问令牌中间件
const authenticateJWT = (req, res, next) => {
    try {
        console.log('认证中间件 - 开始验证');
        // 从请求头或cookie中获取访问令牌
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1] || req.cookies?.accessToken;
        console.log('认证中间件 - 令牌:', token ? '存在' : '不存在');
        if (!token) {
            console.log('认证中间件 - 未提供访问令牌');
            return res.status(401).json({
                code: 401,
                status: 'error',
                message: '未提供访问令牌',
                data: null
            });
        }
        try {
            // 验证访问令牌
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            console.log('认证中间件 - 令牌解码成功:', decoded);
            // 将用户信息添加到请求对象中
            req.user = {
                id: decoded.id,
                role: decoded.role
            };
            console.log('认证中间件 - 用户信息设置:', req.user);
            next();
        }
        catch (error) {
            // 访问令牌无效或已过期
            console.log('认证中间件 - 令牌验证失败:', error.message);
            let errorMessage = '访问令牌无效或已过期';
            if (error.name === 'TokenExpiredError') {
                errorMessage = '访问令牌已过期';
            }
            else if (error.name === 'JsonWebTokenError') {
                errorMessage = '访问令牌格式无效';
            }
            return res.status(403).json({
                code: 403,
                status: 'error',
                message: errorMessage,
                data: null
            });
        }
    }
    catch (error) {
        console.error('认证中间件 - 服务器错误:', error);
        return res.status(500).json({
            code: 500,
            status: 'error',
            message: '认证服务器错误',
            data: null
        });
    }
};
exports.authenticateJWT = authenticateJWT;
// 刷新令牌中间件
const refreshToken = (req, res) => {
    try {
        console.log('刷新令牌中间件 - 开始处理');
        // 优先从cookie中获取刷新令牌，其次从请求体获取
        const refreshTokenFromCookie = req.cookies?.refreshToken;
        const refreshTokenFromBody = req.body.refreshToken;
        const refreshTokenValue = refreshTokenFromCookie || refreshTokenFromBody;
        console.log('刷新令牌中间件 - 刷新令牌:', refreshTokenValue ? '存在' : '不存在');
        if (!refreshTokenValue) {
            console.log('刷新令牌中间件 - 未提供刷新令牌');
            return res.status(401).json({
                code: 401,
                status: 'error',
                message: '未提供刷新令牌',
                data: null
            });
        }
        try {
            // 验证刷新令牌
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshTokenValue);
            console.log('刷新令牌中间件 - 刷新令牌解码成功:', decoded);
            // 生成新的访问令牌
            const newAccessToken = (0, jwt_1.generateAccessToken)({
                id: decoded.id,
                role: decoded.role
            });
            console.log('刷新令牌中间件 - 新访问令牌生成成功');
            // 设置新的访问令牌到cookie
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000 // 1小时
            });
            return res.json({
                code: 200,
                status: 'success',
                message: '令牌刷新成功',
                data: { accessToken: newAccessToken }
            });
        }
        catch (error) {
            // 刷新令牌无效或已过期
            console.log('刷新令牌中间件 - 刷新令牌验证失败:', error.message);
            let errorMessage = '刷新令牌无效或已过期';
            if (error.name === 'TokenExpiredError') {
                errorMessage = '刷新令牌已过期，请重新登录';
            }
            else if (error.name === 'JsonWebTokenError') {
                errorMessage = '刷新令牌格式无效';
            }
            return res.status(403).json({
                code: 403,
                status: 'error',
                message: errorMessage,
                data: null
            });
        }
    }
    catch (error) {
        console.error('刷新令牌中间件 - 服务器错误:', error);
        return res.status(500).json({
            code: 500,
            status: 'error',
            message: '服务器错误',
            data: null
        });
    }
};
exports.refreshToken = refreshToken;
// 基于角色的授权中间件
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                code: 403,
                message: '权限不足',
                data: null
            });
        }
        next();
    };
};
exports.authorize = authorize;
// 认证中间件对象，用于路由保护和角色限制
exports.authMiddleware = {
    // 保护路由，需要用户登录
    protect: (req, res, next) => {
        try {
            // 从请求头或cookie中获取访问令牌
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(' ')[1] || req.cookies?.accessToken;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: '请登录以访问此资源'
                });
            }
            try {
                // 验证访问令牌
                const decoded = (0, jwt_1.verifyAccessToken)(token);
                // 将用户信息添加到请求对象中，避免属性重复覆盖
                const { id, role, ...rest } = decoded;
                req.user = {
                    id,
                    role,
                    ...rest
                };
                next();
            }
            catch (error) {
                // 访问令牌无效或已过期
                console.log('认证保护中间件 - 令牌验证失败:', error);
                let errorMessage = '访问令牌无效或已过期';
                if (error.name === 'TokenExpiredError') {
                    errorMessage = '登录已过期，请重新登录';
                }
                else if (error.name === 'JsonWebTokenError') {
                    errorMessage = '访问令牌格式无效';
                }
                return res.status(401).json({
                    success: false,
                    message: errorMessage
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: '服务器错误',
                error: error.message
            });
        }
    },
    // 限制特定角色访问
    restrictTo: (...roles) => {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: '您没有权限执行此操作'
                });
            }
            next();
        };
    }
};
