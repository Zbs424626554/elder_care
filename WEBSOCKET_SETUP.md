# WebSocket 实时消息系统设置

## 概述

本项目已集成WebSocket实时消息系统，实现了聊天消息的实时传输、用户状态更新和打字状态显示等功能。

## 架构组件

### 前端组件

#### 1. WebSocket服务 (`apps/elderly-app/src/services/websocket.service.ts`)

- 单例模式WebSocket客户端
- 自动重连机制
- 心跳检测
- 事件监听器管理
- 消息类型处理

#### 2. Chat组件集成 (`apps/elderly-app/src/pages/Chat.tsx`)

- WebSocket连接状态显示
- 实时消息接收
- 打字状态显示
- 实时消息发送

### 后端组件

#### 1. WebSocket服务器 (`server/src/index.ts`)

- WebSocket服务器设置
- 用户连接管理
- 消息广播
- 会话用户跟踪
- 不活跃连接清理

## 功能特性

### 1. 实时消息传输

- 发送消息后立即通过WebSocket广播给接收者
- 接收者实时显示新消息
- 支持多人聊天室

### 2. 打字状态

- 实时显示其他用户的打字状态
- 自动停止打字状态（2秒超时）
- 支持多用户同时打字状态显示

### 3. 连接状态管理

- 连接状态指示器（绿色=已连接，红色=未连接）
- 自动重连机制
- 心跳检测保持连接活跃

### 4. 用户状态

- 用户上线/下线状态广播
- 连接超时清理（5分钟）

## 消息类型

### 客户端到服务器

- `message`: 聊天消息
- `typing`: 开始打字
- `stop_typing`: 停止打字
- `ping`: 心跳检测
- `user_online`: 用户上线
- `user_offline`: 用户下线

### 服务器到客户端

- `connected`: 连接确认
- `message`: 新消息
- `typing`: 用户开始打字
- `stop_typing`: 用户停止打字
- `pong`: 心跳回应
- `user_online`: 用户上线通知
- `user_offline`: 用户下线通知

## 使用方法

### 前端集成

```typescript
import WebSocketService from "../services/websocket.service";

// 连接WebSocket
await WebSocketService.connect(username);

// 监听消息
WebSocketService.addEventListener("message", (data) => {
  // 处理新消息
});

// 发送消息
WebSocketService.sendChatMessage(conversationId, content, receivers);

// 断开连接
WebSocketService.disconnect();
```

### 服务器端

WebSocket服务器在主服务器启动时自动启动，监听路径为 `/ws`。

## 部署注意事项

1. **端口配置**: WebSocket使用与HTTP服务器相同的端口
2. **路径**: WebSocket服务路径为 `/ws`
3. **CORS**: 已配置支持开发环境的跨域访问
4. **用户认证**: 通过URL参数传递用户名进行身份验证

## 故障处理

### 连接失败

- 检查服务器是否运行
- 确认WebSocket端口未被占用
- 检查防火墙设置

### 消息不实时

- 检查WebSocket连接状态
- 查看浏览器控制台错误
- 确认用户在线状态

### 断线重连

- 系统会自动尝试重连（3秒间隔）
- 重连失败会继续尝试
- 可通过连接状态指示器查看状态

## 性能优化

1. **连接池管理**: 服务器端维护用户连接映射
2. **消息去重**: 前端避免重复消息显示
3. **内存清理**: 定时清理不活跃连接
4. **心跳机制**: 保持连接活跃，及时发现断线

## 扩展功能

可进一步扩展的功能：

- 文件传输
- 语音/视频通话集成
- 消息加密
- 离线消息推送
- 群组管理
- 消息已读回执
