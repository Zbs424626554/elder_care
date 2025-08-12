# 养老服务系统启动指南

本文档提供了如何启动养老服务系统的各个组件的详细说明。

## 快速启动（推荐）

我们提供了一个简单的批处理脚本，可以快速启动系统的各个组件：

```bash
# 在项目根目录下运行
start.bat
```

运行后，您可以选择要启动的组件：
1. 启动开发环境（后端+管理面板）
2. 启动后端服务器（开发模式）
3. 启动后端服务器（生产模式）
4. 启动管理员面板
5. 启动老人端应用
6. 启动家属端应用
7. 启动护工端应用
8. 安装所有依赖

## 使用NPM脚本启动

项目根目录的package.json中提供了多个启动脚本：

```bash
# 启动后端服务器（开发模式）
npm run dev:server

# 启动后端服务器（生产模式）
npm run start:server

# 构建后端服务器
npm run build:server

# 启动管理员面板
npm run dev:admin

# 启动老人端应用
npm run dev:elderly

# 启动家属端应用
npm run dev:family

# 启动护工端应用
npm run dev:nurse

# 同时启动后端服务器和管理员面板
npm run start:all

# 安装所有依赖
npm run install:all
```

## 1. 启动后端服务器

后端服务器提供API接口供所有前端应用使用。

### 1.1 环境准备

确保已安装以下软件：
- Node.js (v16+)
- MongoDB (v4.4+)

### 1.2 配置环境变量

在`server`目录下创建`.env`文件：

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

### 1.3 安装依赖

```bash
cd server
npm install
```

### 1.4 启动服务器

**开发模式**

```bash
npm run dev
```

**生产模式**

```bash
npm run build
npm start
```

成功启动后，服务器将在 http://localhost:5000 运行。

## 2. 启动管理员后台

### 2.1 安装依赖

```bash
cd apps/admin-panel
npm install
```

### 2.2 安装缺失的依赖

管理员后台需要安装echarts相关依赖：

```bash
npm install --save echarts echarts-for-react
```

### 2.3 启动开发服务器

```bash
npm run dev
```

管理员后台将在 http://localhost:5173 运行。

## 3. 启动老人端应用

### 3.1 安装依赖

```bash
cd apps/elderly-app
npm install
```

### 3.2 启动开发服务器

```bash
npm run dev
```

老人端应用将在 http://localhost:5174 运行。

## 4. 启动家属端应用

### 4.1 安装依赖

```bash
cd apps/family-app
npm install
```

### 4.2 启动开发服务器

```bash
npm run dev
```

家属端应用将在 http://localhost:5175 运行。

## 5. 启动护工端应用

### 5.1 安装依赖

```bash
cd apps/nurse-app
npm install
```

### 5.2 启动开发服务器

```bash
npm run dev
```

护工端应用将在 http://localhost:5176 运行。

## 6. 导入初始数据（可选）

如果需要导入初始测试数据，可以使用项目根目录下的`import_mongodb_data.py`脚本：

### 6.1 安装Python依赖

```bash
pip install -r requirements.txt
```

### 6.2 运行导入脚本

```bash
python import_mongodb_data.py
```

## 7. 常见问题

### 7.1 端口冲突

如果遇到端口冲突，可以修改相应的配置文件：
- 后端：修改`.env`文件中的`PORT`
- 前端：修改各应用目录下的`vite.config.ts`文件

### 7.2 数据库连接问题

确保MongoDB服务已启动，并且连接字符串正确。

### 7.3 跨域问题

后端已配置CORS，允许来自以下源的请求：
- http://localhost:5173
- http://localhost:5174
- http://localhost:5175
- http://localhost:5176

如果使用不同的端口，需要在后端的`src/index.ts`文件中更新CORS配置。 