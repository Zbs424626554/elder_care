import { http, ApiResponse } from '../utils/request';

// 统计数据接口
export interface StatisticsData {
  userStats: {
    totalUsers: number;
    elderlyUsers: number;
    familyUsers: number;
    nurseUsers: number;
    adminUsers: number;
    activeUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  };
  orderStats: {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    disputedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    orderCountToday: number;
    orderCountThisWeek: number;
    orderCountThisMonth: number;
    revenueToday: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
  };
  serviceStats: {
    popularServices: Array<{
      id: string;
      name: string;
      count: number;
      revenue: number;
    }>;
    serviceCategories: Array<{
      category: string;
      count: number;
    }>;
  };
  performanceStats: {
    avgResponseTime: number;
    nurseAcceptanceRate: number;
    complaintRate: number;
    avgRating: number;
    resolvedComplaintsRate: number;
  };
}

// 用户信息接口
export interface AdminUserInfo {
  id: string;
  username: string;
  phone: string;
  role: string;
  avatar?: string;
  realname?: string;
  status: boolean;
  createdTime: string;
}

// 订单信息接口
export interface AdminOrderInfo {
  id: string;
  orderNumber: string;
  serviceType: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// 服务类型接口
export interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  timeUnit: string;
  category: string;
}

// 后台管理服务类
export class AdminService {
  /**
   * 获取统计数据
   */
  static async getStatistics(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<StatisticsData>> {
    return http.get('/admin/statistics', { params });
  }

  /**
   * 获取用户列表
   */
  static async getUsers(params?: {
    role?: string;
    status?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: AdminUserInfo[]; total: number; page: number; limit: number }>> {
    return http.get('/admin/users', { params });
  }

  /**
   * 获取用户详情
   */
  static async getUserDetail(userId: string): Promise<ApiResponse<AdminUserInfo>> {
    return http.get(`/admin/users/${userId}`);
  }

  /**
   * 更新用户状态
   */
  static async updateUserStatus(userId: string, status: boolean): Promise<ApiResponse<{ userId: string; status: boolean }>> {
    return http.patch(`/admin/users/${userId}/status`, { status });
  }

  /**
   * 审核护工资质
   */
  static async verifyCertification(certId: string, verified: boolean, reason?: string): Promise<ApiResponse<any>> {
    return http.patch(`/admin/certifications/${certId}/verify`, { verified, reason });
  }

  /**
   * 获取资质审核列表
   */
  static async getCertifications(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ certifications: any[]; total: number; page: number; limit: number }>> {
    return http.get('/admin/certifications', { params });
  }

  /**
   * 获取订单列表
   */
  static async getOrders(params?: {
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ orders: AdminOrderInfo[]; total: number; page: number; limit: number }>> {
    return http.get('/admin/orders', { params });
  }

  /**
   * 获取订单详情
   */
  static async getOrderDetail(orderId: string): Promise<ApiResponse<AdminOrderInfo>> {
    return http.get(`/admin/orders/${orderId}`);
  }

  /**
   * 处理异常订单
   */
  static async handleOrder(orderId: string, action: string, reason?: string): Promise<ApiResponse<{ orderId: string; action: string }>> {
    return http.patch(`/admin/orders/${orderId}/handle`, { action, reason });
  }

  /**
   * 创建服务类型
   */
  static async createService(data: Omit<ServiceType, 'id'>): Promise<ApiResponse<ServiceType>> {
    return http.post('/admin/services', data);
  }

  /**
   * 更新服务类型
   */
  static async updateService(serviceId: string, data: Partial<ServiceType>): Promise<ApiResponse<ServiceType>> {
    return http.put(`/admin/services/${serviceId}`, data);
  }

  /**
   * 删除服务类型
   */
  static async deleteService(serviceId: string): Promise<ApiResponse<{ serviceId: string }>> {
    return http.delete(`/admin/services/${serviceId}`);
  }

  /**
   * 获取评价列表
   */
  static async getReviews(params?: {
    page?: number;
    limit?: number;
    rating?: number;
    hasAppeal?: boolean;
    appealStatus?: string;
  }): Promise<ApiResponse<{ reviews: any[]; total: number; page: number; limit: number }>> {
    return http.get('/api/reviews', { params });
  }

  /**
   * 获取评价详情
   */
  static async getReviewDetail(reviewId: string): Promise<ApiResponse<any>> {
    return http.get(`/api/reviews/${reviewId}`);
  }

  /**
   * 处理评价申诉
   */
  static async handleReviewAppeal(reviewId: string, action: string, reason?: string): Promise<ApiResponse<{ reviewId: string; action: string }>> {
    return http.put(`/api/reviews/${reviewId}/appeal`, { appealStatus: action, appealResolution: reason });
  }

  /**
   * 获取投诉列表
   */
  static async getComplaints(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<{ complaints: any[]; total: number; page: number; limit: number }>> {
    return http.get('/api/complaints', { params });
  }

  /**
   * 获取投诉详情
   */
  static async getComplaintDetail(complaintId: string): Promise<ApiResponse<any>> {
    return http.get(`/api/complaints/${complaintId}`);
  }

  /**
   * 处理投诉
   */
  static async handleComplaint(complaintId: string, action: string, response?: string): Promise<ApiResponse<{ complaintId: string; action: string }>> {
    return http.put(`/api/complaints/${complaintId}/status`, { status: action, resolutionNotes: response });
  }

  /**
   * 处理客服工单
   */
  static async processSupportTicket(ticketId: string, status: string, response?: string): Promise<ApiResponse<any>> {
    return http.patch(`/admin/support-tickets/${ticketId}`, { status, response });
  }

  /**
   * 处理提现申请
   */
  static async processWithdrawal(withdrawalId: string, action: string, reason?: string): Promise<ApiResponse<{ withdrawalId: string; action: string }>> {
    return http.patch(`/admin/withdrawals/${withdrawalId}/process`, { action, reason });
  }

  /**
   * 发布平台公告
   */
  static async createAnnouncement(data: { title: string; content: string; type: string }): Promise<ApiResponse<any>> {
    return http.post('/admin/announcements', data);
  }

  /**
   * 获取公告列表
   */
  static async getAnnouncements(params?: {
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ announcements: any[]; total: number; page: number; limit: number }>> {
    return http.get('/admin/announcements', { params });
  }

  /**
   * 更新公告
   */
  static async updateAnnouncement(announcementId: string, data: { title: string; content: string; type: string }): Promise<ApiResponse<any>> {
    return http.put(`/admin/announcements/${announcementId}`, data);
  }

  /**
   * 删除公告
   */
  static async deleteAnnouncement(announcementId: string): Promise<ApiResponse<{ announcementId: string }>> {
    return http.delete(`/admin/announcements/${announcementId}`);
  }

  /**
   * 获取系统配置
   */
  static async getConfig(): Promise<ApiResponse<{
    platformSettings: any;
    paymentSettings: any;
    notificationSettings: any;
  }>> {
    return http.get('/admin/config');
  }

  /**
   * 更新系统配置
   */
  static async updateConfig(data: {
    platformSettings: any;
    paymentSettings: any;
    notificationSettings: any;
  }): Promise<ApiResponse<any>> {
    return http.put('/admin/config', data);
  }

  /**
   * 导出统计数据
   */
  static async exportStatistics(params?: { 
    startDate?: string; 
    endDate?: string; 
    format?: 'csv' | 'excel' | 'pdf' 
  }): Promise<any> {
    return http.get('/admin/statistics/export', { 
      params, 
      responseType: 'blob',
    });
  }

  /**
   * 导出用户数据
   */
  static async exportUsers(params?: { 
    role?: string;
    status?: boolean;
    format?: 'csv' | 'excel' | 'pdf'
  }): Promise<any> {
    return http.get('/admin/users/export', { 
      params, 
      responseType: 'blob',
    });
  }

  /**
   * 导出订单数据
   */
  static async exportOrders(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'excel' | 'pdf'
  }): Promise<any> {
    return http.get('/admin/orders/export', { 
      params, 
      responseType: 'blob',
    });
  }
} 