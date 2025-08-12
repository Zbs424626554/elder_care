"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIntegrationService = void 0;
const models_1 = require("../models");
/**
 * 数据汇总服务
 * 负责汇集所有业务数据，为运营决策和AI模块提供数据基础
 */
class DataIntegrationService {
    /**
     * 获取用户相关综合数据
     * @param filters 过滤条件
     * @returns 用户相关数据聚合
     */
    async getUserAnalytics(filters = {}) {
        try {
            const userCount = await models_1.User.countDocuments(filters);
            const usersByRole = await models_1.User.aggregate([
                { $match: filters },
                { $group: { _id: "$role", count: { $sum: 1 } } }
            ]);
            return {
                totalUsers: userCount,
                usersByRole
            };
        }
        catch (error) {
            console.error('Error in getUserAnalytics:', error);
            throw error;
        }
    }
    /**
     * 获取服务与订单相关综合数据
     * @param timeRange 时间范围
     * @returns 订单相关数据聚合
     */
    async getOrderAnalytics(timeRange = {}) {
        try {
            const query = {};
            if (timeRange.startDate || timeRange.endDate) {
                query.createdAt = {};
                if (timeRange.startDate)
                    query.createdAt.$gte = timeRange.startDate;
                if (timeRange.endDate)
                    query.createdAt.$lte = timeRange.endDate;
            }
            const totalOrders = await models_1.Order.countDocuments(query);
            const totalRevenue = await models_1.Order.aggregate([
                { $match: query },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]);
            const ordersByStatus = await models_1.Order.aggregate([
                { $match: query },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);
            const ordersByService = await models_1.Order.aggregate([
                { $match: query },
                { $group: { _id: "$serviceType", count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } }
            ]);
            return {
                totalOrders,
                totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
                ordersByStatus,
                ordersByService
            };
        }
        catch (error) {
            console.error('Error in getOrderAnalytics:', error);
            throw error;
        }
    }
    /**
     * 获取健康与安全相关综合数据
     * @param filters 过滤条件
     * @returns 健康数据聚合
     */
    async getHealthAnalytics(filters = {}) {
        try {
            const healthRecordsCount = await models_1.HealthRecord.countDocuments(filters);
            const emergencyAlertsCount = await models_1.EmergencyAlert.countDocuments(filters);
            const healthWarnings = await models_1.HealthWarning.countDocuments(filters);
            const emergencyByType = await models_1.EmergencyAlert.aggregate([
                { $match: filters },
                { $group: { _id: "$alertType", count: { $sum: 1 } } }
            ]);
            return {
                totalHealthRecords: healthRecordsCount,
                totalEmergencyAlerts: emergencyAlertsCount,
                totalHealthWarnings: healthWarnings,
                emergencyByType
            };
        }
        catch (error) {
            console.error('Error in getHealthAnalytics:', error);
            throw error;
        }
    }
    /**
     * 获取评价与投诉相关综合数据
     * @param timeRange 时间范围
     * @returns 评价投诉数据聚合
     */
    async getFeedbackAnalytics(timeRange = {}) {
        try {
            const query = {};
            if (timeRange.startDate || timeRange.endDate) {
                query.createdAt = {};
                if (timeRange.startDate)
                    query.createdAt.$gte = timeRange.startDate;
                if (timeRange.endDate)
                    query.createdAt.$lte = timeRange.endDate;
            }
            const reviewsCount = await models_1.Review.countDocuments(query);
            const complaintsCount = await models_1.Complaint.countDocuments(query);
            const averageRating = await models_1.Review.aggregate([
                { $match: query },
                { $group: { _id: null, avgRating: { $avg: "$rating" } } }
            ]);
            const reviewsByRating = await models_1.Review.aggregate([
                { $match: query },
                { $group: { _id: "$rating", count: { $sum: 1 } } }
            ]);
            const complaintsByStatus = await models_1.Complaint.aggregate([
                { $match: query },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);
            return {
                totalReviews: reviewsCount,
                totalComplaints: complaintsCount,
                averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0,
                reviewsByRating,
                complaintsByStatus
            };
        }
        catch (error) {
            console.error('Error in getFeedbackAnalytics:', error);
            throw error;
        }
    }
    /**
     * 为AI模块准备综合数据
     * 将各类业务数据整合，用于AI分析和预测
     * @returns AI模块所需数据集合
     */
    async prepareDataForAI() {
        try {
            // 为AI模型准备用户行为数据
            const userBehaviorData = await models_1.User.aggregate([
                {
                    $lookup: {
                        from: "orders",
                        localField: "_id",
                        foreignField: "userId",
                        as: "orders"
                    }
                },
                {
                    $lookup: {
                        from: "healthrecords",
                        localField: "_id",
                        foreignField: "userId",
                        as: "healthRecords"
                    }
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "userId",
                        as: "reviews"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        role: 1,
                        createdAt: 1,
                        orderCount: { $size: "$orders" },
                        orderHistory: "$orders",
                        healthRecordCount: { $size: "$healthRecords" },
                        recentHealthData: { $slice: ["$healthRecords", -5] },
                        reviewCount: { $size: "$reviews" },
                        averageRating: { $avg: "$reviews.rating" }
                    }
                }
            ]);
            // 为推荐系统准备服务数据
            const serviceData = await models_1.Order.aggregate([
                {
                    $lookup: {
                        from: "servicetypes",
                        localField: "serviceType",
                        foreignField: "_id",
                        as: "serviceDetails"
                    }
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "reviews"
                    }
                },
                {
                    $group: {
                        _id: "$serviceType",
                        orderCount: { $sum: 1 },
                        totalRevenue: { $sum: "$totalAmount" },
                        averageRating: { $avg: "$reviews.rating" },
                        serviceDetails: { $first: "$serviceDetails" }
                    }
                }
            ]);
            // 健康预警数据准备
            const healthWarningData = await models_1.HealthRecord.aggregate([
                {
                    $lookup: {
                        from: "healthwarnings",
                        localField: "userId",
                        foreignField: "userId",
                        as: "warnings"
                    }
                },
                {
                    $match: { "warnings": { $ne: [] } }
                },
                {
                    $project: {
                        userId: 1,
                        vitals: 1,
                        recordedAt: 1,
                        warningCount: { $size: "$warnings" },
                        warningTypes: "$warnings.warningType"
                    }
                }
            ]);
            return {
                userBehaviorData,
                serviceData,
                healthWarningData
            };
        }
        catch (error) {
            console.error('Error in prepareDataForAI:', error);
            throw error;
        }
    }
    /**
     * 获取平台整体运营数据汇总
     * @param timeRange 时间范围
     * @returns 平台运营综合数据
     */
    async getPlatformOverview(timeRange = {}) {
        try {
            const query = {};
            if (timeRange.startDate || timeRange.endDate) {
                query.createdAt = {};
                if (timeRange.startDate)
                    query.createdAt.$gte = timeRange.startDate;
                if (timeRange.endDate)
                    query.createdAt.$lte = timeRange.endDate;
            }
            const [userAnalytics, orderAnalytics, healthAnalytics, feedbackAnalytics] = await Promise.all([
                this.getUserAnalytics(query),
                this.getOrderAnalytics(timeRange),
                this.getHealthAnalytics(query),
                this.getFeedbackAnalytics(timeRange)
            ]);
            // 计算关键绩效指标
            const completedOrders = orderAnalytics.ordersByStatus.find(item => item._id === 'completed');
            const completedOrdersCount = completedOrders ? completedOrders.count : 0;
            const totalOrdersCount = orderAnalytics.totalOrders;
            const orderCompletionRate = totalOrdersCount > 0 ?
                (completedOrdersCount / totalOrdersCount * 100).toFixed(2) : 0;
            const averageSatisfaction = feedbackAnalytics.averageRating;
            return {
                timeRange,
                userStats: userAnalytics,
                orderStats: orderAnalytics,
                healthStats: healthAnalytics,
                feedbackStats: feedbackAnalytics,
                kpis: {
                    orderCompletionRate,
                    averageSatisfaction,
                    totalRevenue: orderAnalytics.totalRevenue,
                    activeUserCount: userAnalytics.totalUsers,
                    emergencyResponseCount: healthAnalytics.totalEmergencyAlerts
                }
            };
        }
        catch (error) {
            console.error('Error in getPlatformOverview:', error);
            throw error;
        }
    }
}
exports.DataIntegrationService = DataIntegrationService;
