import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  
  // 从 cookie 中获取 token
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  try {
    // 使用你现有的 verifyToken 函数
    const decoded = verifyToken(token) as any;
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: '无效的认证令牌' });
  }
};