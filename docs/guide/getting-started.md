# 快速开始

## 安装

使用 yarn 安装 jn-axios：

```bash
yarn add jn-axios
```

## 基本配置

在项目入口文件中初始化 jn-axios：

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

## 发起请求

### GET 请求

```typescript
import { jnAxiosGet } from 'jn-axios';

interface UserInfo {
  id: number;
  name: string;
  email: string;
}

const getUserInfo = async (userId: number) => {
  const result = await jnAxiosGet<UserInfo>('/api/user', { id: userId });
  if (result) {
    console.log(result.name);
  }
};
```

### POST 请求

```typescript
import { jnAxiosPost } from 'jn-axios';

interface CreateUserParams {
  name: string;
  email: string;
}

interface CreateUserResponse {
  id: number;
  success: boolean;
}

const createUser = async (params: CreateUserParams) => {
  const result = await jnAxiosPost<CreateUserResponse>('/api/user', params);
  if (result) {
    console.log('用户创建成功，ID:', result.id);
  }
};
```

## 类型支持

jn-axios 提供了完整的 TypeScript 类型支持，你可以为请求和响应数据定义接口类型：

```typescript
interface ResponseData<T> {
  code: number;
  data: T;
  message: string;
}

interface UserProfile {
  id: number;
  name: string;
  avatar: string;
}

// 类型安全的请求
const getProfile = async () => {
  const result = await jnAxiosGet<UserProfile>('/api/profile');
  if (result) {
    // result 会有完整的类型提示
    console.log(result.name);
  }
};
```

## 下一步

- 查看[基本用法](./basic-usage.md)了解更多使用方式
- 了解[错误处理](./error-handling.md)机制
- 探索[请求配置](./configuration.md)选项
