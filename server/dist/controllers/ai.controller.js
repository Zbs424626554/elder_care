"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const aiDataProcessor_service_1 = require("../services/aiDataProcessor.service");
const aiDataProcessorService = new aiDataProcessor_service_1.AIDataProcessorService();
/**
 * AI功能控制器
 * 提供AI相关功能的API接口
 */
class AIController {
    /**
     * 处理健康数据并生成预警
     * @param req 请求对象
     * @param res 响应对象
     */
    async processHealthData(req, res) {
        try {
            const warnings = await aiDataProcessorService.processHealthData();
            res.status(200).json({
                success: true,
                message: `成功处理健康数据并生成${warnings.length}条预警`,
                data: {
                    warningsCount: warnings.length,
                    warnings: warnings.slice(0, 10) // 仅返回前10条预警作为示例
                }
            });
        }
        catch (error) {
            console.error('Error in processHealthData controller:', error);
            res.status(500).json({
                success: false,
                message: '处理健康数据失败',
                error: error.message
            });
        }
    }
    /**
     * 为特定用户生成服务推荐
     * @param req 请求对象，包含userId
     * @param res 响应对象
     */
    async generateRecommendations(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: '用户ID不能为空'
                });
            }
            const recommendations = await aiDataProcessorService.generateServiceRecommendations(userId);
            res.status(200).json({
                success: true,
                message: `成功为用户生成${recommendations.length}条服务推荐`,
                data: recommendations
            });
        }
        catch (error) {
            console.error('Error in generateRecommendations controller:', error);
            res.status(500).json({
                success: false,
                message: '生成服务推荐失败',
                error: error.message
            });
        }
    }
    /**
     * 生成业务洞察报告
     * @param req 请求对象
     * @param res 响应对象
     */
    async getBusinessInsights(req, res) {
        try {
            const insights = await aiDataProcessorService.generateBusinessInsights();
            res.status(200).json({
                success: true,
                message: '成功生成业务洞察报告',
                data: insights
            });
        }
        catch (error) {
            console.error('Error in getBusinessInsights controller:', error);
            res.status(500).json({
                success: false,
                message: '生成业务洞察报告失败',
                error: error.message
            });
        }
    }
}
exports.AIController = AIController;
