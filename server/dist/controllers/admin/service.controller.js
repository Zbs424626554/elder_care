"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServiceController = void 0;
const service_model_1 = require("../../models/service.model");
class AdminServiceController {
    // GET /services/list
    static async list(req, res) {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const pageSize = parseInt(req.query.pageSize || '10', 10);
            const keyword = req.query.keyword || '';
            const filter = keyword ? { name: new RegExp(keyword, 'i') } : {};
            const total = await service_model_1.ServiceType.countDocuments(filter);
            const services = await service_model_1.ServiceType.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            return res.success({ services, total, page, pages: Math.ceil(total / pageSize) }, '获取服务列表成功');
        }
        catch (error) {
            return res.error('获取服务列表失败', error);
        }
    }
}
exports.AdminServiceController = AdminServiceController;
exports.default = AdminServiceController;
