# RBAC 权限分配系统

本文档描述了系统中实现的基于角色的访问控制（RBAC）权限分配系统。

## 系统概述

权限系统基于用户角色控制菜单项的显示和页面访问权限。用户登录后，根据其角色显示对应的菜单项，并限制只能访问有权限的页面。同时，系统还实现了API级别的权限控制，确保用户只能调用其角色允许的API。

## 核心组件

### 1. 权限配置 (`permissions.ts`)

定义了不同角色可访问的菜单项、路由路径和API端点。

- `rolePermissions`: 配置每个角色可访问的菜单项和API
- `getPermissionsByRole`: 获取指定角色的权限列表
- `canAccessRoute`: 检查角色是否可以访问特定路径
- `getApiEndpointsByRole`: 获取指定角色可访问的API端点列表

### 2. 权限钩子 (`usePermissions.ts`)

提供了在组件中使用权限系统的React Hook。

- 获取当前用户角色的权限列表
- 提供路径访问权限检查方法

### 3. 页面路由保护 (`PrivateRoute.tsx`)

实现了对路由的权限保护：

- 检查用户是否已登录
- 检查用户是否拥有访问特定路由的权限
- 无权限时重定向到仪表盘页面

### 4. 布局菜单过滤 (`Layout.tsx`)

在侧边栏中只显示当前用户角色有权访问的菜单项。

### 5. API权限拦截器 (`ApiInterceptor.ts`)

实现了API级别的权限控制：

- 在发送请求前检查用户是否有权限访问特定API端点
- 无权限时拦截请求并显示错误信息
- 处理认证令牌和刷新令牌逻辑

## 配置角色

系统中定义了以下角色：

1. `admin_super`: 超级管理员，可访问所有功能和API
2. `finance`: 财务人员，可访问财务相关页面（支付结算、数据汇总、订单管理）
3. `reviewer`: 审核员，可访问审核相关页面（审核控制、评价与投诉、客服工单）
4. `cs_manager`: 客服主管，可访问客服相关页面（用户管理、服务管理、订单管理、纠纷处理、评价与投诉、客服工单、内容管理）
5. `content_manager`: 内容管理员，可访问内容相关页面（内容管理、服务管理）
6. `system_admin`: 系统管理员，可访问系统相关页面（用户管理、系统设置、基础配置）

## 功能页面与API对应关系

| 页面路径 | 页面名称 | 对应API |
|---------|---------|--------|
| `/dashboard/users` | 用户管理 | `GET /api/admin/user/list` `POST /api/admin/user/audit` |
| `/dashboard/orders` | 订单管理 | `GET /api/admin/order/list` |
| `/dashboard/services` | 服务管理 | `GET /api/admin/service/list` |
| `/dashboard/reviews-complaints` | 评价与投诉 | `GET /api/admin/review/list` `GET /api/admin/support/list` |
| `/dashboard/data-summary` | 数据汇总 | `GET /api/admin/statistics` |
| `/dashboard/announcements` | 内容管理 | `POST /api/admin/announcement` |
| `/dashboard/support-tickets` | 客服工单 | `GET /api/admin/support/list` |
| `/dashboard/config` | 基础配置 | `POST /api/admin/config` |

## 权限控制流程

1. **UI层权限控制**：
   - 用户登录后，根据角色过滤侧边栏菜单项
   - 用户只能看到其角色允许访问的菜单

2. **路由层权限控制**：
   - 用户尝试访问页面时，检查是否有权限
   - 无权限时重定向到仪表盘或显示"无权访问"页面

3. **API层权限控制**：
   - 发送API请求前，检查用户是否有权限访问该API
   - 无权限时拦截请求并显示错误信息

## 添加新角色步骤

1. 在 `permissions.ts` 的 `rolePermissions` 中添加新角色配置
2. 定义该角色可访问的菜单项和API端点

## 添加新API端点步骤

1. 在 `permissions.ts` 中找到相关角色
2. 在对应菜单项的 `apiEndpoints` 数组中添加新的API端点

## 测试方法

可通过以下用户进行测试：
- 用户名：`admin` - 超级管理员角色
- 用户名：`finance` - 财务角色
- 用户名：`reviewer` - 审核员角色
- 用户名：`cs` - 客服主管角色
- 用户名：`content` - 内容管理员角色
- 用户名：`system` - 系统管理员角色

密码可以使用任意值（系统使用模拟登录）。

登录后，不同角色只能看到和访问有权限的菜单项，并且只能调用其角色允许的API。 