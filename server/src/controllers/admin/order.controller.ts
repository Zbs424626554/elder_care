import { Request, Response } from 'express';
import { Order } from '../../models/order.model';

export class AdminOrderController {
  // GET /orders/list
  static async list(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
      const status = (req.query.status as string) || '';

      const filter: Record<string, unknown> = {};
      if (status) {
        filter.status = status;
      }

      const total = await Order.countDocuments(filter);
      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      return res.success(
        { orders, total, page, pages: Math.ceil(total / pageSize) },
        '获取订单列表成功'
      );
    } catch (error) {
      return res.error('获取订单列表失败', error);
    }
  }
}

export default AdminOrderController;


