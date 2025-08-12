"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMiddleware = void 0;
/**
 * 统一响应格式中间件
 * 扩展 Response 对象，添加标准化响应方法
 */
const responseMiddleware = (req, res, next) => {
    // 成功响应
    res.success = (data = null, message = '操作成功') => {
        return res.status(200).json({
            code: 200,
            status: 'success',
            message,
            data,
            timestamp: new Date().toISOString()
        });
    };
    // 失败响应
    res.fail = (code = 400, message = '操作失败', data = null) => {
        return res.status(code || 400).json({
            code,
            status: 'error',
            message,
            data,
            timestamp: new Date().toISOString()
        });
    };
    // 服务器错误响应
    res.error = (message = '服务器内部错误', error = null) => {
        console.error('[Server Error]:', error);
        return res.status(500).json({
            code: 500,
            status: 'error',
            message,
            data: null,
            timestamp: new Date().toISOString()
        });
    };
    next();
};
exports.responseMiddleware = responseMiddleware;
