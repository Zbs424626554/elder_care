import express from 'express';
import AdminFinanceController from '../../controllers/admin/finance.controller';

const router = express.Router();

// Controllers → Routes: 财务相关接口路由映射
router.get('/payments', AdminFinanceController.payments);
router.get('/withdrawals', AdminFinanceController.withdrawals);

export default router;


