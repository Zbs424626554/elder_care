# 智慧养老平台 API 接口总结

## 概述
根据功能规划和模型库，已为三个用户端生成了完整的API接口框架，包含认证、权限控制、错误处理等。

## 接口架构

### 1. 认证模块 (`/api/auth`)
- **POST** `/register` - 用户注册
- **POST** `/login` - 用户登录  
- **GET** `/profile` - 获取用户信息
- **PUT** `/profile` - 更新用户信息

### 2. 老人端接口 (`/api/elderly`)
**核心功能：**
- **个人档案管理**
  - `PUT /profile` - 完善老人信息
  - `GET /health` - 获取健康信息
  - `GET /health-data` - 获取健康数据

- **护工服务**
  - `GET /nurses` - 获取推荐护工列表
  - `POST /collect/:nurseId` - 收藏护工
  - `DELETE /collect/:nurseId` - 取消收藏
  - `GET /collect` - 获取收藏列表

- **订单管理**
  - `GET /orders` - 获取订单列表
  - `GET /orders/:orderId` - 获取订单详情

- **紧急呼叫**
  - `POST /emergency` - 触发紧急呼叫

- **通知管理**
  - `GET /notifications` - 获取通知列表
  - `PATCH /notifications/:notificationId/read` - 标记已读

### 3. 家属端接口 (`/api/family`)
**核心功能：**
- **个人信息管理**
  - `PUT /profile` - 完善家属信息
  - `POST /bind-elderly` - 绑定老人
  - `GET /elderly` - 获取绑定老人列表

- **健康数据管理**
  - `POST /health-record` - 录入健康数据
  - `GET /elderly/:elderlyId/health-data` - 获取老人健康数据
  - `GET /health-warnings` - 获取健康预警

- **服务需求发布**
  - `POST /service-requests` - 发布服务需求
  - `GET /nurses` - 获取护工列表
  - `GET /nurses/:nurseId` - 获取护工详情

- **订单管理**
  - `POST /orders` - 创建订单
  - `GET /orders` - 获取订单列表
  - `GET /orders/:orderId` - 获取订单详情
  - `PATCH /orders/:orderId/confirm` - 确认完成
  - `PATCH /orders/:orderId/cancel` - 取消订单

- **评价系统**
  - `POST /reviews` - 评价护工

- **客服支持**
  - `POST /support-tickets` - 创建客服工单

### 4. 护工端接口 (`/api/nurse`)
**核心功能：**
- **个人资料管理**
  - `PUT /profile` - 完善护工信息
  - `POST /certifications` - 上传资质证书
  - `GET /certifications` - 获取资质证书列表
  - `PATCH /status` - 更新工作状态

- **订单管理**
  - `GET /available-orders` - 获取可接订单列表
  - `PATCH /orders/:orderId/accept` - 接单
  - `GET /orders` - 获取我的订单列表
  - `GET /orders/:orderId` - 获取订单详情
  - `PATCH /orders/:orderId/start` - 开始服务
  - `PATCH /orders/:orderId/complete` - 完成服务

- **服务记录**
  - `POST /service-records` - 创建服务记录
  - `GET /service-records` - 获取服务记录列表

- **收入管理**
  - `GET /income` - 获取收入统计
  - `POST /withdraw` - 申请提现
  - `GET /withdrawals` - 获取提现记录

- **评价管理**
  - `GET /reviews` - 获取收到的评价
  - `POST /reviews/:reviewId/appeal` - 申诉评价

- **日程管理**
  - `GET /schedule` - 获取日程安排

### 5. 公共接口 (`/api/common`)
**通用功能：**
- **服务类型**
  - `GET /services` - 获取服务类型列表
  - `GET /services/:serviceId` - 获取服务类型详情

- **文件上传**
  - `POST /upload` - 文件上传

- **通知管理**
  - `GET /notifications` - 获取通知列表
  - `PATCH /notifications/:notificationId/read` - 标记已读
  - `PATCH /notifications/read-all` - 标记所有已读

- **评价系统**
  - `POST /reviews` - 创建评价
  - `GET /reviews` - 获取评价列表

- **客服工单**
  - `POST /support-tickets` - 创建工单
  - `GET /support-tickets` - 获取工单列表
  - `GET /support-tickets/:ticketId` - 获取工单详情

### 6. 后台管理接口 (`/api/admin`)
**核心功能：**
- **数据统计**
  - `GET /statistics` - 获取统计数据

- **用户管理**
  - `GET /users` - 获取用户列表
  - `GET /users/:userId` - 获取用户详情
  - `PATCH /users/:userId/status` - 更新用户状态

- **资质审核**
  - `GET /certifications` - 获取资质审核列表
  - `PATCH /certifications/:certId/verify` - 审核护工资质

- **订单管理**
  - `GET /orders` - 获取订单列表
  - `GET /orders/:orderId` - 获取订单详情
  - `PATCH /orders/:orderId/handle` - 处理异常订单

- **服务内容管理**
  - `GET /services` - 获取服务类型列表
  - `POST /services` - 创建服务类型
  - `PUT /services/:serviceId` - 更新服务类型
  - `DELETE /services/:serviceId` - 删除服务类型

- **评价投诉管理**
  - `GET /reviews` - 获取评价列表
  - `PATCH /reviews/:reviewId/appeal` - 处理评价申诉
  - `GET /complaints` - 获取投诉列表
  - `PATCH /complaints/:complaintId/handle` - 处理投诉

- **客服工单**
  - `GET /support-tickets` - 获取客服工单列表
  - `PATCH /support-tickets/:ticketId/process` - 处理客服工单

- **财务管理**
  - `GET /payments` - 获取支付记录
  - `GET /withdrawals` - 获取提现申请列表
  - `PATCH /withdrawals/:withdrawalId/process` - 处理提现申请

- **内容管理**
  - `POST /announcements` - 发布平台公告
  - `GET /announcements` - 获取公告列表
  - `PUT /announcements/:announcementId` - 更新公告
  - `DELETE /announcements/:announcementId` - 删除公告

- **系统配置**
  - `GET /config` - 获取系统配置
  - `PUT /config` - 更新系统配置

### 7. 通用接口 (`/api`)
**跨模块功能：**
- **健康记录**
  - `GET /health-records` - 获取健康记录列表
  - `POST /health-records` - 创建健康记录

- **紧急警报**
  - `POST /emergency-alerts` - 触发紧急警报
  - `GET /emergency-alerts` - 获取警报列表
  - `PATCH /emergency-alerts/:alertId/handle` - 处理警报

- **支付系统**
  - `POST /payments` - 创建支付订单
  - `POST /payments/callback` - 支付回调
  - `GET /payments` - 获取支付记录

- **AI推荐**
  - `GET /ai/recommendations` - 获取服务推荐
  - `GET /ai/health-warnings` - 获取健康预警

- **订单管理**
  - `GET /orders` - 获取订单列表
  - `POST /orders` - 创建订单
  - `GET /orders/:orderId` - 获取订单详情

## 权限控制

### 角色定义
- `elderly` - 老人用户
- `family` - 家属用户  
- `nurse` - 护工用户
- `admin` - 管理员（后台管理系统）

### 中间件
- `authMiddleware` - JWT认证中间件
- `roleCheckMiddleware` - 角色权限检查中间件

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "error": {
    "field": "错误字段",
    "detail": "详细错误信息"
  }
}
```

## 状态码说明
- `200` - 请求成功
- `400` - 请求参数错误
- `401` - 未授权，需要登录
- `403` - 权限不足
- `404` - 资源不存在
- `409` - 资源冲突
- `422` - 数据验证失败
- `500` - 服务器内部错误

## 分页参数
支持分页的接口使用以下查询参数：
- `page` - 页码，从1开始
- `limit` - 每页数量，默认10

响应中包含分页信息：
- `total` - 总记录数
- `page` - 当前页码
- `limit` - 每页数量

## 文件上传
支持的文件类型：
- `avatar` - 头像
- `certificate` - 证书
- `other` - 其他文件

## 下一步开发
1. 实现各个接口的具体业务逻辑
2. 添加数据验证
3. 完善错误处理
4. 添加日志记录
5. 实现数据库操作
6. 添加单元测试 