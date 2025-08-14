# 🗄️ 数据库连接API说明

## 📋 **概述**

本项目已经完成了前后端数据库连接的完整实现，包括：

- ✅ 用户管理API（老人用户CRUD）
- ✅ 健康数据API（实时健康数据、历史记录、统计）
- ✅ 老人健康档案API
- ✅ 认证中间件
- ✅ 前端服务层

## 🚀 **启动步骤**

### **1. 启动后端服务**

```bash
cd elder_care/server
npm install
npm run start:server
```

**后端将在 http://localhost:3000 启动**

### **2. 启动前端服务**

```bash
cd elder_care/apps/family-app
npm install
npm run dev
```

**前端将在 http://localhost:5173 启动**

## 🔌 **API接口列表**

### **用户管理**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| `GET` | `/api/users/role/elderly` | 获取老人用户列表 | 需登录 |
| `GET` | `/api/users/:id` | 获取用户信息 | 需登录 |
| `PUT` | `/api/users/:id` | 更新用户信息 | 需登录 |
| `DELETE` | `/api/users/:id` | 删除用户 | 需登录 |

### **健康数据**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| `GET` | `/api/health-records/:elderlyId/latest` | 获取最新健康数据 | 需登录 |
| `GET` | `/api/health-records/:elderlyId/history` | 获取健康历史记录 | 需登录 |
| `POST` | `/api/health-records` | 创建健康记录 | 需登录 |
| `PUT` | `/api/health-records/:id` | 更新健康记录 | 需登录 |
| `GET` | `/api/health-records/:elderlyId/stats` | 获取健康统计 | 需登录 |
| `GET` | `/api/health-records/:elderlyId/warnings` | 获取健康警告 | 需登录 |

### **老人健康档案**

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| `GET` | `/api/elderhealth/:elderlyId` | 获取老人健康档案 | 需登录 |
| `GET` | `/api/elderhealth` | 获取所有健康档案 | 需登录 |
| `POST` | `/api/elderhealth` | 创建或更新健康档案 | 需登录 |

### **认证**

| 方法 | 路径 | 描述 |
|------|------|------|
| `POST` | `/api/auth/login` | 用户登录 |
| `POST` | `/api/auth/register` | 用户注册 |
| `POST` | `/api/auth/create-elderly` | 创建老人用户 |
| `GET` | `/api/auth/profile` | 获取用户信息 |

## 📊 **数据库集合映射**

| 前端功能 | 后端集合 | 主要字段 |
|----------|----------|----------|
| 老人管理 | `users` | username, realname, phone, role, avatar, status |
| 健康数据 | `health_data` | elderlyId, heartRate, bloodPressure, temperature, bloodSugar |
| 健康档案 | `elder_health_archives` | elderID, name, age, medicals, allergies |
| 健康记录 | `health_records` | elderlyId, recordType, value, measuredAt |

## 🔧 **前端服务使用**

### **老人管理服务**

```typescript
import { ElderlyService } from '../services/elderly.service';

// 获取老人列表
const elderlyList = await ElderlyService.getElderlyList();

// 创建老人
const newElderly = await ElderlyService.createElderly({
  username: 'elderly_1234',
  password: '123456',
  phone: '13800138000',
  realname: '张爷爷'
});
```

### **健康数据服务**

```typescript
import { HealthService } from '../services/health.service';

// 获取健康数据
const healthData = await HealthService.getHealthData('elderlyId');

// 获取健康统计
const stats = await HealthService.getHealthStats('elderlyId', 'month');
```

## 🎯 **测试建议**

### **1. 测试老人管理**
- 访问 `/elderly` 页面
- 尝试添加新老人
- 查看老人列表是否正确显示

### **2. 测试健康数据**
- 访问 `/health` 页面
- 选择不同老人查看健康数据
- 测试AI健康建议功能

### **3. 测试API连接**
- 打开浏览器开发者工具
- 查看Network标签页的API请求
- 确认返回数据格式正确

## ⚠️ **注意事项**

1. **数据库连接**：确保MongoDB服务正在运行
2. **环境变量**：检查`.env`文件中的数据库连接字符串
3. **端口冲突**：确保3000端口未被占用
4. **CORS设置**：后端已配置允许前端域名访问

## 🐛 **常见问题**

### **Q: 前端显示"获取老人列表失败"**
**A:** 检查后端服务是否启动，数据库连接是否正常

### **Q: API返回404错误**
**A:** 确认路由已正确注册，路径拼写正确

### **Q: 数据库查询无结果**
**A:** 检查数据库中是否有测试数据，集合名称是否正确

## 📞 **技术支持**

如果遇到问题，请检查：
1. 后端控制台错误日志
2. 前端浏览器控制台错误
3. 数据库连接状态
4. API请求和响应数据

---

**🎉 恭喜！您的项目现在已经完全连接到真实数据库了！**
