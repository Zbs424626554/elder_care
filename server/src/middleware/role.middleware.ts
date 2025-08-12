import { Request, Response, NextFunction } from 'express';

// 检查用户是否为管理员
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (process.env.LOG_AUTH === 'true') {
      console.log('权限检查 - 用户信息:', req.user);
    }
    
    if (!req.user) {
      if (process.env.LOG_AUTH === 'true') {
        console.log('权限检查失败 - 用户未登录');
      }
      return res.fail(401, '请先登录');
    }

    if (process.env.LOG_AUTH === 'true') {
      console.log('权限检查 - 用户角色:', req.user.role);
    }
    
    // 允许多种管理员角色
    const adminRoles = ['admin', 'admin_super', 'super_admin', 'system_admin'];
    if (!adminRoles.includes(req.user.role)) {
      if (process.env.LOG_AUTH === 'true') {
        console.log('权限检查失败 - 用户角色不符合要求:', req.user.role);
      }
      return res.fail(403, '您没有管理员权限');
    }

    if (process.env.LOG_AUTH === 'true') {
      console.log('权限检查通过');
    }
    next();
  } catch (error: any) {
    if (process.env.LOG_AUTH === 'true') {
      console.error('权限检查错误:', error);
    }
    return res.error('权限检查失败', error);
  }
};

// 检查用户是否为护工
export const isNurse = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.fail(401, '请先登录');
    }

    if (req.user.role !== 'nurse') {
      return res.fail(403, '您没有护工权限');
    }

    next();
  } catch (error: any) {
    return res.error('权限检查失败', error);
  }
};

// 检查用户是否为老人
export const isElderly = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.fail(401, '请先登录');
    }

    if (req.user.role !== 'elderly') {
      return res.fail(403, '您没有老人用户权限');
    }

    next();
  } catch (error: any) {
    return res.error('权限检查失败', error);
  }
};

// 检查用户是否为家属
export const isFamily = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.fail(401, '请先登录');
    }

    if (req.user.role !== 'family') {
      return res.fail(403, '您没有家属用户权限');
    }

    next();
  } catch (error: any) {
    return res.error('权限检查失败', error);
  }
};