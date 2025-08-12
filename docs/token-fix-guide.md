# 访问令牌无效或已过期问题解决方案

## 问题描述
用户在使用系统时遇到"访问令牌无效或已过期"的错误，导致无法正常使用系统功能。

## 问题原因
1. **JWT令牌过期**: 访问令牌(Access Token)有效期为1小时，过期后需要刷新
2. **令牌格式错误**: 损坏的或格式不正确的令牌
3. **服务器时间不同步**: 客户端和服务器时间差异导致的过期判断错误
4. **令牌刷新失败**: 刷新令牌(Refresh Token)过期或无效

## 解决方案

### 1. 前端改进
#### 新增 TokenManager 工具类
- **位置**: `apps/admin-panel/src/utils/TokenManager.ts`
- **功能**:
  - 自动检测令牌是否即将过期(5分钟内)
  - 后台自动刷新即将过期的令牌
  - 处理令牌格式验证
  - 统一的令牌清理方法

#### 改进 ApiInterceptor
- **位置**: `apps/admin-panel/src/services/ApiInterceptor.ts`
- **改进内容**:
  - 请求拦截器中集成令牌有效性检查
  - 响应拦截器中优化令牌刷新逻辑
  - 防止无限刷新循环
  - 统一错误处理和用户提示

#### 优化 AuthService
- **位置**: `apps/admin-panel/src/services/AuthService.ts`
- **优化内容**:
  - 添加令牌验证方法
  - 改进登录状态检查逻辑
  - 防止认证检查循环

### 2. 后端改进
#### 增强认证中间件
- **位置**: `server/src/middleware/auth.middleware.ts`
- **改进内容**:
  - 详细的JWT错误分类和处理
  - 更明确的错误消息返回
  - 统一的响应格式
  - 增强的日志记录

#### 优化令牌刷新接口
- **功能增强**:
  - 更详细的错误响应
  - 更好的错误分类
  - 安全的Cookie设置

## 使用方法

### 1. 自动令牌管理
系统现在会自动处理令牌过期问题：
- 当令牌在5分钟内过期时，后台自动刷新
- 当令牌已过期时，API请求时自动刷新
- 刷新失败时，自动清除认证信息并跳转登录页

### 2. 手动令牌操作
```typescript
import { TokenManager } from '../utils/TokenManager';

// 检查令牌是否有效
const isValid = TokenManager.isValidTokenFormat(token);

// 检查令牌是否过期
const isExpired = TokenManager.isTokenExpired(token);

// 检查令牌是否即将过期
const expiringSoon = TokenManager.isTokenExpiringSoon(token);

// 获取有效的访问令牌
const validToken = await TokenManager.getValidAccessToken();

// 手动刷新令牌
const refreshed = await TokenManager.refreshAccessToken();

// 清除所有令牌
TokenManager.clearAllTokens();
```

### 3. 测试令牌管理
访问测试页面来验证令牌管理功能：
- 路径: `/token-test` (需要在路由中配置)
- 功能: 实时查看令牌状态、手动刷新令牌、清除令牌等

## 配置说明

### 环境变量
```bash
# JWT配置 (server/.env)
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# API基础URL (前端)
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### 令牌有效期
- **访问令牌**: 1小时 (可通过JWT_ACCESS_EXPIRES_IN配置)
- **刷新令牌**: 7天 (可通过JWT_REFRESH_EXPIRES_IN配置)

## 错误处理流程

### 1. 401/403 错误处理
```
API请求 → 401/403错误 → 检查是否令牌相关错误 → 
  ↓ 是令牌错误
尝试刷新令牌 → 刷新成功 → 重试原始请求
  ↓ 刷新失败
清除认证信息 → 跳转登录页
```

### 2. 令牌预检查流程
```
发送API请求 → 检查令牌格式 → 检查是否即将过期 → 
  ↓ 即将过期
后台刷新令牌 → 继续发送请求
```

## 常见问题和解决方案

### Q: 仍然出现令牌过期错误
**A**: 
1. 检查系统时间是否正确
2. 确认服务器和客户端时间同步
3. 检查网络连接是否稳定
4. 查看浏览器控制台的详细错误信息

### Q: 无法自动刷新令牌
**A**: 
1. 检查刷新令牌是否存在: `localStorage.getItem('refreshToken')`
2. 确认刷新令牌API端点是否可访问
3. 检查CORS配置是否正确

### Q: 登录后立即显示令牌过期
**A**: 
1. 检查JWT密钥配置是否正确
2. 确认服务器时间设置
3. 验证令牌生成逻辑

## 监控和调试

### 1. 浏览器控制台
查看详细的令牌处理日志：
- 令牌验证过程
- 刷新令牌请求
- 错误详情

### 2. 服务器日志
检查认证中间件的日志输出：
- 令牌验证结果
- 刷新令牌处理过程
- 错误信息

### 3. 令牌测试页面
使用 `/token-test` 页面实时监控令牌状态。

## 总结
通过以上改进，系统现在具备了：
- 自动令牌过期检测和刷新
- 统一的错误处理机制
- 详细的错误分类和提示
- 防止无限循环的安全机制
- 完整的令牌生命周期管理

这些改进应该能够完全解决"访问令牌无效或已过期"的问题，并提供更好的用户体验。
