"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const usersadmin_model_1 = require("../models/usersadmin.model");
const payment_model_1 = require("../models/payment.model");
const router = express_1.default.Router();
// 测试路由 - 暂时绕过认证
router.get('/test', (req, res) => {
    return res.success({ message: '管理员API测试成功' }, '测试成功');
});
// 获取统计数据 - 暂时绕过认证
router.get('/statistics', async (req, res) => {
    try {
        console.log('获取统计数据请求');
        // 获取用户统计
        const totalUsers = await usersadmin_model_1.UserAdmin.countDocuments();
        const activeUsers = await usersadmin_model_1.UserAdmin.countDocuments({ status: 'active' });
        const pendingUsers = await usersadmin_model_1.UserAdmin.countDocuments({ status: 'pending' });
        const nurseUsers = await usersadmin_model_1.UserAdmin.countDocuments({ role: 'nurse' });
        const elderlyUsers = await usersadmin_model_1.UserAdmin.countDocuments({ role: 'elderly' });
        // 获取今日新增用户
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUsers = await usersadmin_model_1.UserAdmin.countDocuments({
            createdTime: { $gte: today }
        });
        // 获取本周新增用户
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekUsers = await usersadmin_model_1.UserAdmin.countDocuments({
            createdTime: { $gte: weekStart }
        });
        const statistics = {
            users: {
                total: totalUsers,
                active: activeUsers,
                pending: pendingUsers,
                today: todayUsers,
                week: weekUsers
            },
            roles: {
                nurse: nurseUsers,
                elderly: elderlyUsers,
                admin: await usersadmin_model_1.UserAdmin.countDocuments({ role: 'admin' }),
                family: await usersadmin_model_1.UserAdmin.countDocuments({ role: 'family' })
            },
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: '1.0.0'
            }
        };
        // console.log('统计数据:', statistics);
        return res.success(statistics, '获取统计数据成功');
    }
    catch (error) {
        console.error('获取统计数据失败:', error);
        return res.error('获取统计数据失败', error);
    }
});
// 支付结算：获取支付交易记录
router.get('/payments', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const pageSize = parseInt(req.query.pageSize || '10', 10);
        const skip = (page - 1) * pageSize;
        const [transactions, total] = await Promise.all([
            payment_model_1.PaymentTransaction.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize),
            payment_model_1.PaymentTransaction.countDocuments()
        ]);
        return res.success({ transactions, total, page, pages: Math.ceil(total / pageSize) }, '获取支付交易记录成功');
    }
    catch (error) {
        console.error('获取支付交易记录失败:', error);
        return res.error('获取支付交易记录失败', error);
    }
});
// 支付结算：获取提现申请列表
router.get('/withdrawals', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const pageSize = parseInt(req.query.pageSize || '10', 10);
        const skip = (page - 1) * pageSize;
        const [withdrawals, total] = await Promise.all([
            payment_model_1.Withdrawal.find()
                .sort({ requestedAt: -1 })
                .skip(skip)
                .limit(pageSize),
            payment_model_1.Withdrawal.countDocuments()
        ]);
        return res.success({ withdrawals, total, page, pages: Math.ceil(total / pageSize) }, '获取提现申请列表成功');
    }
    catch (error) {
        console.error('获取提现申请列表失败:', error);
        return res.error('获取提现申请列表失败', error);
    }
});
// 获取用户列表
router.get('/user/list', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        console.log('获取用户列表请求');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const users = await usersadmin_model_1.UserAdmin.find(filter)
            .select('-password')
            .sort({ createdTime: -1 })
            .skip(skip)
            .limit(limit);
        const total = await usersadmin_model_1.UserAdmin.countDocuments(filter);
        console.log('查询到的用户数量:', users.length);
        // 转换为前端需要的格式
        const formattedUsers = users.map(user => ({
            id: user._id,
            username: user.username,
            realname: user.realname || '',
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified,
            createdAt: user.createdTime ? user.createdTime.toISOString() : new Date().toISOString(),
            lastLogin: user.lastLogin ? user.lastLogin.toISOString() : '-',
            adminRole: user.adminRole,
            qualificationStatus: user.qualificationStatus,
            blacklistReason: user.blacklistReason,
            pagePermissions: user.pagePermissions
        }));
        console.log('格式化后的用户数据:', formattedUsers);
        return res.success({
            users: formattedUsers,
            total,
            page,
            pages: Math.ceil(total / limit)
        }, '获取用户列表成功');
    }
    catch (error) {
        console.error('获取用户列表失败:', error);
        return res.error('获取用户列表失败', error);
    }
});
// 添加用户
router.post('/user/add', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        const { username, password, phone, email, role, realname, adminRole, pagePermissions } = req.body;
        if (!username || !password || !phone || !email || !role) {
            return res.fail(400, '缺少必要参数');
        }
        // 检查用户名或手机号是否已存在
        const existingUser = await usersadmin_model_1.UserAdmin.findOne({
            $or: [{ username }, { phone }, { email }]
        });
        if (existingUser) {
            return res.fail(409, '用户名、手机号或邮箱已存在');
        }
        const defaultStatus = role === 'nurse' ? 'pending' : 'active';
        const defaultVerified = role === 'nurse' ? false : true;
        const userData = {
            username,
            password,
            phone,
            email,
            role,
            status: defaultStatus,
            isVerified: defaultVerified,
            createdTime: new Date()
        };
        if (realname) {
            userData.realname = realname;
        }
        // 如果是管理员角色，添加管理员角色和权限
        if (role === 'admin' && adminRole) {
            userData.adminRole = adminRole;
            if (pagePermissions && Array.isArray(pagePermissions)) {
                userData.pagePermissions = pagePermissions;
            }
        }
        else if (role === 'nurse') {
            userData.qualificationStatus = 'pending';
        }
        const newUser = await usersadmin_model_1.UserAdmin.create(userData);
        // 转换为前端需要的格式，不返回密码
        const userResponse = {
            id: newUser._id,
            username: newUser.username,
            realname: newUser.realname || '',
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            status: newUser.status,
            isVerified: newUser.isVerified,
            createdAt: newUser.createdTime.toISOString(),
            lastLogin: '-',
            adminRole: newUser.adminRole,
            pagePermissions: newUser.pagePermissions
        };
        return res.success({ user: userResponse }, '用户添加成功');
    }
    catch (error) {
        console.error('添加用户失败:', error);
        return res.error('添加用户失败', error);
    }
});
// 审核用户
router.post('/user/audit', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        const { userId, action, isVerified, qualificationStatus, status } = req.body;
        if (!userId || !action) {
            return res.fail(400, '缺少必要参数');
        }
        const user = await usersadmin_model_1.UserAdmin.findById(userId);
        if (!user) {
            return res.fail(404, '用户不存在');
        }
        // 更新用户信息
        if (isVerified !== undefined) {
            user.isVerified = isVerified;
        }
        if (qualificationStatus) {
            user.qualificationStatus = qualificationStatus;
        }
        if (status) {
            user.status = status;
        }
        await user.save();
        return res.success(null, '用户审核成功');
    }
    catch (error) {
        console.error('审核用户失败:', error);
        return res.error('审核用户失败', error);
    }
});
// 更新用户状态
router.post('/user/status', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        const { userId, status, reason } = req.body;
        if (!userId || !status) {
            return res.fail(400, '缺少必要参数');
        }
        const user = await usersadmin_model_1.UserAdmin.findById(userId);
        if (!user) {
            return res.fail(404, '用户不存在');
        }
        user.status = status;
        if (status === 'blacklist' && reason) {
            user.blacklistReason = reason;
        }
        await user.save();
        return res.success(null, '用户状态更新成功');
    }
    catch (error) {
        console.error('更新用户状态失败:', error);
        return res.error('更新用户状态失败', error);
    }
});
// 分配用户角色
router.post('/user/role', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        const { userId, adminRole, pagePermissions } = req.body;
        if (!userId || !adminRole) {
            return res.fail(400, '缺少必要参数');
        }
        const user = await usersadmin_model_1.UserAdmin.findById(userId);
        if (!user) {
            return res.fail(404, '用户不存在');
        }
        // 检查用户是否为管理员
        if (user.role !== 'admin') {
            return res.fail(400, '只能为管理员用户分配角色');
        }
        user.adminRole = adminRole;
        if (pagePermissions && Array.isArray(pagePermissions)) {
            user.pagePermissions = pagePermissions;
        }
        await user.save();
        return res.success(null, '用户角色分配成功');
    }
    catch (error) {
        console.error('分配用户角色失败:', error);
        return res.error('分配用户角色失败', error);
    }
});
// 批量删除用户
router.post('/user/delete', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.fail(400, '缺少用户ID列表');
        }
        await usersadmin_model_1.UserAdmin.deleteMany({ _id: { $in: userIds } });
        return res.success(null, '批量删除用户成功');
    }
    catch (error) {
        console.error('批量删除用户失败:', error);
        return res.error('批量删除用户失败', error);
    }
});
exports.default = router;
