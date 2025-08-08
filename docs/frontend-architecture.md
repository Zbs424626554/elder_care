# 前端架构文档

## 多端口多 SPA 架构

本项目采用多端口多 SPA 架构，每个端口对应一个用户角色的独立前端应用：

- 5173 护工端（nurse-app）
- 5174 老人端（elderly-app）
- 5175 家属端（family-app）
- 5176 管理后台（admin-panel）

所有端口共用一套登录注册系统，用户登录后根据角色自动跳转到对应端口的首页（/home）。

## 统一认证与分流

- 登录注册页面为统一组件，所有端口可复用。
- 登录成功后，前端根据后端返回的 `user.role` 字段，自动用 `window.location.href` 跳转到对应端口的 `/home`。
- 角色与端口映射：
  - elderly → 5174
  - family → 5175
  - nurse → 5173
  - admin → 5176

## Cookie 跨端口 SSO

- 登录成功后，后端将 token 写入 Cookie（domain=localhost，httpOnly）。
- 前端 axios 全局配置 `withCredentials: true`，所有请求自动携带 Cookie。
- 后端 CORS 允许多个端口并允许携带 Cookie。

## 路由守卫与鉴权

- 各端口的路由守卫（如 RootRedirect、PrivateRoute）通过请求 `/api/auth/profile` 判断登录状态。
- 只有已登录且角色匹配时，才能访问对应端口的首页和业务页面，否则自动跳转到 `/login`。

## 主要技术栈

- React 18+、Vite、Ant Design Mobile
- Node.js + Express + MongoDB
- JWT + Cookie 认证
- axios + withCredentials
- TypeScript 5.x 