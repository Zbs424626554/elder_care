import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/jwt';

// 令牌类型接口
interface TokenPayload {
  id: string;
  role: string;
  [key: string]: any;
}

// 扩展Request类型以包含user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

// 验证访问令牌中间件
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (process.env.LOG_AUTH === 'true') {
      console.log('认证中间件 - 开始验证');
    }
    
    // 从请求头或cookie中获取访问令牌
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.cookies?.accessToken;

    if (process.env.LOG_AUTH === 'true') {
      console.log('认证中间件 - 令牌:', token ? '存在' : '不存在');
    }

    if (!token) {
      if (process.env.LOG_AUTH === 'true') {
        console.log('认证中间件 - 未提供访问令牌');
      }
      return res.status(401).json({
        code: 401,
        status: 'error',
        message: '未提供访问令牌',
        data: null
      });
    }

    try {
      // 验证访问令牌
      const decoded = verifyAccessToken(token) as TokenPayload;
      if (process.env.LOG_AUTH === 'true') {
        console.log('认证中间件 - 令牌解码成功:', decoded);
      }
      
      // 将用户信息添加到请求对象中
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      
      if (process.env.LOG_AUTH === 'true') {
        console.log('认证中间件 - 用户信息设置:', req.user);
      }
      next();
    } catch (error: any) {
      // 访问令牌无效或已过期
      if (process.env.LOG_AUTH === 'true') {
        console.log('认证中间件 - 令牌验证失败:', error.message);
      }
      
      let errorMessage = '访问令牌无效或已过期';
      if (error.name === 'TokenExpiredError') {
        errorMessage = '访问令牌已过期';
      } else if (error.name === 'JsonWebTokenError') {
        errorMessage = '访问令牌格式无效';
      }
      
      return res.status(403).json({
        code: 403,
        status: 'error',
        message: errorMessage,
        data: null
      });
    }
  } catch (error) {
    if (process.env.LOG_AUTH === 'true') {
      console.error('认证中间件 - 服务器错误:', error);
    }
    return res.status(500).json({
      code: 500,
      status: 'error',
      message: '认证服务器错误',
      data: null
    });
  }
};

// 刷新令牌中间件
export const refreshToken = (req: Request, res: Response) => {
  try {
    if (process.env.LOG_AUTH === 'true') {
      console.log('刷新令牌中间件 - 开始处理');
    }
    
    // 优先从cookie中获取刷新令牌，其次从请求体获取
    const refreshTokenFromCookie = req.cookies?.refreshToken;
    const refreshTokenFromBody = req.body.refreshToken;
    const refreshTokenValue = refreshTokenFromCookie || refreshTokenFromBody;
    if (process.env.LOG_AUTH === 'true') {
      console.log('刷新令牌中间件 - 刷新令牌:', refreshTokenValue ? '存在' : '不存在');
    }

    if (!refreshTokenValue) {
      if (process.env.LOG_AUTH === 'true') {
        console.log('刷新令牌中间件 - 未提供刷新令牌');
      }
      return res.status(401).json({
        code: 401,
        status: 'error',
        message: '未提供刷新令牌',
        data: null
      });
    }

    try {
      // 验证刷新令牌
      const decoded = verifyRefreshToken(refreshTokenValue) as TokenPayload;
      if (process.env.LOG_AUTH === 'true') {
        console.log('刷新令牌中间件 - 刷新令牌解码成功:', decoded);
      }
      
      // 生成新的访问令牌
      const newAccessToken = generateAccessToken({
        id: decoded.id,
        role: decoded.role
      });
      
      if (process.env.LOG_AUTH === 'true') {
        console.log('刷新令牌中间件 - 新访问令牌生成成功');
      }
      
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
    } catch (error: any) {
      // 刷新令牌无效或已过期
      if (process.env.LOG_AUTH === 'true') {
        console.log('刷新令牌中间件 - 刷新令牌验证失败:', error.message);
      }
      
      let errorMessage = '刷新令牌无效或已过期';
      if (error.name === 'TokenExpiredError') {
        errorMessage = '刷新令牌已过期，请重新登录';
      } else if (error.name === 'JsonWebTokenError') {
        errorMessage = '刷新令牌格式无效';
      }
      
      return res.status(403).json({
        code: 403,
        status: 'error',
        message: errorMessage,
        data: null
      });
    }
  } catch (error) {
    if (process.env.LOG_AUTH === 'true') {
      console.error('刷新令牌中间件 - 服务器错误:', error);
    }
    return res.status(500).json({
      code: 500,
      status: 'error',
      message: '服务器错误',
      data: null
    });
  }
};

// 基于角色的授权中间件
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).userRole)) {
      return res.status(403).json({
        code: 403,
        message: '权限不足',
        data: null
      });
    }
    next();
  };
};

// 认证中间件对象，用于路由保护和角色限制
export const authMiddleware = {
  // 保护路由，需要用户登录
  protect: (req: Request, res: Response, next: NextFunction) => {
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
        const decoded = verifyAccessToken(token) as TokenPayload;
        
        // 将用户信息添加到请求对象中，避免属性重复覆盖
        const { id, role, ...rest } = decoded;
        req.user = {
          id,
          role,
          ...rest
        };
        
        next();
      } catch (error) {
        // 访问令牌无效或已过期
        if (process.env.LOG_AUTH === 'true') {
          console.log('认证保护中间件 - 令牌验证失败:', error);
        }
        
        let errorMessage = '访问令牌无效或已过期';
        if ((error as any).name === 'TokenExpiredError') {
          errorMessage = '登录已过期，请重新登录';
        } else if ((error as any).name === 'JsonWebTokenError') {
          errorMessage = '访问令牌格式无效';
        }
        
        return res.status(401).json({
          success: false,
          message: errorMessage
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: '服务器错误',
        error: (error as Error).message
      });
    }
  },
  
  // 限制特定角色访问
  restrictTo: (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
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