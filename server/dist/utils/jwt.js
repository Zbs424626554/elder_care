"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.generateTokens = generateTokens;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '1h'; // 访问令牌有效期：1小时
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // 刷新令牌有效期：7天
// 输出JWT配置信息（仅在开发环境）
if (process.env.NODE_ENV !== 'production') {
    console.log('JWT配置信息:');
    console.log('- JWT_SECRET长度:', JWT_SECRET.length);
    console.log('- JWT_REFRESH_SECRET长度:', JWT_REFRESH_SECRET.length);
    console.log('- JWT_ACCESS_EXPIRES_IN:', JWT_ACCESS_EXPIRES_IN);
    console.log('- JWT_REFRESH_EXPIRES_IN:', JWT_REFRESH_EXPIRES_IN);
}
// 生成访问令牌
function generateAccessToken(payload) {
    const options = { expiresIn: JWT_ACCESS_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
// 生成刷新令牌
function generateRefreshToken(payload) {
    const options = { expiresIn: JWT_REFRESH_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, options);
}
// 验证访问令牌
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
// 验证刷新令牌
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
}
// 生成令牌对（同时生成访问令牌和刷新令牌）
function generateTokens(payload) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('生成令牌, payload:', payload);
    }
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload)
    };
}
// 兼容旧方法
function generateToken(payload) {
    return generateAccessToken(payload);
}
function verifyToken(token) {
    return verifyAccessToken(token);
}
