import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt';

export class AuthController {
  // 注册
  static async register(req: Request, res: Response) {
    try {
      const { username, password, phone, role, realname } = req.body;
      if (!username || !password || !phone || !role) {
        return res.json({ code: 400, message: '缺少必要参数', data: null });
      }
      // 角色校验
      const validRoles = ['elderly', 'family', 'nurse'];
      if (!validRoles.includes(role)) {
        return res.json({ code: 400, message: '角色不合法', data: null });
      }
      const exist = await User.findOne({ $or: [{ username }, { phone }] });
      if (exist) {
        return res.json({ code: 409, message: '用户名或手机号已存在', data: null });
      }
      const user = await User.create({ username, password, phone, role, realname });
      const userInfo = {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
        realname: user.realname,
        avatar: user.avatar,
        status: user.status,
        createdTime: user.createdTime
      };
      return res.json({ code: 200, message: '注册成功', data: { user: userInfo } });
    } catch (error) {
      return res.json({ code: 500, message: '注册失败', data: null });
    }
  }

  // 登录
  static async login(req: Request, res: Response) {
    try {
      const { username, phone, password } = req.body;
      if ((!username && !phone) || !password) {
        return res.json({ code: 400, message: '缺少用户名或手机号或密码', data: null });
      }
      // 支持用户名或手机号登录
      const user = await User.findOne({ $or: [{ username }, { phone }] });
      if (!user) {
        return res.json({ code: 404, message: '用户不存在', data: null });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.json({ code: 401, message: '密码错误', data: null });
      }
      const token = generateToken({ id: user._id, role: user.role });
      const userInfo = {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
        realname: user.realname,
        avatar: user.avatar,
        status: user.status,
        createdTime: user.createdTime
      };
      // 设置token到cookie
      res.cookie('token', token, {
        httpOnly: true,
        domain: 'localhost',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.json({ code: 200, message: '登录成功', data: { token, user: userInfo } });
    } catch (error) {
      return res.json({ code: 500, message: '登录失败', data: null });
    }
  }

  // 获取当前用户信息（需登录）
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId || req.body.userId;
      if (!userId) {
        return res.status(401).json({ message: '未登录' });
      }
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ message: '获取用户信息失败', error });
    }
  }
} 