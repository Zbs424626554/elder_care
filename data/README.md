# 智慧养老综合服务平台 - MongoDB 数据文件

本目录包含智慧养老综合服务平台的 MongoDB 示例数据文件，用于系统开发、测试和演示。

## 文件说明

1. **users.json** - 用户数据，包括管理员和护工
2. **services.json** - 服务项目数据，包括各类养老服务
3. **orders.json** - 订单数据，包括不同状态的服务订单
4. **reviews.json** - 评价数据，用户对服务的评价
5. **complaints.json** - 投诉数据，用户对服务的投诉
6. **support_tickets.json** - 客服工单数据，用户提交的问题和支持请求
7. **announcements.json** - 公告数据，系统发布的通知和公告
8. **system_config.json** - 系统配置数据，包括各种系统参数设置
9. **statistics.json** - 统计数据，包括收入、用户增长等统计信息
10. **health_records.json** - 健康记录数据，用户的健康监测数据
11. **permissions.json** - 权限数据，不同角色的权限设置
12. **payments.json** - 支付数据，包括订单支付和提现记录

## 数据关系

- **用户与订单**: 通过 userId 关联
- **服务与订单**: 通过 serviceId 关联
- **订单与评价/投诉**: 通过 orderId 关联
- **用户与健康记录**: 通过 userId 关联
- **订单与支付**: 通过 orderId 关联

## 数据导入方法

使用 MongoDB 命令行工具导入数据:

```bash
mongoimport --db elder_care --collection users --file users.json --jsonArray
mongoimport --db elder_care --collection services --file services.json --jsonArray
mongoimport --db elder_care --collection orders --file orders.json --jsonArray
# ... 依此类推导入其他文件
```

## 数据字段说明

### 用户 (users.json)
- **_id**: 用户ID
- **username**: 用户名
- **password**: 密码（已加密）
- **role**: 角色（admin/nurse）
- **name**: 姓名
- **phone**: 电话
- **email**: 邮箱
- **status**: 状态（active/pending/disabled）
- **certification**: 认证信息（护工用户）

### 服务 (services.json)
- **_id**: 服务ID
- **name**: 服务名称
- **description**: 服务描述
- **price**: 价格
- **priceUnit**: 价格单位（小时/次/天）
- **category**: 服务类别
- **requirements**: 服务要求
- **status**: 状态（active/inactive）

### 订单 (orders.json)
- **_id**: 订单ID
- **orderNo**: 订单编号
- **serviceId**: 服务ID
- **userId**: 用户ID
- **nurseId**: 护工ID
- **status**: 订单状态（pending/in_progress/completed/cancelled）
- **price**: 单价
- **totalAmount**: 总金额
- **address**: 服务地址
- **appointmentTime**: 预约时间
- **completionTime**: 完成时间
- **paymentStatus**: 支付状态（pending/paid/refunded）

## 注意事项

1. 数据中的密码均为加密格式，实际值为 "password123"
2. 所有时间均为 UTC 时间格式
3. ID 使用 MongoDB 的 ObjectId 格式
4. 示例数据仅用于开发和测试，不包含真实用户信息 