import { Request, Response, NextFunction } from 'express';

/**
 * 统一响应格式中间件
 * 扩展 Response 对象，添加标准化响应方法
 */
export const responseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 成功响应
  res.success = (data: any = null, message: string = '操作成功') => {
    return res.status(200).json({
      code: 200,
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };

  // 失败响应
  res.fail = (code: number = 400, message: string = '操作失败', data: any = null) => {
    return res.status(code || 400).json({
      code,
      status: 'error',
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };

  // 服务器错误响应
  res.error = (message: string = '服务器内部错误', error: any = null) => {
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

// 扩展 Response 接口以支持自定义方法
declare global {
  namespace Express {
    interface Response {
      success(data?: any, message?: string): Response;
      fail(code?: number, message?: string, data?: any): Response;
      error(message?: string, error?: any): Response;
    }
  }
} 