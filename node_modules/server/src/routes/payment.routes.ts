import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// 创建支付订单
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { orderId, orderNo, amount, subject, body } = req.body;

    // 模拟支付宝沙箱支付创建
    const paymentUrl = `https://openapi.alipaydev.com/gateway.do?app_id=mock&method=alipay.trade.page.pay&format=JSON&charset=utf-8&sign_type=RSA2&timestamp=${new Date().toISOString()}&version=1.0&notify_url=https://example.com/notify&biz_content={"out_trade_no":"${orderId}","total_amount":"${amount}","subject":"${subject}","product_code":"FAST_INSTANT_TRADE_PAY"}`;

    res.json({
      code: 200,
      message: 'ok',
      data: {
        success: true,
        paymentUrl,
        qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
        tradeNo: `ALIPAY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      }
    });
  } catch (error) {
    console.error('创建支付订单失败:', error);
    res.status(500).json({ code: 500, message: '创建支付订单失败', data: null });
  }
});

// 查询支付状态
router.get('/status/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // 模拟查询支付状态
    const statuses = ['pending', 'paid', 'failed', 'cancelled'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    res.json({
      code: 200,
      message: 'ok',
      data: {
        orderId,
        status: randomStatus,
        tradeNo: randomStatus === 'paid' ? `ALIPAY${Date.now()}` : undefined,
        paidAt: randomStatus === 'paid' ? new Date().toISOString() : undefined,
        amount: randomStatus === 'paid' ? 160 : undefined
      }
    });
  } catch (error) {
    console.error('查询支付状态失败:', error);
    res.status(500).json({ code: 500, message: '查询支付状态失败', data: { orderId: req.params.orderId, status: 'failed' } });
  }
});

// 申请退款
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { orderId, orderNo, amount, reason } = req.body;

    // 模拟退款处理
    const isSuccess = Math.random() > 0.05; // 95%成功率

    if (isSuccess) {
      res.json({ code: 200, message: 'ok', data: { success: true, refundNo: `REFUND${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}` } });
    } else {
      res.json({ code: 200, message: 'ok', data: { success: false, message: '退款申请失败，请联系客服' } });
    }
  } catch (error) {
    console.error('申请退款失败:', error);
    res.status(500).json({ code: 500, message: '申请退款失败', data: null });
  }
});

// 查询退款状态
router.get('/refund/status/:refundNo', authenticateToken, async (req, res) => {
  try {
    const { refundNo } = req.params;

    // 模拟查询退款状态
    const isSuccess = Math.random() > 0.1; // 90%成功率

    if (isSuccess) {
      res.json({ code: 200, message: 'ok', data: { success: true, refundNo, status: 'completed' } });
    } else {
      res.json({ code: 200, message: 'ok', data: { success: false, message: '查询退款状态失败' } });
    }
  } catch (error) {
    console.error('查询退款状态失败:', error);
    res.status(500).json({ code: 500, message: '查询退款状态失败', data: null });
  }
});

export default router;
