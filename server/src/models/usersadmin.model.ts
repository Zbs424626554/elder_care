import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 用户接口
export interface IUserAdmin extends Document {
  username: string;
  password: string;
  phone: string;
  email: string;
  role: 'elderly' | 'family' | 'nurse' | 'admin';
  adminRole?: 'super_admin' | 'cs_manager' | 'reviewer' | 'finance' | 'content_manager' | 'system_admin';
  avatar?: string;
  realname?: string;
  status: 'active' | 'pending' | 'frozen' | 'rejected' | 'blacklist';
  isVerified: boolean;
  blacklistReason?: string;
  qualificationStatus?: 'pending' | 'approved' | 'rejected';
  pagePermissions?: string[];
  createdTime: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 用户Schema
const userAdminSchema = new Schema({
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
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码比较方法
userAdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
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
  
  const result = await bcrypt.compare(candidatePassword, this.password);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('- 密码比较结果:', result);
  }
  
  return result;
};

// 索引（username, phone, email 已在字段定义中设置了 unique: true，无需重复定义）
userAdminSchema.index({ role: 1 });
userAdminSchema.index({ status: 1 });

export const UserAdmin = mongoose.model<IUserAdmin>('UserAdmin', userAdminSchema, 'usersadmin'); 

// 为兼容各处 ref: 'User' 的 populate 引用，注册同一集合的别名模型
// export const User = mongoose.model<IUserAdmin>('User', userAdminSchema, 'usersadmin');