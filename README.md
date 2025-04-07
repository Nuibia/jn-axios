# JN-Axios

一个基于 Axios 的 HTTP 请求库封装，提供更好的类型支持和错误处理机制。

## 特性

- 🛡️ 完整的 TypeScript 支持
- 🔄 统一错误处理机制
- ⚡️ 简化的 API 设计
- 🔧 灵活可配置
- 📦 开箱即用

## 安装

使用 yarn 安装：

```bash
yarn add jn-axios
```

## 快速开始

### 初始化配置

```typescript
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  // 全局请求头配置
  headers: {
    'Content-Type': 'application/json',
  },
  // 成功状态码（默认为 200）
  successCode: 200,
  // 特殊状态码列表，这些状态码不会触发错误处理
  expectCodeList: [401, 403],
  // 异常提示信息
  exceptionMsg: '请求失败，请稍后重试',
  // 异常回调处理
  exceptionCallBack: (msg, error) => {
    console.error(msg, error);
    // 在这里处理异常，比如显示错误提示、跳转登录页等
  },
});
```

### 发起请求

```typescript
import { jnAxiosGet, jnAxiosPost } from 'jn-axios';

// GET 请求
const getUserInfo = async (userId: number) => {
  const result = await jnAxiosGet<UserInfo>('/api/user', { id: userId });
  if (result) {
    console.log(result.name);
  }
};

// POST 请求
const createUser = async (params: CreateUserParams) => {
  const result = await jnAxiosPost<CreateUserResponse>('/api/user', params);
  if (result) {
    console.log('用户创建成功，ID:', result.id);
  }
};
```

## 错误处理

JN-Axios 提供了三层错误处理机制：

1. 网络请求异常（如网络错误、超时等）
2. 业务状态码处理（可配置特殊状态码）
3. 业务异常处理（其他非成功状态码）

```typescript
jnAxiosInit({
  successCode: 200,
  expectCodeList: [401, 403],
  exceptionMsg: '服务异常，请稍后重试',
  exceptionCallBack: (msg, error) => {
    // 网络错误
    if (!error.response) {
      console.error('网络连接异常，请检查网络');
      return;
    }

    // 特殊状态码处理
    const { code } = error.response.data;
    switch (code) {
      case 401:
        // 处理未授权
        redirectToLogin();
        break;
      case 403:
        // 处理权限不足
        showNoPermissionMessage();
        break;
      default:
        // 其他错误
        showErrorMessage(msg);
    }
  },
});
```

## API 参考

### 请求方法

- `jnAxiosGet<T, P = any>(url: string, data?: P, config?: IDiyAxiosConfig)`
- `jnAxiosPost<T, P = any>(url: string, data: P, config?: IDiyAxiosConfig)`
- `jnAxiosPut<T, P = any>(url: string, data: P, config?: IDiyAxiosConfig)`
- `jnAxiosDelete<T>(url: string, data: any, config?: IDiyAxiosConfig)`
- `jnAxiosForm<T, P extends Record<string, any>>(url: string, data: P, config?: IDiyAxiosConfig)`
- `jnAxiosFormUrlencoded<T, P = any>(url: string, data: P, config?: IDiyAxiosConfig)`

### 配置选项

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

## 文档

更多详细文档请访问：[文档网站](https://your-docs-site.com)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](LICENSE)
