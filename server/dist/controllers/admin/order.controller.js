"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrderController = void 0;
const order_model_1 = require("../../models/order.model");
class AdminOrderController {
    // GET /orders/list
    static async list(req, res) {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const pageSize = parseInt(req.query.pageSize || '10', 10);
            const status = req.query.status || '';
            const filter = {};
            if (status) {
                filter.status = status;
            }
            const total = await order_model_1.Order.countDocuments(filter);
            const orders = await order_model_1.Order.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            return res.success({ orders, total, page, pages: Math.ceil(total / pageSize) }, '获取订单列表成功');
        }
        catch (error) {
            return res.error('获取订单列表失败', error);
        }
    }
}
exports.AdminOrderController = AdminOrderController;
exports.default = AdminOrderController;
