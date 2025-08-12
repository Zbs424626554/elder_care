"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIDataProcessorService = void 0;
const dataIntegration_service_1 = require("./dataIntegration.service");
const models_1 = require("../models");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * AI数据处理服务
 * 处理和分析来自DataIntegrationService的数据，用于AI模型的训练和预测
 */
class AIDataProcessorService {
    constructor() {
        this.dataIntegrationService = new dataIntegration_service_1.DataIntegrationService();
    }
    /**
     * 处理健康数据，生成潜在的健康预警
     * @returns 生成的健康预警
     */
    async processHealthData() {
        try {
            // 获取AI需要的健康数据
            const aiData = await this.dataIntegrationService.prepareDataForAI();
            const healthData = aiData.healthWarningData;
            // 模拟AI分析过程
            const potentialWarnings = [];
            for (const record of healthData) {
                // 模拟分析逻辑 - 实际应用中，这里会接入机器学习模型
                const vitalSigns = record.vitals || {};
                // 示例：基于简单规则的健康风险检测
                if (vitalSigns.heartRate && vitalSigns.heartRate > 100) {
                    potentialWarnings.push({
                        userId: record.userId,
                        warningType: 'high_heart_rate',
                        severity: 'medium',
                        description: '检测到心率异常升高',
                        data: {
                            currentHeartRate: vitalSigns.heartRate,
                            normalRange: '60-100',
                            recordedAt: record.recordedAt
                        }
                    });
                }
                if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.systolic > 140) {
                    potentialWarnings.push({
                        userId: record.userId,
                        warningType: 'high_blood_pressure',
                        severity: 'high',
                        description: '检测到血压异常升高',
                        data: {
                            currentBP: vitalSigns.bloodPressure,
                            normalRange: '收缩压<140, 舒张压<90',
                            recordedAt: record.recordedAt
                        }
                    });
                }
            }
            // 保存生成的预警
            if (potentialWarnings.length > 0) {
                await models_1.HealthWarning.insertMany(potentialWarnings);
            }
            return potentialWarnings;
        }
        catch (error) {
            console.error('Error in processHealthData:', error);
            throw error;
        }
    }
    /**
     * 基于用户数据和历史订单，生成服务推荐
     * @param userId 用户ID
     * @returns 生成的服务推荐
     */
    async generateServiceRecommendations(userId) {
        try {
            // 获取AI需要的用户行为数据
            const aiData = await this.dataIntegrationService.prepareDataForAI();
            const userBehaviorData = aiData.userBehaviorData;
            const serviceData = aiData.serviceData;
            // 查找特定用户的数据
            const userData = userBehaviorData.find(user => user._id.toString() === userId);
            if (!userData) {
                return [];
            }
            // 模拟AI推荐算法 - 实际应用中，这里会接入机器学习模型
            const recommendations = [];
            // 示例：基于历史订单和服务热度的简单推荐逻辑
            const userOrderHistory = userData.orderHistory || [];
            const userServiceTypes = new Set(userOrderHistory.map((order) => order.serviceType.toString()));
            // 推荐用户从未使用过的热门服务
            const popularServices = [...serviceData]
                .sort((a, b) => b.orderCount - a.orderCount)
                .slice(0, 5);
            for (const service of popularServices) {
                const serviceId = service._id.toString();
                if (!userServiceTypes.has(serviceId)) {
                    recommendations.push({
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        serviceType: service._id,
                        reason: '热门服务推荐',
                        confidence: 0.8,
                        description: `这是一个很受欢迎的服务，已有${service.orderCount}位用户选择。`,
                        createdAt: new Date()
                    });
                }
            }
            // 保存生成的推荐
            if (recommendations.length > 0) {
                await models_1.ServiceRecommendation.insertMany(recommendations);
            }
            return recommendations;
        }
        catch (error) {
            console.error('Error in generateServiceRecommendations:', error);
            throw error;
        }
    }
    /**
     * 分析平台数据并生成业务洞察报告
     * @returns 业务洞察报告
     */
    async generateBusinessInsights() {
        try {
            // 获取平台概览数据
            const platformOverview = await this.dataIntegrationService.getPlatformOverview();
            // 计算关键指标和趋势
            const insights = {
                summary: {
                    title: '平台业务洞察报告',
                    generatedAt: new Date(),
                    period: platformOverview.timeRange || '全部时间'
                },
                keyInsights: [
                    {
                        title: '用户增长分析',
                        description: `平台当前共有${platformOverview.userStats.totalUsers}位活跃用户。`,
                        trend: '稳定增长',
                        recommendation: '通过定向营销活动吸引更多家庭用户。'
                    },
                    {
                        title: '服务使用情况',
                        description: `平台共完成${platformOverview.orderStats.totalOrders}个服务订单，完成率${platformOverview.kpis.orderCompletionRate}%。`,
                        trend: '持续上升',
                        recommendation: '增加对高需求服务的护工资源配置。'
                    },
                    {
                        title: '用户满意度',
                        description: `平台服务平均评分为${platformOverview.feedbackStats.averageRating.toFixed(1)}（满分5分）。`,
                        trend: platformOverview.feedbackStats.averageRating > 4 ? '良好' : '需要改进',
                        recommendation: platformOverview.feedbackStats.averageRating < 4
                            ? '加强护工培训，提高服务质量。'
                            : '保持高质量服务标准，考虑推出会员激励计划。'
                    }
                ],
                revenueTrends: {
                    description: `平台总收入为${platformOverview.kpis.totalRevenue.toFixed(2)}元。`,
                    topServices: platformOverview.orderStats.ordersByService
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 3)
                        .map(service => ({
                        serviceId: service._id,
                        revenue: service.revenue,
                        orderCount: service.count
                    })),
                    recommendation: '考虑提高高收入服务的价格或推出高端定制服务。'
                },
                healthAndSafety: {
                    emergencyAlerts: platformOverview.healthStats.totalEmergencyAlerts,
                    healthWarnings: platformOverview.healthStats.totalHealthWarnings,
                    description: `平台共记录${platformOverview.healthStats.totalHealthRecords}条健康记录，触发${platformOverview.healthStats.totalHealthWarnings}次健康预警。`,
                    recommendation: '持续优化健康监测系统，提高预警准确性。'
                }
            };
            return insights;
        }
        catch (error) {
            console.error('Error in generateBusinessInsights:', error);
            throw error;
        }
    }
}
exports.AIDataProcessorService = AIDataProcessorService;
