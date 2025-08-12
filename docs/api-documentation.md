# API详细文档

### 1.2 用户登录
- 接口：`POST /api/admin/login`
- 参数：username, password（只有和护工、管理员）
- 返回：code, data: { user, token }
- 权限：根据角色权限


## 6. 后台管理接口（仅 admin 角色）
### 6.1 用户管理
- 获取用户列表：`GET /api/admin/user/list`
  - 参数：page, pageSize, role, status
  - 返回：用户列表数据
- 审核用户：`POST /api/admin/user/audit`
  - 参数：userId, status, reason
  - 返回：审核结果
- 禁用/启用用户：`POST /api/admin/user/status`
  - 参数：userId, status
  - 返回：操作结果
- 用户详情：`GET /api/admin/user/:id`
  - 返回：用户详细信息
- 权限分配：`POST /api/admin/user/permissions`
  - 参数：userId, permissions, roleId
  - 返回：权限分配结果
- 获取权限列表：`GET /api/admin/permissions`
  - 参数：roleId
  - 返回：权限列表数据

### 6.2 订单管理
- 获取订单列表：`GET /api/admin/order/list`
  - 参数：page, pageSize, status, startDate, endDate
  - 返回：订单列表数据
- 订单详情：`GET /api/admin/order/:id`
  - 返回：订单详细信息
- 订单干预：`POST /api/admin/order/intervene`
  - 参数：orderId, action, reason
  - 返回：操作结果

### 6.3 服务内容管理
- 获取服务列表：`GET /api/admin/service/list`
  - 参数：page, pageSize, category
  - 返回：服务列表数据
- 添加服务：`POST /api/admin/service/add`
  - 参数：name, description, price, category, requirements
  - 返回：添加结果
- 修改服务：`PUT /api/admin/service/:id`
  - 参数：name, description, price, category, requirements
  - 返回：修改结果
- 删除服务：`DELETE /api/admin/service/:id`
  - 返回：删除结果

### 6.4 评价投诉管理
- 获取评价列表：`GET /api/admin/review/list`
  - 参数：page, pageSize, rating, status
  - 返回：评价列表数据
- 获取投诉列表：`GET /api/admin/complaint/list`
  - 参数：page, pageSize, status, priority
  - 返回：投诉列表数据
- 处理投诉：`POST /api/admin/complaint/process`
  - 参数：complaintId, status, response, handledBy
  - 返回：处理结果

### 6.5 客服工单
- 获取工单列表：`GET /api/admin/support/list`
  - 参数：page, pageSize, status, priority, type
  - 返回：工单列表数据
- 工单详情：`GET /api/admin/support/:id`
  - 返回：工单详细信息
- 回复工单：`POST /api/admin/support/reply`
  - 参数：ticketId, content, attachments
  - 返回：回复结果
- 关闭工单：`POST /api/admin/support/close`
  - 参数：ticketId, resolution
  - 返回：操作结果

### 6.6 数据统计
- 获取统计数据：`GET /api/admin/statistics`
  - 参数：timeRange, dataType
  - 返回：统计数据
- 获取收入报表：`GET /api/admin/statistics/revenue`
  - 参数：startDate, endDate, groupBy
  - 返回：收入数据
- 获取用户增长数据：`GET /api/admin/statistics/users`
  - 参数：startDate, endDate, groupBy
  - 返回：用户增长数据
- 获取服务使用情况：`GET /api/admin/statistics/services`
  - 参数：startDate, endDate, serviceId
  - 返回：服务使用数据

### 6.7 内容管理
- 发布公告：`POST /api/admin/announcement`
  - 参数：title, content, targetRole, importance, expireAt
  - 返回：发布结果
- 获取公告列表：`GET /api/admin/announcement/list`
  - 参数：page, pageSize, status
  - 返回：公告列表数据
- 修改公告：`PUT /api/admin/announcement/:id`
  - 参数：title, content, targetRole, importance, expireAt
  - 返回：修改结果
- 删除公告：`DELETE /api/admin/announcement/:id`
  - 返回：删除结果

### 6.8 基础配置
- 更新系统配置：`POST /api/admin/config`
  - 参数：configKey, configValue, description
  - 返回：更新结果
- 获取系统配置：`GET /api/admin/config/list`
  - 参数：configType
  - 返回：配置列表数据
- 批量更新配置：`POST /api/admin/config/batch`
  - 参数：configList
  - 返回：批量更新结果

---

详细数据库结构请参考 `database-design.md`。 