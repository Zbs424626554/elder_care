import { Request, Response } from 'express';
import { PaymentTransaction, Withdrawal } from '../../models/payment.model';

export class AdminFinanceController {
  // GET /finance/payments
  static async payments(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
      const skip = (page - 1) * pageSize;

      const [transactions, total] = await Promise.all([
        PaymentTransaction.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize),
        PaymentTransaction.countDocuments()
      ]);

      return res.success({ transactions, total, page, pages: Math.ceil(total / pageSize) }, '获取支付交易记录成功');
    } catch (error) {
      return res.error('获取支付交易记录失败', error);
    }
  }

  // GET /finance/withdrawals
  static async withdrawals(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
      const skip = (page - 1) * pageSize;

      const [withdrawals, total] = await Promise.all([
        Withdrawal.find()
          .sort({ requestedAt: -1 })
          .skip(skip)
          .limit(pageSize),
        Withdrawal.countDocuments()
      ]);

      return res.success({ withdrawals, total, page, pages: Math.ceil(total / pageSize) }, '获取提现申请列表成功');
    } catch (error) {
      return res.error('获取提现申请列表失败', error);
    }
  }
}

export default AdminFinanceController;


