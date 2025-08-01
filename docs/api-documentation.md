# API 接口文档

## 统一接口返回格式

所有接口返回如下格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```
- code: 200 表示成功，其他为业务错误码
- message: 业务提示信息
- data: 业务数据

---

## 用户注册

- URL: `/api/auth/register`
- Method: POST
- 请求参数:
  - username: string
  - password: string
  - phone: string
  - role: "elderly" | "family" | "nurse" | "admin"
- 响应:
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "user": { ... }
    }
  }
  ```

---

## 用户登录

- URL: `/api/auth/login`
- Method: POST
- 请求参数:
  - username: string
  - password: string
- 响应:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "...",
      "user": { ... }
    }
  }
  ```
- 说明: 登录成功后，token 以 Cookie 形式返回，前端自动携带。

---

## 获取当前用户信息

- URL: `/api/auth/profile`
- Method: GET
- 需携带 Cookie
- 响应:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "user": { ... }
    }
  }
  ```

---

## 错误码说明

- 200: 成功
- 400: 参数错误
- 401: 未授权/未登录
- 403: 权限不足
- 404: 用户不存在
- 409: 用户名或手机号已存在
- 500: 服务器内部错误 