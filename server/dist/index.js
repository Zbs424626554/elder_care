"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const index_1 = __importDefault(require("./routes/index"));
const morgan_1 = __importDefault(require("morgan"));
const response_middleware_1 = require("./middleware/response.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jwt_1 = require("./utils/jwt");
// 设置环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '3001';
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176'
    ],
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// 生产或测试环境可通过 LOG_HTTP=false 关闭 morgan 输出
if (process.env.LOG_HTTP !== 'false') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(response_middleware_1.responseMiddleware);
// 统一未匹配路由的 404 JSON 响应（需放在业务路由之前或之后？我们放在之后、错误处理中间件之前）
// 输出服务器启动信息
if (process.env.NODE_ENV !== 'test') {
    console.log('=== 服务器启动 ===');
    console.log('环境:', process.env.NODE_ENV);
    console.log('端口:', process.env.PORT);
    console.log('时间:', new Date().toISOString());
    console.log('=================');
}
// 连接数据库
(0, db_1.connectDB)();
// 统一 API 路由聚合
app.use('/', index_1.default);
// API根路径
app.get('/api', (req, res) => {
    res.success({
        message: '智慧养老综合服务平台API',
        version: '1.0.0',
        status: 'running'
    });
});
// 测试登录路由
app.post('/api/test-login', (req, res) => {
    console.log('收到测试登录请求:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.fail(400, '缺少用户名或密码');
    }
    // 测试账号快速验证
    if (username === 'system' && password === '123456') {
        const tokens = (0, jwt_1.generateTokens)({ id: 'test-id', role: 'admin' });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.success({
            user: {
                _id: 'test-id',
                username: 'system',
                role: 'admin_super',
                adminRole: 'system_admin',
                status: 'active'
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }, '测试登录成功');
    }
    return res.fail(401, '测试登录失败');
});
// 未命中任何 /api 路由时，返回 404 JSON
app.use('/api', (req, res) => {
    return res.fail(404, '接口不存在');
});
// 全局错误处理，统一返回 JSON，并在终端打印状态码
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || '服务器内部错误';
    const path = req.originalUrl || req.url;
    // 标准化日志输出行，便于在终端检索状态码
    console.error(`[HTTP ${status}] ${req.method} ${path} - ${message}`);
    if (process.env.NODE_ENV !== 'production' && err?.stack) {
        console.error(err.stack);
    }
    if (res.headersSent) {
        return;
    }
    return res.status(status).json({
        code: status,
        status: 'error',
        message,
        data: null,
        timestamp: new Date().toISOString()
    });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
