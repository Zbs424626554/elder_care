# 数据库设计文档

## users 表

| 字段         | 类型     | 说明           |
| ------------ | -------- | -------------- |
| _id          | ObjectId | 主键           |
| username     | string   | 用户名         |
| password     | string   | 密码（加密）   |
| phone        | string   | 手机号         |
| role         | string   | 用户角色（elderly/family/nurse/admin）|
| avatar       | string   | 头像           |
| realname     | string   | 真实姓名       |
| status       | boolean  | 状态           |
| createdTime  | Date     | 创建时间       |

- role 字段用于前端分流和权限控制。
- 注册、登录、鉴权等接口均依赖 role 字段。

## 认证与权限

- 登录成功后，token 以 Cookie 形式返回，所有端口可共享。
- 路由守卫通过 `/api/auth/profile` 校验登录状态和角色。

## 其他表结构略 