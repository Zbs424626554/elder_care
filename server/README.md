# 养老服务后端API

## 项目结构

```
server/
├── src/
│   ├── config/          # 配置文件
│   │   └── db.ts       # 数据库连接配置
│   ├── controllers/     # 控制器层
│   ├── docs/            # 文档
│   │   └── response-format.md  # 响应格式规范
│   │   ├── auth.controller.ts    # 认证控制器
│   │   ├── review.controller.ts  # 评价控制器
│   │   └── complaint.controller.ts # 投诉控制器
│   ├── middleware/      # 中间件
│   │   ├── auth.middleware.ts    # 认证中间件
│   │   ├── role.middleware.ts    # 角色权限中间件
│   │   └── response.middleware.ts # 响应格式中间件
│   ├── models/          # 数据模型
│   │   ├── user.model.ts         # 用户模型
│   │   ├── review.model.ts       # 评价模型
│   │   ├── complaint.model.ts    # 投诉模型
│   │   └── index.ts              # 模型导出
│   ├── routes/          # 路由
│   │   ├── auth.routes.ts        # 认证路由
│   │   ├── review.routes.ts      # 评价路由
│   │   └── complaint.routes.ts   # 投诉路由
│   ├── utils/           # 工具函数
│   │   └── jwt.ts               # JWT工具
│   └── index.ts         # 应用入口
├── package.json
├── tsconfig.json
└── README.md
```

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 环境配置
创建 `.env` 文件并配置以下环境变量：
```env
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/elder_care

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# 服务器配置
PORT=5000
NODE_ENV=development
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 构建生产版本
```bash
npm run build
npm start
```

## API接口

### 统一响应格式
所有API接口均返回统一的响应格式，详见 [响应格式规范](./src/docs/response-format.md)。

```json
{
  "code": 200,           // 状态码
  "status": "success",   // 状态：success 或 error
  "message": "操作成功",  // 响应消息
  "data": {},            // 响应数据
  "timestamp": "2023-06-01T12:34:56.789Z" // 时间戳
}
```

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新令牌

### 评价接口
- `GET /api/reviews` - 获取评价列表
- `GET /api/reviews/:id` - 获取评价详情
- `POST /api/reviews/:id/appeal` - 提交申诉
- `PUT /api/reviews/:id/appeal` - 处理申诉

### 投诉接口
- `GET /api/complaints` - 获取投诉列表
- `GET /api/complaints/:id` - 获取投诉详情
- `POST /api/complaints` - 创建投诉
- `PUT /api/complaints/:id/status` - 更新投诉状态

## 数据模型

### 用户模型 (User)
```typescript
interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'elderly' | 'family' | 'nurse' | 'admin';
  realname?: string;
  phone?: string;
  avatar?: string;
  status: boolean;
  createdAt: Date;
}
```

### 评价模型 (Review)
```typescript
interface IReview {
  orderId: ObjectId;
  reviewerId: ObjectId;
  revieweeId: ObjectId;
  rating: number;
  content: string;
  hasAppeal: boolean;
  appealContent?: string;
  appealStatus?: AppealStatus;
  appealResolution?: string;
  createdAt: Date;
}
```

### 投诉模型 (Complaint)
```typescript
interface IComplaint {
  orderId?: ObjectId;
  complainantId: ObjectId;
  targetId?: ObjectId;
  reviewId?: ObjectId;
  type: ComplaintType;
  title: string;
  description: string;
  status: ComplaintStatus;
  handledBy?: ObjectId;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 权限控制

### 角色权限
- **管理员 (admin)**：可以访问所有功能
- **护工 (nurse)**：可以查看和申诉与自己相关的评价
- **家属 (family)**：可以查看自己提交的投诉
- **老人 (elderly)**：可以查看自己提交的投诉

### 中间件
- `authenticateJWT`：验证JWT令牌
- `isAdmin`：检查管理员权限
- `authorize`：基于角色的授权

## 错误处理

所有API响应都遵循统一的格式：
```typescript
interface ApiResponse<T> {
  code: number;      // 状态码
  message: string;   // 消息
  data: T;          // 数据
}
```

### 状态码
- `200`：成功
- `400`：请求参数错误
- `401`：未授权
- `403`：权限不足
- `404`：资源不存在
- `500`：服务器错误

## 开发指南

### 添加新的控制器
1. 在 `controllers/` 目录下创建新的控制器文件
2. 实现相应的业务逻辑
3. 在 `routes/` 目录下创建对应的路由文件
4. 在 `src/index.ts` 中注册路由

### 添加新的数据模型
1. 在 `models/` 目录下创建新的模型文件
2. 定义接口和Schema
3. 在 `models/index.ts` 中导出模型

### 添加新的中间件
1. 在 `middleware/` 目录下创建新的中间件文件
2. 实现中间件逻辑
3. 在路由中使用中间件

## 部署

### 生产环境配置
1. 设置 `NODE_ENV=production`
2. 配置生产环境的数据库连接
3. 使用强密钥配置JWT
4. 启用HTTPS
5. 配置日志记录

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 监控和日志

- 使用Morgan记录HTTP请求日志
- 数据库连接状态监控
- JWT令牌验证日志
- 错误日志记录

## 安全考虑

1. **JWT安全**：使用强密钥，设置合理的过期时间
2. **数据库安全**：使用环境变量配置数据库连接
3. **CORS配置**：限制允许的源
4. **输入验证**：验证所有用户输入
5. **权限控制**：确保用户只能访问授权的内容 