// 全局类型声明

// 用户角色类型
export type UserRole = 'elderly' | 'family' | 'nurse' | 'admin';

// 订单状态类型
export type OrderStatus = 'pending' | 'accepted' | 'started' | 'completed' | 'confirmed' | 'canceled';

// 支付状态类型
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

// 支付方式类型
export type PaymentMethod = 'alipay' | 'wechat' | 'bank';

// 护工工作状态类型
export type NurseStatus = 'available' | 'busy' | 'offline';

// 认证状态类型
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

// 健康记录类型
export type HealthRecordType = 'bloodPressure' | 'bloodSugar' | 'medication' | 'other';

// 紧急警报状态类型
export type EmergencyStatus = 'pending' | 'handled' | 'falseAlarm';

// 通知类型
export type NotificationType = 'order' | 'alert' | 'payment' | 'system';

// 工单类型
export type TicketType = 'complaint' | 'inquiry' | 'emergency' | 'other';

// 工单状态类型
export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

// 证书类型
export type CertType = 'nursing' | 'health' | 'other';

// 角色类型
export type RoleType = 'admin' | 'cs' | 'auditor' | 'finance';

// 模块类型
export type ModuleType = 'user' | 'order' | 'payment' | 'nurse' | 'content';

// 操作权限类型
export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'export';

// 服务类别类型
export type ServiceCategory = 'daily' | 'medical' | 'emergency';

// 时间单位类型
export type TimeUnit = 'hour' | 'visit';

// 健康指标类型
export type HealthMetric = 'bloodPressure' | 'bloodSugar';

// 趋势类型
export type TrendType = 'rising' | 'falling' | 'abnormal';

// 严重程度类型
export type SeverityType = 'low' | 'medium' | 'high';

// 性别类型
export type GenderType = 'male' | 'female';

// 地理位置坐标类型
export interface GeoCoordinates {
  type: 'Point';
  coordinates: [number, number]; // [经度, 纬度]
}

// 地址信息类型
export interface AddressInfo {
  formatted: string;
  province: string;
  city: string;
  district: string;
  location: GeoCoordinates;
}

// 健康信息类型
export interface HealthInfo {
  bloodPressure?: string;
  bloodSugar?: number;
  allergies?: string[];
  chronicDiseases?: string[];
}

// 用药信息类型
export interface MedicationInfo {
  name: string;
  dosage: string;
  schedule: string;
}

// 紧急联系人类型
export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

// 支付方式类型
export interface PaymentMethodInfo {
  type: PaymentMethod;
  lastFour?: string;
}

// 护工可用时间类型
export interface AvailabilityInfo {
  workDays: number[]; // 0-6 (周日到周六)
  startTime: string;   // "09:00"
  endTime: string;     // "18:00"
}

// 权限信息类型
export interface PermissionInfo {
  module: ModuleType;
  actions: ActionType[];
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 分页参数类型
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// JWT载荷类型
export interface JwtPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// 请求用户类型（扩展Express Request）
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: UserRole;
        username: string;
        phone: string;
      };
    }
  }
} 