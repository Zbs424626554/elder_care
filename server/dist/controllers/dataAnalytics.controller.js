"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAnalyticsController = void 0;
const dataIntegration_service_1 = require("../services/dataIntegration.service");
const dataIntegrationService = new dataIntegration_service_1.DataIntegrationService();
/**
 * 数据分析控制器
 * 提供各类数据汇总和分析的API接口
 */
class DataAnalyticsController {
    /**
     * 获取平台数据概览
     * @param req 请求对象，可包含时间范围参数
     * @param res 响应对象
     */
    async getPlatformOverview(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const timeRange = {};
            if (startDate)
                timeRange.startDate = new Date(startDate);
            if (endDate)
                timeRange.endDate = new Date(endDate);
            const overview = await dataIntegrationService.getPlatformOverview(timeRange);
            res.status(200).json({
                success: true,
                data: overview
            });
        }
        catch (error) {
            console.error('Error in getPlatformOverview controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch platform overview',
                error: error.message
            });
        }
    }
    /**
     * 获取用户数据分析
     * @param req 请求对象
     * @param res 响应对象
     */
    async getUserAnalytics(req, res) {
        try {
            const filters = req.query;
            const analytics = await dataIntegrationService.getUserAnalytics(filters);
            res.status(200).json({
                success: true,
                data: analytics
            });
        }
        catch (error) {
            console.error('Error in getUserAnalytics controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user analytics',
                error: error.message
            });
        }
    }
    /**
     * 获取订单数据分析
     * @param req 请求对象，可包含时间范围参数
     * @param res 响应对象
     */
    async getOrderAnalytics(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const timeRange = {};
            if (startDate)
                timeRange.startDate = new Date(startDate);
            if (endDate)
                timeRange.endDate = new Date(endDate);
            const analytics = await dataIntegrationService.getOrderAnalytics(timeRange);
            res.status(200).json({
                success: true,
                data: analytics
            });
        }
        catch (error) {
            console.error('Error in getOrderAnalytics controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch order analytics',
                error: error.message
            });
        }
    }
    /**
     * 获取健康数据分析
     * @param req 请求对象
     * @param res 响应对象
     */
    async getHealthAnalytics(req, res) {
        try {
            const filters = req.query;
            const analytics = await dataIntegrationService.getHealthAnalytics(filters);
            res.status(200).json({
                success: true,
                data: analytics
            });
        }
        catch (error) {
            console.error('Error in getHealthAnalytics controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch health analytics',
                error: error.message
            });
        }
    }
    /**
     * 获取反馈数据分析
     * @param req 请求对象，可包含时间范围参数
     * @param res 响应对象
     */
    async getFeedbackAnalytics(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const timeRange = {};
            if (startDate)
                timeRange.startDate = new Date(startDate);
            if (endDate)
                timeRange.endDate = new Date(endDate);
            const analytics = await dataIntegrationService.getFeedbackAnalytics(timeRange);
            res.status(200).json({
                success: true,
                data: analytics
            });
        }
        catch (error) {
            console.error('Error in getFeedbackAnalytics controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch feedback analytics',
                error: error.message
            });
        }
    }
    /**
     * 获取AI模块所需数据
     * @param req 请求对象
     * @param res 响应对象
     */
    async getDataForAI(req, res) {
        try {
            const data = await dataIntegrationService.prepareDataForAI();
            res.status(200).json({
                success: true,
                data
            });
        }
        catch (error) {
            console.error('Error in getDataForAI controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch AI data',
                error: error.message
            });
        }
    }
}
exports.DataAnalyticsController = DataAnalyticsController;
