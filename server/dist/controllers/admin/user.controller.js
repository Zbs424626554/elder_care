"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserController = void 0;
const usersadmin_model_1 = require("../../models/usersadmin.model");
class AdminUserController {
    // GET /user/list
    static async list(req, res) {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const limit = parseInt(req.query.limit || '10', 10);
            const skip = (page - 1) * limit;
            const filter = {};
            if (req.query.role)
                filter.role = req.query.role;
            if (req.query.status)
                filter.status = req.query.status;
            const keyword = req.query.keyword || '';
            if (keyword) {
                filter.$or = [
                    { username: new RegExp(keyword, 'i') },
                    { realname: new RegExp(keyword, 'i') },
                    { email: new RegExp(keyword, 'i') },
                    { phone: new RegExp(keyword, 'i') },
                ];
            }
            const [users, total] = await Promise.all([
                usersadmin_model_1.UserAdmin.find(filter)
                    .select('-password')
                    .sort({ createdTime: -1 })
                    .skip(skip)
                    .limit(limit),
                usersadmin_model_1.UserAdmin.countDocuments(filter),
            ]);
            const formattedUsers = users.map((user) => ({
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
                pagePermissions: user.pagePermissions,
            }));
            return res.success({ users: formattedUsers, total, page, pages: Math.ceil(total / limit) }, '获取用户列表成功');
        }
        catch (error) {
            return res.error('获取用户列表失败', error);
        }
    }
    // POST /user/add
    static async add(req, res) {
        try {
            const { username, password, phone, email, role, realname, adminRole, pagePermissions } = req.body;
            if (!username || !password || !phone || !email || !role) {
                return res.fail(400, '缺少必要参数');
            }
            const exist = await usersadmin_model_1.UserAdmin.findOne({ $or: [{ username }, { phone }, { email }] });
            if (exist) {
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
                createdTime: new Date(),
            };
            if (realname)
                userData.realname = realname;
            if (role === 'admin' && adminRole) {
                userData.adminRole = adminRole;
                if (Array.isArray(pagePermissions))
                    userData.pagePermissions = pagePermissions;
            }
            else if (role === 'nurse') {
                userData.qualificationStatus = 'pending';
            }
            const newUser = await usersadmin_model_1.UserAdmin.create(userData);
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
                pagePermissions: newUser.pagePermissions,
            };
            return res.success({ user: userResponse }, '用户添加成功');
        }
        catch (error) {
            return res.error('添加用户失败', error);
        }
    }
    // POST /user/audit
    static async audit(req, res) {
        try {
            const { userId, action, isVerified, qualificationStatus, status } = req.body;
            if (!userId || !action)
                return res.fail(400, '缺少必要参数');
            const user = await usersadmin_model_1.UserAdmin.findById(userId);
            if (!user)
                return res.fail(404, '用户不存在');
            if (isVerified !== undefined)
                user.isVerified = isVerified;
            if (qualificationStatus)
                user.qualificationStatus = qualificationStatus;
            if (status)
                user.status = status;
            await user.save();
            return res.success(null, '用户审核成功');
        }
        catch (error) {
            return res.error('审核用户失败', error);
        }
    }
    // POST /user/status
    static async updateStatus(req, res) {
        try {
            const { userId, status, reason } = req.body;
            if (!userId || !status)
                return res.fail(400, '缺少必要参数');
            const user = await usersadmin_model_1.UserAdmin.findById(userId);
            if (!user)
                return res.fail(404, '用户不存在');
            user.status = status;
            if (status === 'blacklist' && reason)
                user.blacklistReason = reason;
            await user.save();
            return res.success(null, '用户状态更新成功');
        }
        catch (error) {
            return res.error('更新用户状态失败', error);
        }
    }
    // POST /user/role
    static async assignRole(req, res) {
        try {
            const { userId, adminRole, pagePermissions } = req.body;
            if (!userId || !adminRole)
                return res.fail(400, '缺少必要参数');
            const user = await usersadmin_model_1.UserAdmin.findById(userId);
            if (!user)
                return res.fail(404, '用户不存在');
            if (user.role !== 'admin')
                return res.fail(400, '只能为管理员用户分配角色');
            user.adminRole = adminRole;
            if (Array.isArray(pagePermissions))
                user.pagePermissions = pagePermissions;
            await user.save();
            return res.success(null, '用户角色分配成功');
        }
        catch (error) {
            return res.error('分配用户角色失败', error);
        }
    }
    // POST /user/delete
    static async batchDelete(req, res) {
        try {
            const { userIds } = req.body;
            if (!Array.isArray(userIds) || userIds.length === 0) {
                return res.fail(400, '缺少用户ID列表');
            }
            await usersadmin_model_1.UserAdmin.deleteMany({ _id: { $in: userIds } });
            return res.success(null, '批量删除用户成功');
        }
        catch (error) {
            return res.error('批量删除用户失败', error);
        }
    }
}
exports.AdminUserController = AdminUserController;
exports.default = AdminUserController;
