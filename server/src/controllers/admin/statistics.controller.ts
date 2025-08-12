import { Request, Response } from 'express';
import { UserAdmin } from '../../models/usersadmin.model';

export class AdminStatisticsController {
  static async getStatistics(req: Request, res: Response) {
    try {
      const totalUsers = await UserAdmin.countDocuments();
      const activeUsers = await UserAdmin.countDocuments({ status: 'active' });
      const pendingUsers = await UserAdmin.countDocuments({ status: 'pending' });
      const nurseUsers = await UserAdmin.countDocuments({ role: 'nurse' });
      const elderlyUsers = await UserAdmin.countDocuments({ role: 'elderly' });

      // 今日
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayUsers = await UserAdmin.countDocuments({ createdTime: { $gte: today } });

      // 本周
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekUsers = await UserAdmin.countDocuments({ createdTime: { $gte: weekStart } });

      const statistics = {
        users: {
          total: totalUsers,
          active: activeUsers,
          pending: pendingUsers,
          today: todayUsers,
          week: weekUsers,
        },
        roles: {
          nurse: nurseUsers,
          elderly: elderlyUsers,
          admin: await UserAdmin.countDocuments({ role: 'admin' }),
          family: await UserAdmin.countDocuments({ role: 'family' }),
        },
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: '1.0.0',
        },
      };

      return res.success(statistics, '获取统计数据成功');
    } catch (error) {
      return res.error('获取统计数据失败', error);
    }
  }
}

export default AdminStatisticsController;


