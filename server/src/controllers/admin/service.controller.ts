import { Request, Response } from 'express';
import { ServiceType } from '../../models/service.model';

export class AdminServiceController {
  // GET /services/list
  static async list(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
      const keyword = (req.query.keyword as string) || '';
      const filter: Record<string, unknown> = keyword ? { name: new RegExp(keyword, 'i') } : {};

      const total = await ServiceType.countDocuments(filter);
      const services = await ServiceType.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      return res.success(
        { services, total, page, pages: Math.ceil(total / pageSize) },
        '获取服务列表成功'
      );
    } catch (error) {
      return res.error('获取服务列表失败', error);
    }
  }
}

export default AdminServiceController;


