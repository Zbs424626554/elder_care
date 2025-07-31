# 智慧养老综合服务平台

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.4.0-green.svg)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/atlas)

## 📋 项目概述

智慧养老综合服务平台是一个连接家庭用户（老人、家属）、护工（个人或机构）的桥梁，提供安全监控、服务匹配、支付保障，并由后台和AI进行支撑和优化。

### 🎯 核心目标

- **安全监控**: 为老人提供一键紧急呼叫功能
- **服务匹配**: 智能推荐合适的护工服务
- **支付保障**: 安全的在线支付和资金管理
- **健康管理**: 实时健康数据监测和预警
- **统一管理**: 后台管理系统进行全平台监管

## 🏗️ 技术架构

### 前端技术栈
- **React 19.1.0** - 用户端应用框架
- **Vue 3.4.0** - 管理后台框架
- **TypeScript 5.8.3** - 类型安全
- **Vite** - 构建工具
- **Ant Design** - UI组件库
- **React Router DOM** - 路由管理
- **Axios** - HTTP客户端

### 后端技术栈
- **Node.js** - 运行环境
- **Express.js** - Web框架
- **TypeScript** - 类型安全
- **MongoDB** - 数据库
- **Mongoose** - ODM
- **JWT** - 身份认证
- **Multer** - 文件上传

### 开发工具
- **ESLint** - 代码规范
- **Prettier** - 代码格式化
- **Husky** - Git Hooks
- **Lint-staged** - 暂存文件检查

## 📁 项目结构

```
smart-aging/
├── apps/                    # 前端应用
│   ├── elderly-app/        # 老人端应用 (React + Vite)
│   ├── family-app/         # 家属端应用 (React + Vite)
│   ├── nurse-app/          # 护工端应用 (React + Vite)
│   └── admin-panel/        # 管理后台 (Vue + Vite)
├── packages/               # 共享包
│   ├── utils/             # 工具类
│   ├── services/          # API服务
│   ├── components/        # 公共组件
│   ├── pages/            # 共享页面
│   └── types/            # 类型定义
├── server/                # 后端服务
│   └── src/
│       ├── controllers/   # 控制器
│       ├── routes/        # 路由
│       ├── models/        # 数据模型
│       ├── middleware/    # 中间件
│       └── services/      # 业务服务
└── docs/                  # 项目文档
```

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 9.0.0 或更高版本
- **MongoDB**: 4.4 或更高版本

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd smart-aging

# 安装所有依赖
npm run install:all
```

### 启动开发环境

```bash
# 启动后端服务
npm run start:server

# 启动前端应用（分别启动）
npm run dev:elderly    # 老人端 http://localhost:5173
npm run dev:family     # 家属端 http://localhost:5174
npm run dev:nurse      # 护工端 http://localhost:5175
npm run dev:admin      # 管理后台 http://localhost:5176
```

### 端口分配

| 应用 | 端口 | 访问地址 |
|------|------|----------|
| 后端服务 | 3001 | http://localhost:3001 |
| 老人端 | 5173 | http://localhost:5173 |
| 家属端 | 5174 | http://localhost:5174 |
| 护工端 | 5175 | http://localhost:5175 |
| 管理后台 | 5176 | http://localhost:5176 |

## 🎨 功能特性

### 1. 老年用户端
- **统一登录注册**: 支持手机号密码登录
- **个人档案管理**: 基本信息、健康档案、紧急联系人
- **护工服务查看**: 浏览推荐护工、查看资质评分
- **订单管理**: 查看服务状态、确认服务完成
- **一键紧急呼叫**: 显著按钮，立即通知紧急联系人
- **健康数据查看**: 查看关键健康指标记录

### 2. 家属用户端
- **个人信息管理**: 绑定老人、完善个人信息
- **服务需求发布**: 描述服务类型、时间、地点
- **护工匹配支付**: 智能推荐、在线支付
- **服务进度跟踪**: 实时查看服务状态
- **健康数据管理**: 录入和查看老人健康数据
- **健康预警**: AI分析健康数据异常

### 3. 护工用户端
- **个人资料认证**: 提交真实信息、资质证明
- **服务订单管理**: 浏览需求、接单、服务记录
- **收入管理**: 查看收入、申请提现
- **评价申诉**: 查看评价、申诉不实评价
- **日程管理**: 查看已接订单日程

### 4. 后台管理系统
- **用户管理**: RBAC权限控制、用户审核
- **订单管理**: 全平台订单查看、异常处理
- **服务内容管理**: 定义服务项目、价格体系
- **评价投诉管理**: 处理评价申诉、投诉
- **数据统计**: 关键指标、数据报表
- **客服工单**: 处理客服咨询、紧急呼叫

## 🔐 认证与权限

### 统一认证系统
- **JWT Token**: 基于JWT的身份认证
- **角色权限**: elderly/family/nurse/admin
- **路由守卫**: 基于角色的路由保护
- **API权限**: 中间件验证token和角色

### 权限控制
```typescript
// 角色定义
type UserRole = 'elderly' | 'family' | 'nurse' | 'admin';

// 路由守卫
<PrivateRoute requiredRoles={['elderly']}>
  <ElderlyComponent />
</PrivateRoute>
```

## 📊 数据库设计

### 核心集合
- **users**: 用户信息（多态设计）
- **orders**: 订单管理
- **reviews**: 评价系统
- **health_records**: 健康记录
- **emergency_alerts**: 紧急警报
- **payments**: 支付交易
- **notifications**: 通知消息
- **certifications**: 资质认证

### 数据模型特点
- **多态设计**: 用户模型支持不同角色
- **地理索引**: 支持地理位置查询
- **时间戳**: 自动记录创建和更新时间
- **关联关系**: 完整的业务关联

## 🔧 开发规范

### 代码规范
- **TypeScript**: 严格类型检查
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git提交前检查

### 提交规范
```bash
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式化
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 📚 文档

### 技术文档
- [API接口文档](./docs/api-documentation.md) - 完整的API接口说明
- [数据库设计文档](./docs/database-design.md) - 数据库结构设计
- [前端架构文档](./docs/frontend-architecture.md) - 前端架构设计
- [项目状态总结](./docs/project-status-summary.md) - 当前项目状态

### 功能规划
- [智慧养老功能规划2.0](./docs/智慧养老功能规划2.0.md) - 详细的功能规划文档

## 🧪 测试

### 测试策略
- **单元测试**: 组件、服务、工具函数测试
- **集成测试**: 路由、权限、API测试
- **端到端测试**: 完整业务流程测试

### 运行测试
```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "auth"
```

## 🚀 部署

### 生产环境部署
```bash
# 构建前端应用
npm run build:elderly
npm run build:family
npm run build:nurse
npm run build:admin

# 启动后端服务
npm run start:server:prod
```

### 环境变量配置
```env
# 数据库配置
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-aging

# JWT配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=3001
NODE_ENV=production
```

## 🤝 贡献指南

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码审查
- 所有代码变更需要经过审查
- 确保代码符合项目规范
- 添加必要的测试用例

## 📄 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- **项目负责人**: [项目负责人姓名]
- **技术支持**: [技术支持邮箱]
- **问题反馈**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户。

---

**智慧养老综合服务平台** - 让科技温暖每一个家庭 🏠❤️ 