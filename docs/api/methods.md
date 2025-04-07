# 请求方法

JN-Axios 提供了多种请求方法，每种方法都支持完整的类型推导和错误处理。

## GET 请求

### jnAxiosGet

用于发送 GET 请求。

```typescript
function jnAxiosGet<T, P = any>(
  url: string,
  data?: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

#### 参数

- `url`: 请求地址
- `data`: 请求参数，会被转换为查询字符串
- `config`: 请求配置，继承自 Axios 的配置选项

#### 示例

```typescript
interface UserInfo {
  id: number;
  name: string;
  age: number;
}

// 基本使用
const user = await jnAxiosGet<UserInfo>('/api/user', { id: 1 });
if (user) {
  console.log(user.name);
}

// 带配置项
const userWithConfig = await jnAxiosGet<UserInfo>('/api/user', { id: 1 }, { timeout: 5000 });
```

## POST 请求

### jnAxiosPost

用于发送 POST 请求。

```typescript
function jnAxiosPost<T, P = any>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

#### 参数

- `url`: 请求地址
- `data`: 请求体数据
- `config`: 请求配置

#### 示例

```typescript
interface CreateUserRequest {
  name: string;
  age: number;
}

interface CreateUserResponse {
  id: number;
  success: boolean;
}

// 基本使用
const result = await jnAxiosPost<CreateUserResponse, CreateUserRequest>('/api/user', {
  name: 'John',
  age: 25,
});

// 带配置项
const resultWithConfig = await jnAxiosPost<CreateUserResponse>(
  '/api/user',
  { name: 'John', age: 25 },
  {
    headers: {
      'X-Custom-Header': 'value',
    },
  },
);
```

## PUT 请求

### jnAxiosPut

用于发送 PUT 请求。

```typescript
function jnAxiosPut<T, P = any>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

#### 示例

```typescript
interface UpdateUserRequest {
  name?: string;
  age?: number;
}

interface UpdateUserResponse {
  success: boolean;
}

const result = await jnAxiosPut<UpdateUserResponse, UpdateUserRequest>('/api/user/1', {
  age: 26,
});
```

## DELETE 请求

### jnAxiosDelete

用于发送 DELETE 请求。

```typescript
function jnAxiosDelete<T>(
  url: string,
  data: any,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

#### 示例

```typescript
interface DeleteResponse {
  success: boolean;
}

const result = await jnAxiosDelete<DeleteResponse>('/api/user/1', { force: true });
```

## 表单请求

### jnAxiosForm

用于发送 multipart/form-data 格式的请求，通常用于文件上传。

```typescript
function jnAxiosForm<T, P extends Record<string, any>>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

#### 示例

```typescript
interface UploadResponse {
  url: string;
  size: number;
}

// 文件上传
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'avatar');

const result = await jnAxiosForm<UploadResponse>('/api/upload', formData);
```

### jnAxiosFormUrlencoded

用于发送 application/x-www-form-urlencoded 格式的请求。

```typescript
function jnAxiosFormUrlencoded<T, P = any>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

#### 示例

```typescript
interface LoginResponse {
  token: string;
}

const result = await jnAxiosFormUrlencoded<LoginResponse>('/api/login', {
  username: 'john',
  password: '123456',
});
```

## 通用配置

所有请求方法都支持以下配置选项：

```typescript
interface IDiyAxiosConfig extends AxiosRequestConfig {
  // 继承自 Axios 的所有配置选项
  timeout?: number;
  headers?: Record<string, string>;
  // ... 其他 Axios 配置项
}
```

### 常用配置示例

```typescript
// 设置超时
const result = await jnAxiosGet('/api/data', null, {
  timeout: 5000,
});

// 设置请求头
const result = await jnAxiosPost('/api/data', data, {
  headers: {
    'X-Custom-Header': 'value',
  },
});

// 设置响应类型
const result = await jnAxiosGet('/api/file', null, {
  responseType: 'blob',
});
```
