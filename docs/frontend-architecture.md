# 前端架构设计文档

## 🎯 架构概述

### 统一登录 + 角色分流架构

本系统采用**统一登录、角色分流**的前端架构设计：

1. **统一认证系统**：所有用户使用同一套登录/注册系统（位于 `packages/pages/auth/`）
2. **角色选择注册**：注册时选择角色，决定后续功能权限
3. **智能路由分流**：登录后根据角色自动跳转到对应模块
4. **路由守卫保护**：基于角色的权限控制和路由保护

## 📁 目录结构

```
smart-aging/
├── apps/                    # 前端应用
│   ├── elderly-app/        # 老人端应用 (React + Vite)
│   ├── family-app/         # 家属端应用 (React + Vite)
│   ├── nurse-app/          # 护工端应用 (React + Vite)
│   └── admin-panel/        # 管理后台 (Vue + Vite)
├── packages/               # 共享包
│   ├── utils/             # 工具类
│   │   └── request.ts     # Axios二次封装
│   ├── services/          # API服务层
│   │   └── auth.service.ts # 认证服务
│   ├── components/        # 公共组件
│   │   └── PrivateRoute.tsx # 路由守卫组件
│   ├── pages/            # 共享页面
│   │   └── auth/         # 认证页面
│   │       ├── Login.tsx     # 统一登录页
│   │       └── Register.tsx  # 统一注册页
│   └── types/            # 类型定义
└── server/               # 后端服务
    └── src/
        ├── controllers/   # 控制器
        ├── routes/        # 路由
        ├── models/        # 数据模型
        ├── middleware/    # 中间件
        └── services/      # 业务服务
```

## 🔐 认证流程

### 1. 注册流程
```
用户访问注册页 → 选择角色 → 填写信息 → 提交注册 → 保存用户信息 → 跳转到对应角色首页
```

### 2. 登录流程
```
用户访问登录页 → 输入手机号密码 → 提交登录 → 获取用户信息 → 根据角色跳转到对应首页
```

### 3. 路由守卫流程
```
访问路由 → 检查登录状态 → 检查角色权限 → 允许访问或重定向
```

## 🛣️ 路由设计

### 应用端口分配
- **老人端**: http://localhost:5173
- **家属端**: http://localhost:5174
- **护工端**: http://localhost:5175
- **管理后台**: http://localhost:5176
- **后端服务**: http://localhost:3001

### 路由结构
```
/                    # 根路径，自动重定向
├── login           # 统一登录页
├── register        # 统一注册页
├── home            # 应用首页
├── profile         # 个人信息
├── health          # 健康管理
├── nurses          # 护工列表
├── orders          # 订单管理
├── emergency       # 紧急呼叫
├── elderly         # 绑定老人（家属端）
├── warnings        # 健康预警（家属端）
├── certification   # 资质管理（护工端）
├── income          # 收入统计（护工端）
└── schedule        # 日程安排（护工端）
```

### 跨应用跳转逻辑
```typescript
const roleRedirectMap: Record<UserRole, string> = {
  elderly: '/elderly-app',    // 跳转到老人端应用
  family: '/family-app',      // 跳转到家属端应用
  nurse: '/nurse-app',        // 跳转到护工端应用
  admin: '/admin-panel'       // 跳转到管理后台
};
```

## 🔧 核心组件

### 1. Axios封装 (`packages/utils/request.ts`)
```typescript
// 获取API基础URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    return '/api';
  }
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
};

// 请求拦截器：自动添加token和角色信息
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userRole) {
    config.headers['X-User-Role'] = userRole;
  }
  
  return config;
});

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => {
    if (response.data.code !== 200) {
      // 处理业务错误
      switch (response.data.code) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
          break;
        // 其他错误处理...
      }
    }
    return response.data;
  },
  (error) => {
    // 处理网络错误
  }
);
```

### 2. 路由守卫 (`packages/components/PrivateRoute.tsx`)
```typescript
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = '/login'
}) => {
  const isLoggedIn = AuthService.isLoggedIn();
  const currentRole = AuthService.getCurrentRole();

  // 检查登录状态
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // 检查角色权限
  if (requiredRoles.length > 0 && currentRole) {
    const hasPermission = requiredRoles.includes(currentRole);
    if (!hasPermission) {
      // 重定向到对应角色的应用
      const roleRedirectMap = {
        elderly: '/elderly-app',
        family: '/family-app',
        nurse: '/nurse-app',
        admin: '/admin-panel'
      };
      return <Navigate to={roleRedirectMap[currentRole]} replace />;
    }
  }

  return <>{children}</>;
};
```

### 3. 认证服务 (`packages/services/auth.service.ts`)
```typescript
export class AuthService {
  // 用户注册
  static async register(params: RegisterParams): Promise<ApiResponse<LoginResponse>>
  
  // 用户登录
  static async login(params: LoginParams): Promise<ApiResponse<LoginResponse>>
  
  // 获取用户信息
  static async getProfile(): Promise<ApiResponse<UserInfo>>
  
  // 检查登录状态
  static isLoggedIn(): boolean
  
  // 获取当前角色
  static getCurrentRole(): UserRole | null
  
  // 保存用户信息
  static saveUserInfo(token: string, user: UserInfo): void
  
  // 退出登录
  static logout(): void
}
```

## 🎨 页面设计

### 1. 统一登录页 (`packages/pages/auth/Login.tsx`)
- **设计风格**：现代化渐变背景
- **功能特点**：手机号+密码登录
- **交互流程**：登录成功 → 根据角色跳转到对应应用

### 2. 统一注册页 (`packages/pages/auth/Register.tsx`)
- **设计风格**：卡片式布局
- **功能特点**：角色选择（Radio.Group）+ 信息填写
- **交互流程**：选择角色 → 填写信息 → 注册成功

### 3. 角色选择设计
```typescript
const roleOptions = [
  { value: 'elderly', label: '老人', icon: '👴', desc: '享受养老服务' },
  { value: 'family', label: '家属', icon: '👨‍👩‍👧‍👦', desc: '关注老人健康' },
  { value: 'nurse', label: '护工', icon: '👩‍⚕️', desc: '提供护理服务' }
];
```

## 🔒 权限控制

### 1. 路由级权限
- **公共路由**：`/login`, `/register`
- **角色路由**：各应用内部路由
- **404处理**：未匹配路由重定向到根路径

### 2. 组件级权限
- **角色守卫**：`PrivateRoute` 组件
- **通用守卫**：基于角色的权限检查

### 3. API级权限
- **请求头携带**：`Authorization: Bearer token`
- **角色标识**：`X-User-Role: role`
- **后端验证**：中间件验证token和角色权限

## 🚀 部署配置

### 1. 环境变量
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

### 2. 构建配置
```json
{
  "scripts": {
    "dev:elderly": "cd apps/elderly-app && npm run dev",
    "dev:family": "cd apps/family-app && npm run dev",
    "dev:nurse": "cd apps/nurse-app && npm run dev",
    "dev:admin": "cd apps/admin-panel && npm run dev"
  }
}
```

## 📱 响应式设计

### 1. 移动端适配
- **断点设置**：xs(480px), sm(576px), md(768px), lg(992px), xl(1200px)
- **组件适配**：使用Ant Design的响应式组件
- **布局调整**：根据屏幕尺寸调整布局

### 2. 用户体验
- **加载状态**：请求时显示loading
- **错误处理**：统一的错误提示
- **成功反馈**：操作成功后的提示

## 🔄 状态管理

### 1. 本地存储
```typescript
// 用户信息存储
localStorage.setItem('token', token);
localStorage.setItem('userRole', user.role);
localStorage.setItem('userInfo', JSON.stringify(user));
```

### 2. 全局状态
- **用户信息**：当前登录用户信息
- **权限信息**：用户角色和权限
- **主题设置**：应用主题配置

## 🧪 测试策略

### 1. 单元测试
- **组件测试**：路由守卫组件测试
- **服务测试**：API服务测试
- **工具测试**：工具函数测试

### 2. 集成测试
- **路由测试**：路由跳转测试
- **权限测试**：权限控制测试
- **API测试**：接口调用测试

## 📈 性能优化

### 1. 代码分割
```typescript
// 路由懒加载
const ElderlyLayout = lazy(() => import('../pages/elderly/Layout'));
const FamilyLayout = lazy(() => import('../pages/family/Layout'));
```

### 2. 缓存策略
- **API缓存**：常用数据缓存
- **组件缓存**：React.memo优化
- **路由缓存**：keep-alive效果

## 🔧 开发规范

### 1. 代码规范
- **TypeScript**：严格类型检查
- **ESLint**：代码质量检查
- **Prettier**：代码格式化

### 2. 提交规范
```bash
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式化
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 🎯 总结

这个前端架构设计实现了：

1. **统一认证**：所有用户使用同一套登录系统（位于packages）
2. **角色分流**：根据角色自动跳转到对应应用
3. **权限控制**：基于角色的路由和API权限控制
4. **用户体验**：现代化的UI设计和流畅的交互
5. **可维护性**：清晰的代码结构和完善的文档

### 当前实现状态
- ✅ 统一登录/注册页面
- ✅ 角色选择（Radio.Group形式）
- ✅ 跨应用跳转逻辑
- ✅ 路由守卫组件
- ✅ Axios封装
- ✅ 移动端适配

### 下一步开发重点
1. 完善各应用的具体页面内容
2. 实现与后端API的数据交互
3. 添加更多业务功能
4. 优化用户体验

这种架构既保证了系统的安全性，又提供了良好的用户体验，是一个成熟的前端解决方案。 