# 配置选项

JN-Axios 提供了丰富的配置选项，可以通过全局配置和请求级别配置来满足不同场景的需求。

## 全局配置

使用 `jnAxiosInit` 方法进行全局配置：

```typescript
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  // 全局请求头配置
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'custom-value',
  },

  // 成功状态码（默认：200）
  successCode: 200,

  // 全局异常提示信息
  exceptionMsg: '服务异常，请稍后重试',

  // 特殊状态码列表
  expectCodeList: [10001, 400],

  // 请求拦截器
  requestInterceptor: config => {
    // 添加认证信息
    config.headers['Authorization'] = 'Bearer your-token';
    return config;
  },

  // 响应拦截器
  responseInterceptor: response => {
    // 处理响应数据
    if (response.data.code === 200) {
      return response.data.data;
    }
    return response;
  },

  // 异常回调处理
  exceptionCallBack: function (msg, error) {
    if (!error) return;

    if ('data' in error) {
      // 处理特定状态码
      if (error.data.code === 400) {
        console.log('退出登录');
        return;
      }
      // 处理业务逻辑错误
      if (error.data.code === 10001) {
        console.log('业务错误:', error.data.message);
        return;
      }
    }
    // 处理其他错误
    console.error('系统错误:', msg);
  },
});
```

### 配置项说明

#### headers

- 类型：`Record<string, string>`
- 默认值：`{}`
- 说明：全局请求头配置，会与请求级别的 headers 合并

#### successCode

- 类型：`number`
- 默认值：`200`
- 说明：请求成功的状态码，用于判断请求是否成功

#### exceptionMsg

- 类型：`string`
- 默认值：`'服务异常，请稍后重试'`
- 说明：全局异常提示信息，当请求失败且未配置特定错误信息时使用

#### expectCodeList

- 类型：`number[]`
- 默认值：`[]`
- 说明：特殊状态码列表，这些状态码的响应会被特殊处理

#### requestInterceptor

- 类型：`(config: AxiosRequestConfig) => AxiosRequestConfig`
- 默认值：`undefined`
- 说明：请求拦截器，可以在请求发送前修改请求配置

#### responseInterceptor

- 类型：`(response: AxiosResponse) => any`
- 默认值：`undefined`
- 说明：响应拦截器，可以在获取响应后处理响应数据

#### exceptionCallBack

- 类型：`(msg: string, error?: any) => void`
- 默认值：`undefined`
- 说明：异常回调处理函数，用于统一处理请求异常

## 请求级别配置

每个请求方法（如 `jnAxiosGet`、`jnAxiosPost` 等）都支持传入配置对象：

```typescript
import { jnAxiosGet, jnAxiosPost } from 'jn-axios';

// GET 请求配置
const getData = async () => {
  const res = await jnAxiosGet('/api/data', {
    // 请求头
    headers: {
      'X-Custom-Header': 'value',
    },
    // 超时时间（毫秒）
    timeout: 5000,
    // 是否携带凭证
    withCredentials: true,
    // URL 参数
    params: {
      id: 1,
      type: 'user',
    },
  });
};

// POST 请求配置
const createData = async () => {
  const res = await jnAxiosPost(
    '/api/data',
    // 请求体数据
    {
      name: '测试',
      age: 18,
    },
    // 请求配置
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 3000,
    },
  );
};
```

### 请求配置项

#### headers

- 类型：`Record<string, string>`
- 说明：请求头配置，会与全局 headers 合并

#### timeout

- 类型：`number`
- 说明：请求超时时间（毫秒）

#### withCredentials

- 类型：`boolean`
- 说明：是否携带凭证（cookies）

#### params

- 类型：`Record<string, any>`
- 说明：URL 参数配置，会被自动转换为查询字符串

#### baseURL

- 类型：`string`
- 说明：请求的基础 URL

#### responseType

- 类型：`'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'`
- 默认值：`'json'`
- 说明：响应数据类型

## 类型定义

```typescript
interface JNAxiosConfig extends AxiosRequestConfig {
  headers?: Record<string, string>;
  successCode?: number;
  exceptionMsg?: string;
  expectCodeList?: number[];
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  responseInterceptor?: (response: AxiosResponse) => any;
  exceptionCallBack?: (msg: string, error?: any) => void;
}
```

## 配置最佳实践

1. **环境配置**

```typescript
// config/axios.ts
export const axiosConfig = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 5000,
  },
  production: {
    baseURL: 'https://api.example.com',
    timeout: 10000,
  },
};

// 初始化配置
const env = process.env.NODE_ENV;
jnAxiosInit({
  ...axiosConfig[env],
  // 其他配置
});
```

2. **统一错误处理**

```typescript
import { message } from 'antd';

jnAxiosInit({
  exceptionCallBack: (msg, error) => {
    if (!error) {
      message.error(msg);
      return;
    }

    if ('data' in error) {
      switch (error.data.code) {
        case 401:
          // 处理未授权
          message.error('请先登录');
          // 跳转到登录页
          break;
        case 403:
          // 处理权限不足
          message.error('权限不足');
          break;
        case 500:
          // 处理服务器错误
          message.error('服务器错误');
          break;
        default:
          // 处理其他错误
          message.error(error.data.message || msg);
      }
    }
  },
});
```

3. **请求/响应拦截器**

```typescript
jnAxiosInit({
  requestInterceptor: config => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  responseInterceptor: response => {
    // 处理响应数据
    const { code, data, message } = response.data;
    if (code === 200) {
      return data;
    }
    throw { data: response.data };
  },
});
```

## 下一步

- 查看[基本用法](./basic-usage.md)示例
- 了解[错误处理](./error-handling.md)机制
- 浏览[示例代码](/examples/)
