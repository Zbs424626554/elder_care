"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStatisticsController = void 0;
const usersadmin_model_1 = require("../../models/usersadmin.model");
class AdminStatisticsController {
    static async getStatistics(req, res) {
        try {
            const totalUsers = await usersadmin_model_1.UserAdmin.countDocuments();
            const activeUsers = await usersadmin_model_1.UserAdmin.countDocuments({ status: 'active' });
            const pendingUsers = await usersadmin_model_1.UserAdmin.countDocuments({ status: 'pending' });
            const nurseUsers = await usersadmin_model_1.UserAdmin.countDocuments({ role: 'nurse' });
            const elderlyUsers = await usersadmin_model_1.UserAdmin.countDocuments({ role: 'elderly' });
            // 今日
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayUsers = await usersadmin_model_1.UserAdmin.countDocuments({ createdTime: { $gte: today } });
            // 本周
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);
            const weekUsers = await usersadmin_model_1.UserAdmin.countDocuments({ createdTime: { $gte: weekStart } });
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
                    admin: await usersadmin_model_1.UserAdmin.countDocuments({ role: 'admin' }),
                    family: await usersadmin_model_1.UserAdmin.countDocuments({ role: 'family' }),
                },
                system: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    version: '1.0.0',
                },
            };
            return res.success(statistics, '获取统计数据成功');
        }
        catch (error) {
            return res.error('获取统计数据失败', error);
        }
    }
}
exports.AdminStatisticsController = AdminStatisticsController;
exports.default = AdminStatisticsController;
