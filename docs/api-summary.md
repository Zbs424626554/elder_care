# API 接口摘要

## 统一返回格式

所有接口返回：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

---

## 注册接口
- POST `/api/auth/register`
- 参数：username, password, phone, role
- 返回：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": { "user": { ... } }
}
```

---

## 登录接口
- POST `/api/auth/login`
- 参数：username, password
- 返回：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": { "token": "...", "user": { ... } }
}
```

---

## 获取当前用户信息
- GET `/api/auth/profile`
- 返回：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": { "user": { ... } }
}
```

---

## 错误码
- 200: 成功
- 400: 参数错误
- 401: 未授权/未登录
- 403: 权限不足
- 404: 用户不存在
- 409: 用户名或手机号已存在
- 500: 服务器内部错误 