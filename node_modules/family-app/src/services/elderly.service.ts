import { http } from '../utils/request';
import type { ApiResponse } from '../utils/request';
import { API_CONFIG } from '../config/api.config';

// 老人信息接口
export interface ElderlyUser {
  id: string;
  username: string;
  realname: string;
  phone: string;
  avatar: string;
  status: boolean;
  createdTime: string;
}

// 老人健康数据接口
export interface ElderlyHealthData {
  elderlyId: string;
  elderlyName: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenLevel: number;
  bloodSugar: number;
  lastUpdate: string;
  status: 'normal' | 'warning' | 'danger';
}

// 老人管理服务
export class ElderlyService {
  /**
   * 获取老人用户列表
   */
  static async getElderlyList(): Promise<ApiResponse<{ list: ElderlyUser[], total: number }>> {
    return http.get(API_CONFIG.USERS.GET_ELDERLY_LIST);
  }

  /**
   * 获取老人健康数据
   */
  static async getElderlyHealthData(elderlyId: string): Promise<ApiResponse<ElderlyHealthData>> {
    return http.get(API_CONFIG.ELDER_HEALTH.GET_ARCHIVE(elderlyId));
  }

  /**
   * 获取所有老人的健康数据
   */
  static async getAllElderlyHealthData(): Promise<ApiResponse<ElderlyHealthData[]>> {
    return http.get(API_CONFIG.ELDER_HEALTH.GET_ALL_ARCHIVES);
  }

  /**
   * 创建老人用户
   */
  static async createElderly(params: {
    username: string;
    password: string;
    phone: string;
    realname: string;
    avatar?: string;
  }): Promise<ApiResponse<ElderlyUser>> {
    return http.post(API_CONFIG.AUTH.CREATE_ELDERLY, {
      ...params,
      role: 'elderly'
    });
  }

  /**
   * 更新老人信息
   */
  static async updateElderly(elderlyId: string, data: Partial<ElderlyUser>): Promise<ApiResponse<ElderlyUser>> {
    return http.put(API_CONFIG.USERS.UPDATE_USER(elderlyId), data);
  }

  /**
   * 删除老人用户
   */
  static async deleteElderly(elderlyId: string): Promise<ApiResponse<null>> {
    return http.delete(API_CONFIG.USERS.DELETE_USER(elderlyId));
  }
}
