// 导出所有模型
import { UserAdmin, IUserAdmin } from './usersadmin.model';
import { ServiceType, IServiceType } from './service.model';
import { Order, IOrder } from './order.model';
import { PaymentTransaction, IPaymentTransaction, Withdrawal, IWithdrawal } from './payment.model';
import { SupportTicket, ISupportTicket } from './support.model';
import { DailyStatistics, IDailyStatistics, MonthlyStatistics, IMonthlyStatistics } from './statistics.model';
import { Config, IConfig } from './config.model';
import { SystemConfig, ISystemConfig } from './systemConfig.model';
import { Announcement, IAnnouncement } from './announcement.model';
import { Review } from './review.model';
import { Complaint } from './complaint.model';
import { Certification } from './certification.model';
import { Notification } from './notification.model';
import { Role, IRole } from './role.model';

// 导出所有模型
export {
  // 用户相关
  UserAdmin,
  IUserAdmin,
  
  // 服务相关
  ServiceType,
  IServiceType,
  
  // 订单相关
  Order,
  IOrder,
  
  // 支付相关
  PaymentTransaction,
  IPaymentTransaction,
  Withdrawal,
  IWithdrawal,
  
  // 工单相关
  SupportTicket,
  ISupportTicket,
  
  // 统计相关
  DailyStatistics,
  IDailyStatistics,
  MonthlyStatistics,
  IMonthlyStatistics,
  
  // 配置相关
  Config,
  IConfig,
  SystemConfig,
  ISystemConfig,
  
  // 公告相关
  Announcement,
  IAnnouncement,
  
  // 角色权限相关
  Role,
  IRole,
  
  // 其他模型
  Review,
  Complaint,
  Certification,
  Notification
};

// 初始化数据库连接
import mongoose from 'mongoose';

export const connectDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB连接成功');
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    process.exit(1);
  }
};

// 关闭数据库连接
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB连接已关闭');
  } catch (error) {
    console.error('关闭MongoDB连接失败:', error);
  }
}; 