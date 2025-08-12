"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFamily = exports.isElderly = exports.isNurse = exports.isAdmin = void 0;
// 检查用户是否为管理员
const isAdmin = (req, res, next) => {
    try {
        console.log('权限检查 - 用户信息:', req.user);
        if (!req.user) {
            console.log('权限检查失败 - 用户未登录');
            return res.fail(401, '请先登录');
        }
        console.log('权限检查 - 用户角色:', req.user.role);
        // 允许多种管理员角色
        const adminRoles = ['admin', 'admin_super', 'super_admin', 'system_admin'];
        if (!adminRoles.includes(req.user.role)) {
            console.log('权限检查失败 - 用户角色不符合要求:', req.user.role);
            return res.fail(403, '您没有管理员权限');
        }
        console.log('权限检查通过');
        next();
    }
    catch (error) {
        console.error('权限检查错误:', error);
        return res.error('权限检查失败', error);
    }
};
exports.isAdmin = isAdmin;
// 检查用户是否为护工
const isNurse = (req, res, next) => {
    try {
        if (!req.user) {
            return res.fail(401, '请先登录');
        }
        if (req.user.role !== 'nurse') {
            return res.fail(403, '您没有护工权限');
        }
        next();
    }
    catch (error) {
        return res.error('权限检查失败', error);
    }
};
exports.isNurse = isNurse;
// 检查用户是否为老人
const isElderly = (req, res, next) => {
    try {
        if (!req.user) {
            return res.fail(401, '请先登录');
        }
        if (req.user.role !== 'elderly') {
            return res.fail(403, '您没有老人用户权限');
        }
        next();
    }
    catch (error) {
        return res.error('权限检查失败', error);
    }
};
exports.isElderly = isElderly;
// 检查用户是否为家属
const isFamily = (req, res, next) => {
    try {
        if (!req.user) {
            return res.fail(401, '请先登录');
        }
        if (req.user.role !== 'family') {
            return res.fail(403, '您没有家属用户权限');
        }
        next();
    }
    catch (error) {
        return res.error('权限检查失败', error);
    }
};
exports.isFamily = isFamily;
