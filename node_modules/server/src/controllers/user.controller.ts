import { Request, Response } from 'express';
import { User } from '../models/user.model';

export class UserController {
  /**
   * 获取老人用户列表
   */
  static async getElderlyList(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // 构建查询条件
      const query: any = { role: 'elderly' };
      if (search) {
        query.$or = [
          { realname: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      // 获取总数
      const total = await User.countDocuments(query);

      // 获取老人列表
      const elderlyList = await User.find(query)
        .select('-password')
        .sort({ createdTime: -1 })
        .skip(skip)
        .limit(Number(limit));

      // 格式化返回数据
      const formattedList = elderlyList.map(user => ({
        id: user._id,
        username: user.username,
        realname: user.realname || user.username,
        phone: user.phone,
        avatar: user.avatar || '',
        status: user.status,
        createdTime: user.createdTime
      }));

      return res.json({
        code: 200,
        message: '获取成功',
        data: {
          list: formattedList,
          total,
          page: Number(page),
          limit: Number(limit)
        }
      });
    } catch (error) {
      console.error('获取老人列表失败:', error);
      return res.json({
        code: 500,
        message: '获取老人列表失败',
        data: null
      });
    }
  }

  /**
   * 根据ID获取用户信息
   */
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.json({
          code: 404,
          message: '用户不存在',
          data: null
        });
      }

      return res.json({
        code: 200,
        message: '获取成功',
        data: { user }
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return res.json({
        code: 500,
        message: '获取用户信息失败',
        data: null
      });
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // 不允许更新敏感字段
      delete updateData.password;
      delete updateData.role;
      delete updateData.username;

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.json({
          code: 404,
          message: '用户不存在',
          data: null
        });
      }

      return res.json({
        code: 200,
        message: '更新成功',
        data: { user }
      });
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return res.json({
        code: 500,
        message: '更新用户信息失败',
        data: null
      });
    }
  }

  /**
   * 删除用户
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.json({
          code: 404,
          message: '用户不存在',
          data: null
        });
      }

      return res.json({
        code: 200,
        message: '删除成功',
        data: null
      });
    } catch (error) {
      console.error('删除用户失败:', error);
      return res.json({
        code: 500,
        message: '删除用户失败',
        data: null
      });
    }
  }

  /**
   * 获取所有用户（管理员权限）
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, role, search = '' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // 构建查询条件
      const query: any = {};
      if (role) {
        query.role = role;
      }
      if (search) {
        query.$or = [
          { realname: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      // 获取总数
      const total = await User.countDocuments(query);

      // 获取用户列表
      const users = await User.find(query)
        .select('-password')
        .sort({ createdTime: -1 })
        .skip(skip)
        .limit(Number(limit));

      return res.json({
        code: 200,
        message: '获取成功',
        data: {
          list: users,
          total,
          page: Number(page),
          limit: Number(limit)
        }
      });
    } catch (error) {
      console.error('获取用户列表失败:', error);
      return res.json({
        code: 500,
        message: '获取用户列表失败',
        data: null
      });
    }
  }
}
