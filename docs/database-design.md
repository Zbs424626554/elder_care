# 智慧养老平台数据库设计文档

## 概述
本文档描述了智慧养老平台的数据库设计，包括所有集合（表）的结构、字段定义、索引和关联关系。

## 数据库信息
- **数据库名称**: smart-aging
- **数据库类型**: MongoDB
- **连接地址**: mongodb+srv://424626554:Zbs424626554@zbs.ngrjull.mongodb.net/smart-aging

---

## 1. 用户集合 (users)

### 基础用户字段
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| role | String | 是 | - | 用户角色：elderly/family/nurse/admin |
| username | String | 是 | - | 用户名 |
| password | String | 是 | - | 密码（bcrypt加密） |
| avatar | String | 否 | '' | 头像URL |
| phone | String | 是 | - | 手机号（唯一） |
| status | Boolean | 否 | true | 账号状态 |
| createdTime | Date | 否 | Date.now | 创建时间 |
| lastLogin | Date | 否 | Date.now | 最后登录时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 老人用户特有字段
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| realname | String | 是 | - | 真实姓名 |
| gender | String | 是 | - | 性别：male/female |
| age | Number | 是 | - | 年龄 |
| idCard | String | 否 | - | 身份证号 |
| healthInfo.bloodPressure | String | 否 | - | 血压值 |
| healthInfo.bloodSugar | Number | 否 | - | 血糖值 |
| healthInfo.allergies | [String] | 否 | - | 过敏史列表 |
| healthInfo.chronicDiseases | [String] | 否 | - | 慢性病列表 |
| medications | Array | 否 | - | 用药信息数组 |
| medications[].name | String | 是 | - | 药品名称 |
| medications[].dosage | String | 是 | - | 剂量 |
| medications[].schedule | String | 是 | - | 用药时间 |
| emergencyContacts | Array | 否 | - | 紧急联系人数组 |
| emergencyContacts[].name | String | 是 | - | 联系人姓名 |
| emergencyContacts[].phone | String | 是 | - | 联系人电话 |
| emergencyContacts[].relation | String | 是 | - | 关系类型 |
| location.type | String | 否 | 'Point' | 坐标类型 |
| location.coordinates | [Number] | 否 | - | 经纬度坐标 |
| familyIds | [ObjectId] | 否 | - | 关联家属ID列表 |
| collect | [ObjectId] | 否 | - | 收藏护工ID列表 |

### 家属用户特有字段
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| realname | String | 是 | - | 真实姓名 |
| idCard | String | 是 | - | 身份证号 |
| familyIds | [ObjectId] | 否 | - | 关联老人ID列表 |
| paymentMethods | Array | 否 | - | 支付方式数组 |
| paymentMethods[].type | String | 是 | - | 支付方式：alipay/wechat/bank |
| paymentMethods[].lastFour | String | 否 | - | 卡号后四位 |

### 护工用户特有字段
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| realname | String | 是 | - | 真实姓名 |
| idCard | String | 是 | - | 身份证号（唯一） |
| skillTags | [String] | 否 | - | 技能标签列表 |
| rating | Number | 否 | 5.0 | 综合评分（0-5） |
| content | String | 否 | - | 自我介绍 |
| status | String | 否 | 'offline' | 工作状态：available/busy/offline |
| verificationStatus | String | 否 | 'pending' | 认证状态：pending/approved/rejected |
| certificates | [ObjectId] | 否 | - | 资质认证ID列表 |
| serviceAreas | [String] | 否 | - | 可服务区域列表 |
| availability.workDays | [Number] | 否 | - | 可工作日期（0-6） |
| availability.startTime | String | 否 | - | 开始时间 |
| availability.endTime | String | 否 | - | 结束时间 |
| responseRate | Number | 否 | 100 | 接单响应率（0-100） |
| deviceToken | String | 否 | - | 推送通知token |

### 管理员用户特有字段
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| permissions | [String] | 否 | - | 权限列表 |

### 索引
- `phone`: 1 (唯一索引)
- `role`: 1
- `idCard`: 1 (护工用户唯一索引)
- `location`: 2dsphere (老人用户地理位置索引)

---

## 2. 服务类型集合 (service_types)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| name | String | 是 | - | 服务名称（唯一） |
| basePrice | Number | 是 | - | 基础价格 |
| description | String | 是 | - | 服务描述 |
| timeUnit | String | 是 | - | 计时单位：hour/visit |
| category | String | 是 | - | 服务类别：daily/medical/emergency |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `name`: 1 (唯一索引)
- `category`: 1

---

## 3. 订单集合 (orders)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| userId | ObjectId | 是 | - | 下单用户ID |
| nurseId | ObjectId | 否 | - | 护工ID |
| serviceType | ObjectId | 是 | - | 服务类型ID |
| status | String | 否 | 'pending' | 订单状态 |
| orderTime | Date | 否 | Date.now | 下单时间 |
| startTime | Date | 否 | - | 服务开始时间 |
| endTime | Date | 否 | - | 服务结束时间 |
| duration | Number | 是 | - | 服务时长（小时） |
| price | Number | 是 | - | 总金额 |
| paymentStatus | String | 否 | 'unpaid' | 支付状态 |
| address.formatted | String | 否 | - | 格式化地址 |
| address.province | String | 否 | - | 省份 |
| address.city | String | 否 | - | 城市 |
| address.district | String | 否 | - | 区县 |
| address.location.type | String | 否 | 'Point' | 坐标类型 |
| address.location.coordinates | [Number] | 否 | - | 经纬度坐标 |
| remarks | String | 否 | - | 订单备注 |
| healthSnapshot.bloodPressure | String | 否 | - | 服务前血压值 |
| healthSnapshot.bloodSugar | Number | 否 | - | 服务前血糖值 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `userId`: 1
- `nurseId`: 1
- `status`: 1
- `orderTime`: -1
- `address.location`: 2dsphere

---

## 4. 健康记录集合 (health_records)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| elderlyId | ObjectId | 是 | - | 关联老人ID |
| recordType | String | 是 | - | 记录类型 |
| value | String | 是 | - | 记录值 |
| measuredAt | Date | 是 | - | 测量时间 |
| recordedBy | ObjectId | 是 | - | 记录人ID |
| aiWarningLevel | Number | 否 | - | AI预警等级（0-3） |
| trendAnalysis | String | 否 | - | 趋势分析文本 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `elderlyId`: 1
- `recordType`: 1
- `measuredAt`: -1
- `recordedBy`: 1

---

## 5. 紧急警报集合 (emergency_alerts)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| userId | ObjectId | 是 | - | 触发老人ID |
| triggerTime | Date | 否 | Date.now | 触发时间 |
| location.type | String | 否 | 'Point' | 坐标类型 |
| location.coordinates | [Number] | 否 | - | 经纬度坐标 |
| audioClip | String | 否 | - | 录音文件路径 |
| aiAnalysis | String | 否 | - | AI分析结果 |
| status | String | 否 | 'pending' | 处理状态 |
| handledBy | ObjectId | 否 | - | 处理客服ID |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `userId`: 1
- `status`: 1
- `triggerTime`: -1
- `location`: 2dsphere

---

## 6. 评价集合 (reviews)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| orderId | ObjectId | 是 | - | 关联订单ID |
| reviewerId | ObjectId | 是 | - | 评价人ID |
| revieweeId | ObjectId | 是 | - | 被评人ID |
| rating | Number | 是 | - | 评分（1-5） |
| content | String | 是 | - | 评价内容 |
| createdAt | Date | 否 | Date.now | 创建时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `orderId`: 1
- `reviewerId`: 1
- `revieweeId`: 1
- `rating`: -1
- `createdAt`: -1

---

## 7. 支付交易集合 (payment_transactions)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| orderId | ObjectId | 是 | - | 关联订单ID |
| amount | Number | 是 | - | 支付金额 |
| payerId | ObjectId | 是 | - | 支付人ID |
| payMethod | String | 是 | - | 支付方式 |
| transactionId | String | 是 | - | 第三方支付ID |
| status | String | 否 | 'pending' | 支付状态 |
| createdAt | Date | 否 | Date.now | 创建时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `orderId`: 1
- `payerId`: 1
- `status`: 1
- `transactionId`: 1
- `createdAt`: -1

---

## 8. 通知集合 (notifications)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| recipientId | ObjectId | 是 | - | 接收者ID |
| senderId | ObjectId | 否 | - | 发送者ID |
| type | String | 是 | - | 通知类型 |
| title | String | 是 | - | 通知标题 |
| content | String | 是 | - | 通知内容 |
| relatedId | ObjectId | 否 | - | 关联ID |
| isRead | Boolean | 否 | false | 是否已读 |
| pushTime | Date | 否 | Date.now | 推送时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `recipientId`: 1
- `type`: 1
- `isRead`: 1
- `pushTime`: -1

---

## 9. 客服工单集合 (support_tickets)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| userId | ObjectId | 是 | - | 发起用户ID |
| type | String | 是 | - | 工单类型 |
| orderId | ObjectId | 否 | - | 关联订单ID |
| content | String | 是 | - | 工单内容 |
| status | String | 否 | 'pending' | 工单状态 |
| createdAt | Date | 否 | Date.now | 创建时间 |
| resolvedAt | Date | 否 | - | 解决时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `userId`: 1
- `type`: 1
- `status`: 1
- `orderId`: 1
- `createdAt`: -1

---

## 10. 资质认证集合 (certifications)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| nurseId | ObjectId | 是 | - | 护工ID |
| certType | String | 是 | - | 证书类型 |
| certNumber | String | 是 | - | 证书编号 |
| imageUrl | String | 是 | - | 证书照片URL |
| verified | Boolean | 否 | false | 是否通过验证 |
| verifiedBy | ObjectId | 否 | - | 审核人ID |
| verifiedAt | Date | 否 | - | 审核时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `nurseId`: 1
- `certType`: 1
- `verified`: 1
- `certNumber`: 1

---

## 11. 角色权限集合 (role_permissions)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| role | String | 是 | - | 角色类型（唯一） |
| permissions | Array | 否 | - | 权限数组 |
| permissions[].module | String | 是 | - | 模块名称 |
| permissions[].actions | [String] | 是 | - | 操作权限列表 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `role`: 1 (唯一索引)

---

## 12. 服务推荐集合 (service_recommendations)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| nurseId | ObjectId | 是 | - | 护工ID |
| elderlyId | ObjectId | 是 | - | 老人ID |
| score | Number | 是 | - | 推荐指数（0-100） |
| reasons | [String] | 否 | - | 推荐原因列表 |
| generatedAt | Date | 否 | Date.now | 生成时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `nurseId`: 1
- `elderlyId`: 1
- `score`: -1
- `generatedAt`: -1

---

## 13. 健康预警集合 (health_warnings)

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | ObjectId | 是 | 自动生成 | 主键ID |
| elderlyId | ObjectId | 是 | - | 老人ID |
| metric | String | 是 | - | 健康指标 |
| currentValue | String | 是 | - | 当前值 |
| trend | String | 是 | - | 趋势 |
| severity | String | 是 | - | 严重程度 |
| suggestedActions | [String] | 否 | - | 建议措施列表 |
| sentAt | Date | 否 | Date.now | 发送时间 |
| createdAt | Date | 否 | 自动生成 | 创建时间戳 |
| updatedAt | Date | 否 | 自动生成 | 更新时间戳 |

### 索引
- `elderlyId`: 1
- `metric`: 1
- `severity`: 1
- `sentAt`: -1

---

## 关联关系图

```
users (用户)
├── elderly (老人) → family (家属) [familyIds]
├── elderly (老人) → nurse (护工) [collect]
├── family (家属) → elderly (老人) [familyIds]
└── nurse (护工) → certification (认证) [certificates]

orders (订单)
├── users (用户) [userId]
├── users (护工) [nurseId]
└── service_types (服务类型) [serviceType]

health_records (健康记录)
├── users (老人) [elderlyId]
└── users (记录人) [recordedBy]

emergency_alerts (紧急警报)
├── users (老人) [userId]
└── users (客服) [handledBy]

reviews (评价)
├── orders (订单) [orderId]
├── users (评价人) [reviewerId]
└── users (被评人) [revieweeId]

payment_transactions (支付交易)
├── orders (订单) [orderId]
└── users (支付人) [payerId]

notifications (通知)
├── users (接收者) [recipientId]
└── users (发送者) [senderId]

support_tickets (客服工单)
├── users (发起人) [userId]
└── orders (订单) [orderId]

certifications (资质认证)
├── users (护工) [nurseId]
└── users (审核人) [verifiedBy]

service_recommendations (服务推荐)
├── users (护工) [nurseId]
└── users (老人) [elderlyId]

health_warnings (健康预警)
└── users (老人) [elderlyId]
```

---

## 数据字典

### 枚举值定义

#### 用户角色 (role)
- `elderly`: 老人
- `family`: 家属
- `nurse`: 护工
- `admin`: 管理员

#### 订单状态 (status)
- `pending`: 待接单
- `accepted`: 已接单
- `started`: 已开始
- `completed`: 已完成
- `confirmed`: 已确认
- `canceled`: 已取消

#### 支付状态 (paymentStatus)
- `unpaid`: 未支付
- `paid`: 已支付
- `refunded`: 已退款

#### 护工工作状态 (status)
- `available`: 可接单
- `busy`: 繁忙
- `offline`: 离线

#### 认证状态 (verificationStatus)
- `pending`: 待审核
- `approved`: 已通过
- `rejected`: 已拒绝

#### 健康记录类型 (recordType)
- `bloodPressure`: 血压
- `bloodSugar`: 血糖
- `medication`: 用药
- `other`: 其他

#### 紧急警报状态 (status)
- `pending`: 待处理
- `handled`: 已处理
- `falseAlarm`: 误报

#### 通知类型 (type)
- `order`: 订单
- `alert`: 警报
- `payment`: 支付
- `system`: 系统

#### 工单类型 (type)
- `complaint`: 投诉
- `inquiry`: 咨询
- `emergency`: 紧急
- `other`: 其他

#### 工单状态 (status)
- `pending`: 待处理
- `in_progress`: 处理中
- `resolved`: 已解决
- `closed`: 已关闭

#### 证书类型 (certType)
- `nursing`: 护理
- `health`: 健康
- `other`: 其他

#### 角色类型 (role)
- `admin`: 管理员
- `cs`: 客服
- `auditor`: 审核员
- `finance`: 财务

#### 服务类别 (category)
- `daily`: 日常
- `medical`: 医疗
- `emergency`: 紧急

#### 时间单位 (timeUnit)
- `hour`: 小时
- `visit`: 次

#### 健康指标 (metric)
- `bloodPressure`: 血压
- `bloodSugar`: 血糖

#### 趋势 (trend)
- `rising`: 上升
- `falling`: 下降
- `abnormal`: 异常

#### 严重程度 (severity)
- `low`: 轻度
- `medium`: 中度
- `high`: 重度

#### 性别 (gender)
- `male`: 男
- `female`: 女

#### 支付方式 (payMethod)
- `alipay`: 支付宝
- `wechat`: 微信
- `bank`: 银行卡

---

## 性能优化建议

1. **索引优化**
   - 为常用查询字段创建复合索引
   - 地理位置查询使用2dsphere索引
   - 时间范围查询使用降序索引

2. **数据分片**
   - 按时间分片历史数据
   - 按地区分片用户数据

3. **缓存策略**
   - 缓存用户信息
   - 缓存服务类型
   - 缓存热门护工信息

4. **数据归档**
   - 定期归档历史订单
   - 归档过期健康记录
   - 归档已处理警报

---

## 安全考虑

1. **数据加密**
   - 用户密码使用bcrypt加密
   - 敏感信息传输加密

2. **访问控制**
   - 基于角色的权限控制
   - API访问权限验证

3. **数据备份**
   - 定期数据备份
   - 异地备份策略

4. **审计日志**
   - 记录重要操作日志
   - 异常行为监控 