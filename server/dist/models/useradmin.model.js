"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdmin = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// 用户Schema
const userAdminSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['elderly', 'family', 'nurse', 'admin']
    },
    adminRole: {
        type: String,
        enum: ['super_admin', 'cs_manager', 'reviewer', 'finance', 'content_manager', 'system_admin']
    },
    avatar: {
        type: String,
        default: ''
    },
    realname: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['active', 'pending', 'frozen', 'rejected', 'blacklist']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    blacklistReason: {
        type: String
    },
    qualificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
    },
    pagePermissions: [{
            type: String
        }],
    createdTime: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});
// 密码加密中间件
userAdminSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// 密码比较方法
userAdminSchema.methods.comparePassword = async function (candidatePassword) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('比较密码:');
        console.log('- 输入密码:', candidatePassword);
        console.log('- 存储密码(前6位):', this.password.substring(0, 6) + '...');
    }
    // 开发环境下的快捷登录（仅用于测试）
    if (process.env.NODE_ENV === 'development' && candidatePassword === '123456' && this.username === 'system') {
        console.log('开发环境下使用系统管理员快捷登录');
        return true;
    }
    // 开发环境兼容：如果数据库中存的是明文密码（非bcrypt哈希），直接做明文比对
    // 常见的bcrypt哈希以 $2 开头（$2a$ / $2b$ / $2y$）
    if (process.env.NODE_ENV === 'development' && typeof this.password === 'string' && !this.password.startsWith('$2')) {
        const plainMatch = candidatePassword === this.password;
        console.log('开发环境明文密码比对结果:', plainMatch);
        return plainMatch;
    }
    const result = await bcryptjs_1.default.compare(candidatePassword, this.password);
    if (process.env.NODE_ENV !== 'production') {
        console.log('- 密码比较结果:', result);
    }
    return result;
};
// 索引
userAdminSchema.index({ username: 1 });
userAdminSchema.index({ phone: 1 });
userAdminSchema.index({ email: 1 });
userAdminSchema.index({ role: 1 });
userAdminSchema.index({ status: 1 });
exports.UserAdmin = mongoose_1.default.model('UserAdmin', userAdminSchema);
