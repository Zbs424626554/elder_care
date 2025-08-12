"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const usersadmin_model_1 = require("../models/usersadmin.model");
const jwt_1 = require("../utils/jwt");
class AuthController {
    // 注册
    static async register(req, res) {
        try {
            const { username, password, phone, role, realname } = req.body;
            if (!username || !password || !phone || !role) {
                return res.fail(400, '缺少必要参数');
            }
            // 角色校验
            const validRoles = ['elderly', 'family', 'nurse'];
            if (!validRoles.includes(role)) {
                return res.fail(400, '角色不合法');
            }
            const exist = await usersadmin_model_1.UserAdmin.findOne({ $or: [{ username }, { phone }] });
            if (exist) {
                return res.fail(409, '用户名或手机号已存在');
            }
            const user = await usersadmin_model_1.UserAdmin.create({ username, password, phone, role, realname });
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
            return res.success({ user: userInfo }, '注册成功');
        }
        catch (error) {
            return res.error('注册失败', error);
        }
    }
    // 登录
    static async login(req, res) {
        try {
            console.log('登录请求数据:', req.body);
            const { username, phone, password } = req.body;
            if ((!username && !phone) || !password) {
                return res.fail(400, '缺少用户名或手机号或密码');
            }
            // 支持用户名或手机号登录
            const query = { $or: [{ username }, { phone }] };
            console.log('查询条件:', query);
            const user = await usersadmin_model_1.UserAdmin.findOne(query);
            console.log('查询到的用户:', user);
            if (!user) {
                return res.fail(404, '用户不存在');
            }
            const isMatch = await user.comparePassword(password);
            console.log('密码匹配结果:', isMatch);
            if (!isMatch) {
                // 开发环境兼容：若密码不匹配，且用户为 admin 且密码为 123456，则允许快速登录
                if (process.env.NODE_ENV === 'development' && username === 'admin' && password === '123456') {
                    console.log('开发环境快速登录: admin/123456');
                }
                else {
                    return res.fail(401, '密码错误');
                }
            }
            // 检查用户状态
            if (user.status !== 'active') {
                return res.fail(403, `账号状态异常: ${user.status}`);
            }
            // 生成双令牌
            const { accessToken, refreshToken } = (0, jwt_1.generateTokens)({
                id: user._id,
                role: user.role
            });
            const userInfo = {
                _id: user._id,
                username: user.username,
                phone: user.phone,
                role: user.role,
                adminRole: user.adminRole,
                realname: user.realname,
                avatar: user.avatar,
                status: user.status,
                createdTime: user.createdTime,
                pagePermissions: user.pagePermissions
            };
            // 更新最后登录时间
            await usersadmin_model_1.UserAdmin.findByIdAndUpdate(user._id, { lastLogin: new Date() });
            // 设置令牌到cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false, // 开发环境设置为false
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000 // 1小时
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // 开发环境设置为false
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
            });
            return res.success({
                accessToken,
                refreshToken,
                user: userInfo
            }, '登录成功');
        }
        catch (error) {
            console.error('登录失败:', error);
            return res.error('登录失败', error);
        }
    }
    // 获取当前用户信息（需登录）
    static async getProfile(req, res) {
        try {
            const userId = req.userId || req.body.userId;
            if (!userId) {
                return res.fail(401, '未登录');
            }
            const user = await usersadmin_model_1.UserAdmin.findById(userId).select('-password');
            if (!user) {
                return res.fail(404, '用户不存在');
            }
            return res.success({ user }, '获取用户信息成功');
        }
        catch (error) {
            return res.error('获取用户信息失败', error);
        }
    }
    // 退出登录
    static async logout(req, res) {
        try {
            // 清除cookie中的令牌
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.success(null, '退出成功');
        }
        catch (error) {
            return res.error('退出失败', error);
        }
    }
}
exports.AuthController = AuthController;
