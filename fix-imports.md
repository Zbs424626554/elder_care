# 导入路径修复说明

## 问题描述

由于移除了workspace引用，各个应用中的 `@smart-aging/services` 和 `@smart-aging/components` 导入路径无法解析。

## 解决方案

为每个应用创建本地的服务文件和组件文件，并修改导入路径。

### 1. 老人端应用 (apps/elderly-app/)

✅ **已完成修复**
- 创建了 `src/utils/request.ts`
- 创建了 `src/services/auth.service.ts`
- 创建了 `src/components/PrivateRoute.tsx`
- 修复了所有导入路径

### 2. 家属端应用 (apps/family-app/)

✅ **已完成修复**
- 创建了 `src/utils/request.ts`
- 创建了 `src/services/auth.service.ts`
- 创建了 `src/components/PrivateRoute.tsx`
- 修复了所有导入路径

### 3. 护工端应用 (apps/nurse-app/)

🔄 **需要修复**
需要创建以下文件并修复导入路径：
- `src/utils/request.ts`
- `src/services/auth.service.ts`
- `src/components/PrivateRoute.tsx`
- 修复所有页面组件的导入路径

### 4. 管理后台应用 (apps/admin-panel/)

🔄 **需要修复**
需要创建以下文件并修复导入路径：
- `src/utils/request.ts`
- `src/services/auth.service.ts`
- `src/components/PrivateRoute.tsx`
- 修复所有页面组件的导入路径

## 修复步骤

### 护工端修复
```bash
cd apps/nurse-app
# 创建服务文件
# 修复导入路径
```

### 管理后台修复
```bash
cd apps/admin-panel
# 创建服务文件
# 修复导入路径
```

## 导入路径映射

| 原路径 | 新路径 |
|--------|--------|
| `@smart-aging/services` | `../services/auth.service` |
| `@smart-aging/components` | `../components/PrivateRoute` |
| `@smart-aging/utils` | `../utils/request` |

## 验证修复

修复完成后，运行以下命令验证：

```bash
# 老人端
cd apps/elderly-app && npm run dev

# 家属端
cd apps/family-app && npm run dev

# 护工端
cd apps/nurse-app && npm run dev

# 管理后台
cd apps/admin-panel && npm run dev
```

如果所有应用都能正常启动，说明修复成功。 