# API 响应格式规范

## 概述

为了统一前后端交互的响应格式，提高开发效率和用户体验，我们实现了标准化的 API 响应格式。所有 API 响应都将遵循以下格式：

```json
{
  "code": 200,           // 状态码
  "status": "success",   // 状态：success 或 error
  "message": "操作成功",  // 响应消息
  "data": {},            // 响应数据
  "timestamp": "2023-06-01T12:34:56.789Z" // 时间戳
}
```

## 响应状态码

- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `409`: 资源冲突
- `500`: 服务器内部错误

## 响应方法

后端提供了三种标准化响应方法：

### 1. 成功响应 - `res.success()`

用于返回操作成功的响应。

```javascript
res.success(data, message);
```

参数：
- `data`: 返回的数据对象，默认为 `null`
- `message`: 成功消息，默认为 "操作成功"

示例：
```javascript
return res.success({ user: userInfo }, '登录成功');
```

### 2. 失败响应 - `res.fail()`

用于返回客户端错误的响应。

```javascript
res.fail(code, message, data);
```

参数：
- `code`: HTTP 状态码，默认为 `400`
- `message`: 错误消息，默认为 "操作失败"
- `data`: 附加数据，默认为 `null`

示例：
```javascript
return res.fail(404, '用户不存在');
```

### 3. 服务器错误响应 - `res.error()`

用于返回服务器内部错误的响应。

```javascript
res.error(message, error);
```

参数：
- `message`: 错误消息，默认为 "服务器内部错误"
- `error`: 错误对象，默认为 `null`

示例：
```javascript
return res.error('注册失败', error);
```

## 前端处理

前端在处理响应时，可以根据 `code` 和 `status` 字段判断请求是否成功，并根据 `message` 字段显示相应的提示信息。

```javascript
// 前端示例代码
api.login(username, password)
  .then(response => {
    if (response.code === 200) {
      // 请求成功，处理数据
      const userData = response.data;
      // ...
    } else {
      // 请求失败，显示错误信息
      showToast(response.message);
    }
  })
  .catch(error => {
    // 网络错误或其他异常
    showToast('网络异常，请稍后重试');
  });
``` 