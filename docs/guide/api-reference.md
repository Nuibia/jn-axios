# API 参考

本页面详细介绍了 JN-Axios 的 API。

## 全局配置

JN-Axios 提供了一个全局配置函数 `jnAxiosInit`，用于设置库的全局行为。

### jnAxiosInit 配置选项

```typescript
interface IDiyAxiosInitConfigInterface {
  /** 全局默认的请求头配置 */
  headers?: Record<string, string>;

  /** 接口请求成功业务正常返回的 code, 默认 200 */
  successCode?: number | number[];

  /** 接口异常的提示，默认「系统开小差了，请稍后重试」 */
  exceptionMsg?: string;

  /** 排除非 200 处理接口的异常 code 过滤处理 */
  expectCodeList: number[];

  /** 接口 40x, 50x, code 非 200 和不在 expectCodeList 列表的回调处理 */
  exceptionCallBack: (msg: string, error: AxiosError | typeDiyAxiosResponse) => void;

  /** 添加一些对 header 的额外限制 */
  extraHeader?: any;
}
```

### 配置项说明

#### headers

- 类型：`Record<string, string>`
- 默认值：`{}`
- 说明：全局默认的请求头配置，会与每个请求的 headers 合并

```typescript
jnAxiosInit({
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
  },
});
```

#### successCode

- 类型：`number | number[]`
- 默认值：`200`
- 说明：定义接口请求成功的业务状态码

```typescript
jnAxiosInit({
  // 单个状态码
  successCode: 200,
  // 或者多个状态码
  successCode: [200, 0],
});
```

#### exceptionMsg

- 类型：`string`
- 默认值：`'系统开小差了，请稍后重试'`
- 说明：全局默认的异常提示信息

```typescript
jnAxiosInit({
  exceptionMsg: '网络请求失败，请稍后重试',
});
```

#### expectCodeList

- 类型：`number[]`
- 必填
- 说明：需要特殊处理的非成功状态码列表

```typescript
jnAxiosInit({
  expectCodeList: [401, 403],
});
```

#### exceptionCallBack

- 类型：`(msg: string, error: AxiosError | typeDiyAxiosResponse) => void`
- 必填
- 说明：异常情况的回调处理函数

```typescript
jnAxiosInit({
  exceptionCallBack: (msg, error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      redirectToLogin();
    } else {
      // 显示错误信息
      showErrorMessage(msg);
    }
  },
});
```

#### extraHeader

- 类型：`any`
- 可选
- 说明：用于添加特殊的请求头处理逻辑

```typescript
jnAxiosInit({
  extraHeader: {
    csrfToken: ['api/v1/*', 'api/v2/*'],
  },
});
```

## 响应数据类型

### IDiyAxiosResponseData

接口返回数据的标准格式：

```typescript
interface IDiyAxiosResponseData<T = any> {
  /** 业务状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message?: string;
  /** 结果消息 */
  resultMsg?: string;
  /** 请求 ID */
  requestId?: string;
}
```

### typeDiyAxiosResponse

完整的响应类型：

```typescript
type typeDiyAxiosResponse<T = any> = AxiosResponse<IDiyAxiosResponseData<T>> | false;
```

## 请求方法

JN-Axios 提供了多种请求方法，每种方法都支持完整的类型推导和错误处理。

### GET 请求

#### jnAxiosGet

用于发送 GET 请求。

```typescript
function jnAxiosGet<T, P = any>(
  url: string,
  data?: P,
  config?: IDiyAxiosConfig,
): Promise<(T & ExpectDiyAxiosResponse) | false>;
```

##### 参数

- `url`: 请求地址
- `data`: 请求参数，会被转换为查询字符串
- `config`: 请求配置，继承自 Axios 的配置选项

##### 示例

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

### POST 请求

#### jnAxiosPost

用于发送 POST 请求。

```typescript
function jnAxiosPost<T, P = any>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse<T>) | false>;
```

##### 参数

- `url`: 请求地址
- `data`: 请求体数据
- `config`: 请求配置

##### 示例

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

### PUT 请求

#### jnAxiosPut

用于发送 PUT 请求。

```typescript
function jnAxiosPut<T, P = any>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

##### 示例

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

### DELETE 请求

#### jnAxiosDelete

用于发送 DELETE 请求。

```typescript
function jnAxiosDelete<T>(
  url: string,
  data: any,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

##### 示例

```typescript
interface DeleteResponse {
  success: boolean;
}

const result = await jnAxiosDelete<DeleteResponse>('/api/user/1', { force: true });
```

### 表单请求

#### jnAxiosForm

用于发送 multipart/form-data 格式的请求，通常用于文件上传。

```typescript
function jnAxiosForm<T, P extends Record<string, any>>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

##### 示例

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

#### jnAxiosFormUrlencoded

用于发送 application/x-www-form-urlencoded 格式的请求。

```typescript
function jnAxiosFormUrlencoded<T, P = any>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
): Promise<T | (T & ExpectDiyAxiosResponse) | false>;
```

##### 示例

```typescript
interface LoginResponse {
  token: string;
}

const result = await jnAxiosFormUrlencoded<LoginResponse>('/api/login', {
  username: 'john',
  password: '123456',
});
```

### 通用配置

所有请求方法都支持以下配置选项：

```typescript
interface IDiyAxiosConfig extends AxiosRequestConfig {
  // 继承自 Axios 的所有配置选项
  timeout?: number;
  headers?: Record<string, string>;
  // ... 其他 Axios 配置项
}
```

#### 常用配置示例

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