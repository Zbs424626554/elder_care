# 智慧养老平台 API 接口文档

## 概述
本文档描述了智慧养老平台的所有API接口，包括用户管理、订单服务、健康管理、支付系统等核心功能。

**基础信息：**
- **基础URL**: `http://localhost:3001/api`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 1. 用户认证模块

### 1.1 用户注册
**POST** `/auth/register`

**请求体：**
```json
{
  "role": "elderly|family|nurse|admin",
  "username": "string",
  "password": "string",
  "phone": "string",
  "avatar": "string (optional)"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "string",
    "token": "string",
    "user": {
      "role": "string",
      "username": "string",
      "phone": "string",
      "avatar": "string"
    }
  }
}
```

**状态码：**
- `200`: 注册成功
- `400`: 参数错误
- `409`: 用户已存在

### 1.2 用户登录
**POST** `/auth/login`

**请求体：**
```json
{
  "phone": "string",
  "password": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "role": "string",
      "username": "string",
      "phone": "string",
      "avatar": "string"
    }
  }
}
```

**状态码：**
- `200`: 登录成功
- `401`: 用户名或密码错误

### 1.3 获取用户信息
**GET** `/auth/profile`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "role": "string",
    "username": "string",
    "phone": "string",
    "avatar": "string",
    "realname": "string",
    "status": "boolean",
    "createdTime": "date"
  }
}
```

---

## 2. 用户管理模块

### 2.1 获取用户列表（管理员）
**GET** `/users`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
role=elderly|family|nurse|admin
status=true|false
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "users": [
      {
        "id": "string",
        "role": "string",
        "username": "string",
        "phone": "string",
        "status": "boolean",
        "createdTime": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 2.2 获取用户详情
**GET** `/users/:userId`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "role": "string",
    "username": "string",
    "phone": "string",
    "avatar": "string",
    "realname": "string",
    "status": "boolean",
    "createdTime": "date",
    "lastLogin": "date"
  }
}
```

### 2.3 更新用户信息
**PUT** `/users/:userId`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "username": "string (optional)",
  "avatar": "string (optional)",
  "realname": "string (optional)"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "string",
    "username": "string",
    "avatar": "string",
    "realname": "string"
  }
}
```

### 2.4 更新用户状态（管理员）
**PATCH** `/users/:userId/status`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "status": "boolean"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": {
    "id": "string",
    "status": "boolean"
  }
}
```

---

## 3. 老人用户模块

### 3.1 完善老人信息
**PUT** `/elderly/profile`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "realname": "string",
  "gender": "male|female",
  "age": "number",
  "idCard": "string (optional)",
  "healthInfo": {
    "bloodPressure": "string (optional)",
    "bloodSugar": "number (optional)",
    "allergies": ["string"] (optional),
    "chronicDiseases": ["string"] (optional)
  },
  "medications": [
    {
      "name": "string",
      "dosage": "string",
      "schedule": "string"
    }
  ] (optional),
  "emergencyContacts": [
    {
      "name": "string",
      "phone": "string",
      "relation": "string"
    }
  ] (optional),
  "location": {
    "type": "Point",
    "coordinates": [number, number]
  } (optional)
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "信息更新成功",
  "data": {
    "id": "string",
    "realname": "string",
    "gender": "string",
    "age": "number"
  }
}
```

### 3.2 获取老人健康信息
**GET** `/elderly/health`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "healthInfo": {
      "bloodPressure": "string",
      "bloodSugar": "number",
      "allergies": ["string"],
      "chronicDiseases": ["string"]
    },
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "schedule": "string"
      }
    ],
    "emergencyContacts": [
      {
        "name": "string",
        "phone": "string",
        "relation": "string"
      }
    ]
  }
}
```

### 3.3 收藏护工
**POST** `/elderly/collect/:nurseId`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "收藏成功",
  "data": {
    "nurseId": "string"
  }
}
```

### 3.4 取消收藏护工
**DELETE** `/elderly/collect/:nurseId`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "取消收藏成功",
  "data": {
    "nurseId": "string"
  }
}
```

### 3.5 获取收藏的护工列表
**GET** `/elderly/collect`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "nurses": [
      {
        "id": "string",
        "realname": "string",
        "rating": "number",
        "skillTags": ["string"],
        "content": "string"
      }
    ]
  }
}
```

---

## 4. 家属用户模块

### 4.1 完善家属信息
**PUT** `/family/profile`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "realname": "string",
  "idCard": "string",
  "paymentMethods": [
    {
      "type": "alipay|wechat|bank",
      "lastFour": "string (optional)"
    }
  ] (optional)
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "信息更新成功",
  "data": {
    "id": "string",
    "realname": "string",
    "idCard": "string"
  }
}
```

### 4.2 绑定老人
**POST** `/family/bind-elderly`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "elderlyPhone": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "绑定成功",
  "data": {
    "elderlyId": "string",
    "elderlyName": "string"
  }
}
```

### 4.3 获取绑定的老人列表
**GET** `/family/elderly`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "elderly": [
      {
        "id": "string",
        "realname": "string",
        "age": "number",
        "gender": "string",
        "healthInfo": {
          "bloodPressure": "string",
          "bloodSugar": "number"
        }
      }
    ]
  }
}
```

### 4.4 录入老人健康数据
**POST** `/family/health-record`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "elderlyId": "string",
  "recordType": "bloodPressure|bloodSugar|medication|other",
  "value": "string",
  "measuredAt": "date"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "记录成功",
  "data": {
    "id": "string",
    "elderlyId": "string",
    "recordType": "string",
    "value": "string",
    "measuredAt": "date"
  }
}
```

---

## 5. 护工用户模块

### 5.1 完善护工信息
**PUT** `/nurse/profile`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "realname": "string",
  "idCard": "string",
  "skillTags": ["string"],
  "content": "string",
  "serviceAreas": ["string"],
  "availability": {
    "workDays": [0, 1, 2, 3, 4, 5, 6],
    "startTime": "string",
    "endTime": "string"
  }
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "信息更新成功",
  "data": {
    "id": "string",
    "realname": "string",
    "skillTags": ["string"],
    "content": "string"
  }
}
```

### 5.2 上传资质证书
**POST** `/nurse/certifications`

**请求头：**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求体：**
```
certType: nursing|health|other
certNumber: string
image: file
```

**响应体：**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": "string",
    "certType": "string",
    "certNumber": "string",
    "imageUrl": "string",
    "verified": "boolean"
  }
}
```

### 5.3 获取护工列表
**GET** `/nurse/list`

**查询参数：**
```
serviceType=string (optional)
location=number,number (optional)
rating=number (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "nurses": [
      {
        "id": "string",
        "realname": "string",
        "rating": "number",
        "skillTags": ["string"],
        "content": "string",
        "status": "string",
        "serviceAreas": ["string"],
        "distance": "number (optional)"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 5.4 获取护工详情
**GET** `/nurse/:nurseId`

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "realname": "string",
    "rating": "number",
    "skillTags": ["string"],
    "content": "string",
    "status": "string",
    "verificationStatus": "string",
    "serviceAreas": ["string"],
    "availability": {
      "workDays": [0, 1, 2, 3, 4, 5, 6],
      "startTime": "string",
      "endTime": "string"
    },
    "responseRate": "number",
    "certificates": [
      {
        "id": "string",
        "certType": "string",
        "certNumber": "string",
        "verified": "boolean"
      }
    ],
    "reviews": [
      {
        "id": "string",
        "rating": "number",
        "content": "string",
        "createdAt": "date"
      }
    ]
  }
}
```

### 5.5 更新护工状态
**PATCH** `/nurse/status`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "status": "available|busy|offline"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": {
    "status": "string"
  }
}
```

---

## 6. 服务类型模块

### 6.1 获取服务类型列表
**GET** `/services`

**查询参数：**
```
category=daily|medical|emergency (optional)
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "services": [
      {
        "id": "string",
        "name": "string",
        "basePrice": "number",
        "description": "string",
        "timeUnit": "hour|visit",
        "category": "daily|medical|emergency"
      }
    ]
  }
}
```

### 6.2 获取服务类型详情
**GET** `/services/:serviceId`

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "name": "string",
    "basePrice": "number",
    "description": "string",
    "timeUnit": "string",
    "category": "string"
  }
}
```

---

## 7. 订单模块

### 7.1 创建订单
**POST** `/orders`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "serviceType": "string",
  "nurseId": "string (optional)",
  "duration": "number",
  "price": "number",
  "address": {
    "formatted": "string",
    "province": "string",
    "city": "string",
    "district": "string",
    "location": {
      "type": "Point",
      "coordinates": [number, number]
    }
  },
  "remarks": "string (optional)",
  "healthSnapshot": {
    "bloodPressure": "string (optional)",
    "bloodSugar": "number (optional)"
  } (optional)
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "id": "string",
    "orderNumber": "string",
    "status": "string",
    "price": "number",
    "createdAt": "date"
  }
}
```

### 7.2 获取订单列表
**GET** `/orders`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
status=pending|accepted|started|completed|confirmed|canceled (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "orders": [
      {
        "id": "string",
        "orderNumber": "string",
        "status": "string",
        "serviceType": {
          "id": "string",
          "name": "string"
        },
        "nurse": {
          "id": "string",
          "realname": "string"
        } (optional),
        "price": "number",
        "duration": "number",
        "orderTime": "date",
        "address": {
          "formatted": "string"
        }
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 7.3 获取订单详情
**GET** `/orders/:orderId`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "orderNumber": "string",
    "status": "string",
    "serviceType": {
      "id": "string",
      "name": "string",
      "basePrice": "number"
    },
    "nurse": {
      "id": "string",
      "realname": "string",
      "phone": "string"
    } (optional),
    "user": {
      "id": "string",
      "realname": "string",
      "phone": "string"
    },
    "price": "number",
    "duration": "number",
    "orderTime": "date",
    "startTime": "date" (optional),
    "endTime": "date" (optional),
    "address": {
      "formatted": "string",
      "province": "string",
      "city": "string",
      "district": "string",
      "location": {
        "type": "Point",
        "coordinates": [number, number]
      }
    },
    "remarks": "string",
    "healthSnapshot": {
      "bloodPressure": "string",
      "bloodSugar": "number"
    } (optional),
    "paymentStatus": "string"
  }
}
```

### 7.4 护工接单
**PATCH** `/orders/:orderId/accept`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "接单成功",
  "data": {
    "orderId": "string",
    "status": "accepted"
  }
}
```

### 7.5 开始服务
**PATCH** `/orders/:orderId/start`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "服务开始",
  "data": {
    "orderId": "string",
    "status": "started",
    "startTime": "date"
  }
}
```

### 7.6 完成服务
**PATCH** `/orders/:orderId/complete`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "服务完成",
  "data": {
    "orderId": "string",
    "status": "completed",
    "endTime": "date"
  }
}
```

### 7.7 确认完成
**PATCH** `/orders/:orderId/confirm`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "确认完成",
  "data": {
    "orderId": "string",
    "status": "confirmed"
  }
}
```

### 7.8 取消订单
**PATCH** `/orders/:orderId/cancel`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "reason": "string (optional)"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "订单取消成功",
  "data": {
    "orderId": "string",
    "status": "canceled"
  }
}
```

---

## 8. 健康记录模块

### 8.1 获取健康记录列表
**GET** `/health-records`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
elderlyId=string (optional)
recordType=bloodPressure|bloodSugar|medication|other (optional)
startDate=date (optional)
endDate=date (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "records": [
      {
        "id": "string",
        "elderlyId": "string",
        "recordType": "string",
        "value": "string",
        "measuredAt": "date",
        "recordedBy": "string",
        "aiWarningLevel": "number (optional)",
        "trendAnalysis": "string (optional)"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 8.2 创建健康记录
**POST** `/health-records`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "elderlyId": "string",
  "recordType": "bloodPressure|bloodSugar|medication|other",
  "value": "string",
  "measuredAt": "date"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "记录创建成功",
  "data": {
    "id": "string",
    "elderlyId": "string",
    "recordType": "string",
    "value": "string",
    "measuredAt": "date"
  }
}
```

---

## 9. 紧急警报模块

### 9.1 触发紧急警报
**POST** `/emergency-alerts`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "location": {
    "type": "Point",
    "coordinates": [number, number]
  },
  "audioClip": "string (optional)"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "警报已发送",
  "data": {
    "id": "string",
    "status": "pending",
    "triggerTime": "date"
  }
}
```

### 9.2 获取警报列表
**GET** `/emergency-alerts`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
status=pending|handled|falseAlarm (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "alerts": [
      {
        "id": "string",
        "userId": "string",
        "triggerTime": "date",
        "location": {
          "type": "Point",
          "coordinates": [number, number]
        },
        "status": "string",
        "aiAnalysis": "string (optional)"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 9.3 处理警报
**PATCH** `/emergency-alerts/:alertId/handle`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "警报已处理",
  "data": {
    "alertId": "string",
    "status": "handled",
    "handledBy": "string"
  }
}
```

---

## 10. 评价模块

### 10.1 创建评价
**POST** `/reviews`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "orderId": "string",
  "revieweeId": "string",
  "rating": "number (1-5)",
  "content": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "评价创建成功",
  "data": {
    "id": "string",
    "orderId": "string",
    "rating": "number",
    "content": "string",
    "createdAt": "date"
  }
}
```

### 10.2 获取评价列表
**GET** `/reviews`

**查询参数：**
```
revieweeId=string (optional)
rating=number (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "reviews": [
      {
        "id": "string",
        "orderId": "string",
        "reviewerId": "string",
        "revieweeId": "string",
        "rating": "number",
        "content": "string",
        "createdAt": "date",
        "reviewer": {
          "id": "string",
          "realname": "string"
        }
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

---

## 11. 支付模块

### 11.1 创建支付订单
**POST** `/payments`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "orderId": "string",
  "amount": "number",
  "payMethod": "alipay|wechat|bank"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "支付订单创建成功",
  "data": {
    "id": "string",
    "orderId": "string",
    "amount": "number",
    "payMethod": "string",
    "transactionId": "string",
    "status": "pending"
  }
}
```

### 11.2 支付回调
**POST** `/payments/callback`

**请求体：**
```json
{
  "transactionId": "string",
  "status": "success|failed",
  "amount": "number"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "回调处理成功",
  "data": {
    "transactionId": "string",
    "status": "string"
  }
}
```

### 11.3 获取支付记录
**GET** `/payments`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
status=pending|success|failed (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "payments": [
      {
        "id": "string",
        "orderId": "string",
        "amount": "number",
        "payMethod": "string",
        "status": "string",
        "createdAt": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

---

## 12. 通知模块

### 12.1 获取通知列表
**GET** `/notifications`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
type=order|alert|payment|system (optional)
isRead=true|false (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "notifications": [
      {
        "id": "string",
        "type": "string",
        "title": "string",
        "content": "string",
        "isRead": "boolean",
        "pushTime": "date",
        "relatedId": "string (optional)"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 12.2 标记通知为已读
**PATCH** `/notifications/:notificationId/read`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "标记成功",
  "data": {
    "notificationId": "string",
    "isRead": "true"
  }
}
```

### 12.3 标记所有通知为已读
**PATCH** `/notifications/read-all`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "标记成功",
  "data": {
    "count": "number"
  }
}
```

---

## 13. 客服工单模块

### 13.1 创建工单
**POST** `/support-tickets`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "type": "complaint|inquiry|emergency|other",
  "orderId": "string (optional)",
  "content": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "工单创建成功",
  "data": {
    "id": "string",
    "type": "string",
    "content": "string",
    "status": "pending",
    "createdAt": "date"
  }
}
```

### 13.2 获取工单列表
**GET** `/support-tickets`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
type=complaint|inquiry|emergency|other (optional)
status=pending|in_progress|resolved|closed (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "tickets": [
      {
        "id": "string",
        "type": "string",
        "content": "string",
        "status": "string",
        "createdAt": "date",
        "orderId": "string (optional)"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 13.3 获取工单详情
**GET** `/support-tickets/:ticketId`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "type": "string",
    "content": "string",
    "status": "string",
    "createdAt": "date",
    "resolvedAt": "date (optional)",
    "orderId": "string (optional)",
    "user": {
      "id": "string",
      "realname": "string"
    }
  }
}
```

---

## 14. 文件上传模块

### 14.1 上传文件
**POST** `/upload`

**请求头：**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求体：**
```
file: file
type: avatar|certificate|other
```

**响应体：**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "string",
    "filename": "string",
    "size": "number"
  }
}
```

---

## 15. AI推荐模块

### 15.1 获取服务推荐
**GET** `/ai/recommendations`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
serviceType=string (optional)
location=number,number (optional)
elderlyId=string (optional)
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "recommendations": [
      {
        "nurseId": "string",
        "score": "number",
        "reasons": ["string"],
        "nurse": {
          "id": "string",
          "realname": "string",
          "rating": "number",
          "skillTags": ["string"]
        }
      }
    ]
  }
}
```

### 15.2 获取健康预警
**GET** `/ai/health-warnings`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
elderlyId=string (optional)
severity=low|medium|high (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "warnings": [
      {
        "id": "string",
        "elderlyId": "string",
        "metric": "string",
        "currentValue": "string",
        "trend": "string",
        "severity": "string",
        "suggestedActions": ["string"],
        "sentAt": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

---

## 16. 后台管理模块

### 16.1 获取统计数据
**GET** `/admin/statistics`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
startDate=date (optional)
endDate=date (optional)
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "userStats": {
      "totalUsers": "number",
      "elderlyUsers": "number",
      "familyUsers": "number",
      "nurseUsers": "number",
      "activeUsers": "number"
    },
    "orderStats": {
      "totalOrders": "number",
      "pendingOrders": "number",
      "completedOrders": "number",
      "totalRevenue": "number"
    },
    "serviceStats": {
      "popularServices": [
        {
          "serviceType": "string",
          "count": "number"
        }
      ]
    }
  }
}
```

### 16.2 获取用户列表
**GET** `/admin/users`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
role=elderly|family|nurse|admin (optional)
status=true|false (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "users": [
      {
        "id": "string",
        "role": "string",
        "username": "string",
        "phone": "string",
        "status": "boolean",
        "createdTime": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 16.3 更新用户状态
**PATCH** `/admin/users/:userId/status`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "status": "boolean"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": {
    "userId": "string",
    "status": "boolean"
  }
}
```

### 16.4 审核护工资质
**PATCH** `/admin/certifications/:certId/verify`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "verified": "boolean",
  "reason": "string (optional)"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "审核完成",
  "data": {
    "certId": "string",
    "verified": "boolean",
    "verifiedBy": "string",
    "verifiedAt": "date"
  }
}
```

### 16.5 获取资质审核列表
**GET** `/admin/certifications`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
status=pending|verified|rejected (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "certifications": [
      {
        "id": "string",
        "nurseId": "string",
        "certType": "string",
        "certNumber": "string",
        "status": "string",
        "submittedAt": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 16.6 获取订单列表
**GET** `/admin/orders`

**请求头：**
```
Authorization: Bearer <token>
```

**查询参数：**
```
status=pending|accepted|started|completed|confirmed|canceled (optional)
userId=string (optional)
startDate=date (optional)
endDate=date (optional)
page=1
limit=10
```

**响应体：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "orders": [
      {
        "id": "string",
        "orderNumber": "string",
        "status": "string",
        "user": {
          "id": "string",
          "realname": "string"
        },
        "nurse": {
          "id": "string",
          "realname": "string"
        },
        "price": "number",
        "createdAt": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### 16.7 处理异常订单
**PATCH** `/admin/orders/:orderId/handle`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "action": "cancel|refund|dispute",
  "reason": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "处理完成",
  "data": {
    "orderId": "string",
    "action": "string"
  }
}
```

### 16.8 创建服务类型
**POST** `/admin/services`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "name": "string",
  "basePrice": "number",
  "description": "string",
  "timeUnit": "hour|visit",
  "category": "daily|medical|emergency"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "string",
    "name": "string",
    "basePrice": "number",
    "description": "string",
    "timeUnit": "string",
    "category": "string"
  }
}
```

### 16.9 更新服务类型
**PUT** `/admin/services/:serviceId`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "name": "string",
  "basePrice": "number",
  "description": "string",
  "timeUnit": "hour|visit",
  "category": "daily|medical|emergency"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "string",
    "name": "string",
    "basePrice": "number",
    "description": "string",
    "timeUnit": "string",
    "category": "string"
  }
}
```

### 16.10 删除服务类型
**DELETE** `/admin/services/:serviceId`

**请求头：**
```
Authorization: Bearer <token>
```

**响应体：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "serviceId": "string"
  }
}
```

### 16.11 处理评价申诉
**PATCH** `/admin/reviews/:reviewId/appeal`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "action": "approve|reject",
  "reason": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "处理完成",
  "data": {
    "reviewId": "string",
    "action": "string"
  }
}
```

### 16.12 处理投诉
**PATCH** `/admin/complaints/:complaintId/handle`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "action": "resolve|reject",
  "response": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "处理完成",
  "data": {
    "complaintId": "string",
    "action": "string"
  }
}
```

### 16.13 处理客服工单
**PATCH** `/admin/support-tickets/:ticketId/process`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "status": "in_progress|resolved|closed",
  "response": "string (optional)"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "处理完成",
  "data": {
    "ticketId": "string",
    "status": "string",
    "resolvedAt": "date"
  }
}
```

### 16.14 处理提现申请
**PATCH** `/admin/withdrawals/:withdrawalId/process`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "action": "approve|reject",
  "reason": "string"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "处理完成",
  "data": {
    "withdrawalId": "string",
    "action": "string"
  }
}
```

### 16.15 发布平台公告
**POST** `/admin/announcements`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "title": "string",
  "content": "string",
  "type": "notice|policy|guide"
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "type": "string"
  }
}
```

### 16.16 更新系统配置
**PUT** `/admin/config`

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "platformSettings": {
    "commissionRate": "number",
    "minWithdrawalAmount": "number"
  },
  "paymentSettings": {
    "alipayEnabled": "boolean",
    "wechatEnabled": "boolean"
  },
  "notificationSettings": {
    "smsEnabled": "boolean",
    "pushEnabled": "boolean"
  }
}
```

**响应体：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "platformSettings": {},
    "paymentSettings": {},
    "notificationSettings": {}
  }
}
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

## 通用响应格式

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

## 认证说明

所有需要认证的接口都需要在请求头中包含JWT Token：

```
Authorization: Bearer <token>
```

Token格式：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 分页说明

支持分页的接口都使用以下查询参数：
- `page`: 页码，从1开始
- `limit`: 每页数量，默认10

响应中包含分页信息：
- `total`: 总记录数
- `page`: 当前页码
- `limit`: 每页数量 