import { Request, Response } from 'express';
import { User } from '../models/user.model';

export class UserController {
  /**
   * 测试接口 - 获取所有用户（用于调试）
   */
  static async testGetAllUsers(req: Request, res: Response) {
    try {
      const allUsers = await User.find({}).select('-password');
      console.log('数据库中的所有用户:', allUsers);

      return res.json({
        code: 200,
        message: '测试成功',
        data: {
          total: allUsers.length,
          users: allUsers
        }
      });
    } catch (error) {
      console.error('测试获取用户失败:', error);
      return res.json({
        code: 500,
        message: '测试失败',
        data: null
      });
    }
  }

  /**
   * 获取所有老人用户（用于绑定选择）
   */
  static async getAllElderlyUsers(req: Request, res: Response) {
    try {
      const { search = '' } = req.query;

      // 构建查询条件 - 获取所有老人用户，包括未绑定的
      const query: any = { role: 'elderly' };
      if (search) {
        query.$or = [
          { realname: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      // 获取老人列表
      const elderlyList = await User.find(query)
        .select('-password')
        .sort({ createdTime: -1 });

      // 格式化返回数据
      const formattedList = elderlyList.map(user => ({
        id: user._id?.toString() || '',
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
          total: formattedList.length
        }
      });
    } catch (error) {
      console.error('获取所有老人用户失败:', error);
      return res.json({
        code: 500,
        message: '获取所有老人用户失败',
        data: null
      });
    }
  }

  /**
   * 获取老人用户列表
   */
  static async getElderlyList(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // 构建查询条件 - 只获取已绑定的老人用户
      const query: any = { role: 'elderly', status: true };
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

      // 格式化返回数据，确保ObjectID正确转换为字符串
      const formattedList = elderlyList.map(user => ({
        id: user._id?.toString() || '', // 确保ObjectID转换为字符串
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

  /**
   * 绑定老人用户
   */
  static async bindElderly(req: Request, res: Response) {
    try {
      const { username } = req.body;

      // 验证必填字段
      if (!username) {
        return res.json({
          code: 400,
          message: '用户名为必填项',
          data: null
        });
      }

      // 检查用户是否存在
      const existingUser = await User.findOne({ username });

      if (!existingUser) {
        return res.json({
          code: 404,
          message: '用户不存在',
          data: null
        });
      }

      // 检查用户角色是否为elderly
      if (existingUser.role !== 'elderly') {
        return res.json({
          code: 400,
          message: '只能绑定老人用户',
          data: null
        });
      }

      // 检查用户是否已经被绑定（通过status字段）
      if (existingUser.status === true) {
        return res.json({
          code: 400,
          message: '该老人已经被绑定',
          data: null
        });
      }

      // 激活用户状态（表示已绑定）
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
          status: true
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.json({
          code: 500,
          message: '绑定失败',
          data: null
        });
      }

      // 格式化返回数据
      const formattedUser = {
        id: updatedUser._id?.toString() || '',
        username: updatedUser.username,
        realname: updatedUser.realname || updatedUser.username,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar || '',
        status: updatedUser.status,
        createdTime: updatedUser.createdTime
      };

      return res.json({
        code: 200,
        message: '绑定成功',
        data: {
          user: formattedUser
        }
      });
    } catch (error) {
      console.error('绑定老人失败:', error);
      return res.json({
        code: 500,
        message: '绑定老人失败',
        data: null
      });
    }
  }

  /**
   * 解绑老人用户
   */
  static async unbindElderly(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 验证必填字段
      if (!id) {
        return res.json({
          code: 400,
          message: '老人ID为必填项',
          data: null
        });
      }

      // 检查用户是否存在
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.json({
          code: 404,
          message: '用户不存在',
          data: null
        });
      }

      // 检查用户角色是否为elderly
      if (existingUser.role !== 'elderly') {
        return res.json({
          code: 400,
          message: '只能解绑老人用户',
          data: null
        });
      }

      // 检查用户是否已经被绑定
      if (existingUser.status !== true) {
        return res.json({
          code: 400,
          message: '该老人未被绑定',
          data: null
        });
      }

      // 解绑用户状态（设置status为false）
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          status: false
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.json({
          code: 500,
          message: '解绑失败',
          data: null
        });
      }

      // 格式化返回数据
      const formattedUser = {
        id: updatedUser._id?.toString() || '',
        username: updatedUser.username,
        realname: updatedUser.realname || updatedUser.username,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar || '',
        status: updatedUser.status,
        createdTime: updatedUser.createdTime
      };

      return res.json({
        code: 200,
        message: '解绑成功',
        data: {
          user: formattedUser
        }
      });
    } catch (error) {
      console.error('解绑老人失败:', error);
      return res.json({
        code: 500,
        message: '解绑老人失败',
        data: null
      });
    }
  }
}
