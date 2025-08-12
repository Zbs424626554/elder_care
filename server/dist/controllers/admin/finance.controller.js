"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFinanceController = void 0;
const payment_model_1 = require("../../models/payment.model");
class AdminFinanceController {
    // GET /finance/payments
    static async payments(req, res) {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const pageSize = parseInt(req.query.pageSize || '10', 10);
            const skip = (page - 1) * pageSize;
            const [transactions, total] = await Promise.all([
                payment_model_1.PaymentTransaction.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(pageSize),
                payment_model_1.PaymentTransaction.countDocuments()
            ]);
            return res.success({ transactions, total, page, pages: Math.ceil(total / pageSize) }, '获取支付交易记录成功');
        }
        catch (error) {
            return res.error('获取支付交易记录失败', error);
        }
    }
    // GET /finance/withdrawals
    static async withdrawals(req, res) {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const pageSize = parseInt(req.query.pageSize || '10', 10);
            const skip = (page - 1) * pageSize;
            const [withdrawals, total] = await Promise.all([
                payment_model_1.Withdrawal.find()
                    .sort({ requestedAt: -1 })
                    .skip(skip)
                    .limit(pageSize),
                payment_model_1.Withdrawal.countDocuments()
            ]);
            return res.success({ withdrawals, total, page, pages: Math.ceil(total / pageSize) }, '获取提现申请列表成功');
        }
        catch (error) {
            return res.error('获取提现申请列表失败', error);
        }
    }
}
exports.AdminFinanceController = AdminFinanceController;
exports.default = AdminFinanceController;
