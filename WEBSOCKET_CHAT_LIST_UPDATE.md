# 聊天列表自动更新功能

## 功能概述

实现了聊天列表的实时自动更新功能，当创建新对话或有新消息时，相关用户的聊天列表会自动刷新，无需手动刷新页面。

## 实现原理

### 前端实现 (Message.tsx)

1. **WebSocket连接管理**
   - 在组件加载时自动连接WebSocket
   - 监听对话创建和更新事件
   - 显示连接状态指示器

2. **事件监听**

   ```typescript
   // 监听对话创建/更新事件
   WebSocketService.addEventListener(
     "conversation_created",
     handleConversationUpdate
   );
   WebSocketService.addEventListener(
     "conversation_updated",
     handleConversationUpdate
   );
   WebSocketService.addEventListener("message", handleNewMessage);
   ```

3. **防抖刷新机制**
   - 避免频繁刷新导致的性能问题
   - 1秒延迟合并多个更新请求
   - 自动清理定时器避免内存泄漏

### 后端实现 (server/src/index.ts + message.ts)

1. **WebSocket广播功能**

   ```typescript
   // 广播对话创建事件
   export function broadcastConversationCreated(conversationData: any);

   // 广播对话更新事件
   export function broadcastConversationUpdated(conversationData: any);
   ```

2. **API集成**
   - 创建对话时广播 `conversation_created` 事件
   - 发送消息时广播 `conversation_updated` 事件
   - 向对话所有参与者发送通知

## 触发场景

### 1. 创建新对话

- **触发时机**：用户通过"开始新聊天"创建对话
- **广播事件**：`conversation_created`
- **影响用户**：对话中的所有参与者
- **更新内容**：聊天列表新增对话

### 2. 发送消息

- **触发时机**：在任何对话中发送消息
- **广播事件**：`conversation_updated`
- **影响用户**：对话中的所有参与者
- **更新内容**：聊天列表中的最后消息和时间

### 3. 实时消息

- **触发时机**：接收到实时消息
- **广播事件**：`message`
- **影响用户**：消息接收者
- **更新内容**：聊天列表排序和最后消息

## 用户体验

### 状态指示器

- **绿色圆点 + "实时"**：WebSocket连接正常，支持实时更新
- **红色圆点 + "离线"**：WebSocket连接失败，需要手动刷新

### 自动更新流程

1. 用户A创建与用户B的对话
2. 用户B的聊天列表自动出现新对话
3. 用户A发送消息
4. 用户B的聊天列表自动更新最后消息
5. 无需任何手动操作

## 性能优化

### 1. 防抖机制

```typescript
const debouncedRefreshChatList = () => {
  if (refreshTimeoutRef.current) {
    clearTimeout(refreshTimeoutRef.current);
  }

  refreshTimeoutRef.current = setTimeout(() => {
    loadChatList();
  }, 1000); // 1秒延迟
};
```

### 2. 错误处理

- WebSocket连接失败时不影响基本功能
- 静默处理广播错误，不影响API响应
- 自动重连机制确保稳定性

### 3. 内存管理

- 组件卸载时清理事件监听器
- 清理定时器防止内存泄漏
- 合理的事件订阅/取消机制

## 扩展功能

### 当前支持

- ✅ 对话创建实时通知
- ✅ 消息发送实时更新
- ✅ 连接状态显示
- ✅ 防抖刷新机制
- ✅ 错误回退处理

### 未来扩展

- 🔄 未读消息计数实时更新
- 🔄 用户在线状态实时显示
- 🔄 消息已读状态同步
- 🔄 群组对话支持
- 🔄 消息撤回通知

## 技术细节

### WebSocket事件格式

```typescript
// 对话创建事件
{
  type: "conversation_created",
  data: {
    conversationId: string,
    participants: string[],
    participantDetails: User[],
    isNew: boolean,
    timestamp: number
  }
}

// 对话更新事件
{
  type: "conversation_updated",
  data: {
    conversationId: string,
    participants: string[],
    lastMessage: Message,
    timestamp: number
  }
}
```

### 依赖关系

- 前端：React Hooks, WebSocket Service
- 后端：Express.js, WebSocket Server, MongoDB
- 通信：实时WebSocket + HTTP API

这个实现确保了聊天列表的实时性和用户体验的流畅性，同时保持了系统的稳定性和性能。
