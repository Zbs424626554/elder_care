import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 基础用户接口
export interface IBaseUser extends Document {
  role: 'elderly' | 'family' | 'nurse' | 'admin';
  username: string;
  password: string;
  avatar: string;
  phone: string;
  status: boolean;
  createdTime: Date;
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 老人用户接口
export interface IElderlyUser extends IBaseUser {
  role: 'elderly';
  realname: string;
  gender: 'male' | 'female';
  age: number;
  idCard?: string;
  healthInfo: {
    bloodPressure?: string;
    bloodSugar?: number;
    allergies?: string[];
    chronicDiseases?: string[];
  };
  medications: {
    name: string;
    dosage: string;
    schedule: string;
  }[];
  emergencyContacts: {
    name: string;
    phone: string;
    relation: string;
  }[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  familyIds: mongoose.Types.ObjectId[];
  collect: mongoose.Types.ObjectId[];
}

// 家属用户接口
export interface IFamilyUser extends IBaseUser {
  role: 'family';
  realname: string;
  idCard: string;
  familyIds: mongoose.Types.ObjectId[];
  paymentMethods: {
    type: 'alipay' | 'wechat' | 'bank';
    lastFour?: string;
  }[];
}

// 护工用户接口
export interface INurseUser extends IBaseUser {
  role: 'nurse';
  realname: string;
  idCard: string;
  skillTags: string[];
  rating: number;
  content: string;
  status: 'available' | 'busy' | 'offline';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  certificates: mongoose.Types.ObjectId[];
  serviceAreas: string[];
  availability: {
    workDays: number[];
    startTime: string;
    endTime: string;
  };
  responseRate: number;
  deviceToken?: string;
}

// 管理员用户接口
export interface IAdminUser extends IBaseUser {
  role: 'admin';
  permissions: string[];
}

// 基础用户Schema
const baseUserSchema = new Schema({
  role: {
    type: String,
    required: true,
    enum: ['elderly', 'family', 'nurse', 'admin']
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    default: true
  },
  createdTime: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  discriminatorKey: 'role'
});

// 创建索引
baseUserSchema.index({ phone: 1 });
baseUserSchema.index({ role: 1 });

// 密码加密中间件
baseUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// 密码比对方法
baseUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 创建基础用户模型
export const User = mongoose.model<IBaseUser>('User', baseUserSchema);

// 老人用户Schema
const elderlyUserSchema = new Schema({
  realname: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  idCard: {
    type: String
  },
  healthInfo: {
    bloodPressure: {
      type: String
    },
    bloodSugar: {
      type: Number
    },
    allergies: {
      type: [String]
    },
    chronicDiseases: {
      type: [String]
    }
  },
  medications: [{
    name: { type: String },
    dosage: { type: String },
    schedule: { type: String }
  }],
  emergencyContacts: [{
    name: { type: String },
    phone: { type: String },
    relation: { type: String }
  }],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
  },
  familyIds: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  collect: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }
});

// 家属用户Schema
const familyUserSchema = new Schema({
  realname: {
    type: String,
    required: true
  },
  idCard: {
    type: String,
    required: true
  },
  familyIds: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  paymentMethods: [{
    type: {
      type: String,
      enum: ['alipay', 'wechat', 'bank']
    },
    lastFour: {
      type: String
    }
  }]
});

// 护工用户Schema
const nurseUserSchema = new Schema({
  realname: {
    type: String,
    required: true
  },
  idCard: {
    type: String,
    required: true,
    unique: true
  },
  skillTags: {
    type: [String]
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  content: {
    type: String
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  certificates: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Certification' }]
  },
  serviceAreas: {
    type: [String]
  },
  availability: {
    workDays: {
      type: [Number]
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    }
  },
  responseRate: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  deviceToken: {
    type: String
  }
});

// 管理员用户Schema
const adminUserSchema = new Schema({
  permissions: {
    type: [String]
  }
});

// 创建用户类型模型
export const ElderlyProfile = User.discriminator<IElderlyUser>('ElderlyUser', elderlyUserSchema);
export const FamilyProfile = User.discriminator<IFamilyUser>('FamilyUser', familyUserSchema);
export const NurseProfile = User.discriminator<INurseUser>('NurseUser', nurseUserSchema);
export const AdminProfile = User.discriminator<IAdminUser>('AdminUser', adminUserSchema); 