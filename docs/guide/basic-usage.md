# 基本用法

本章节将通过一个实际的 React 项目示例来展示 JN-Axios 的基本用法。

## 项目初始化

首先，在项目入口文件中初始化 JN-Axios：

```typescript
import { message } from 'antd';
import { jnAxiosInit } from 'jn-axios';

// 定义特殊状态码列表
const EXPECT_CODE_LIST = [10001];

jnAxiosInit({
  // 全局请求头配置
  headers: {},
  // 成功状态码
  successCode: 200,
  // 异常提示信息
  exceptionMsg: '服务异常，请稍后',
  // 特殊状态码列表
  expectCodeList: EXPECT_CODE_LIST,
  // 异常回调处理
  exceptionCallBack: function (msg, error) {
    if (!error) return;
    if ('data' in error) {
      // 处理特定状态码，例如退出登录
      if (error.data.code === 400) {
        message.info('成功退出登录');
        return;
      }
    }
    // 显示错误信息
    message.error(msg);
  },
});
```

## GET 请求示例

### 1. 正常请求

发起一个正常的 GET 请求，并处理成功响应：

```typescript
const fetchData = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/get/200');
  if (res) {
    console.log(res);
    message.success(res.name);
  }
};
```

### 2. 处理业务逻辑错误

处理返回特定错误码的请求：

```typescript
const fetchDataWithError = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/get/10001');
  if (res) {
    // 特殊状态码的响应会包含额外信息
    if (res.resultMsg) {
      message.error(res.resultMsg);
    } else {
      console.log('success', res);
    }
  }
  console.log(res);
};
```

### 3. 处理特殊状态码

处理需要特殊处理的状态码（如退出登录）：

```typescript
const fetchDataWithAction = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/get/400');
  if (res) {
    message.success(res.name);
  }
  console.log(res);
};
```

## POST 请求示例

发起 POST 请求并处理响应：

```typescript
const postData = async () => {
  const res = await jnAxiosPost<{ name: string }>('/api/post', {
    // 请求数据
    key: 'value',
  });
  if (res) {
    message.success(res.name);
  }
  console.log(res);
};
```

## 完整示例

下面是一个完整的 React 组件示例，展示了各种请求场景的使用：

```typescript
import { Button, message } from 'antd';
import { jnAxiosGet, jnAxiosPost } from 'jn-axios';

function App() {
  // 正常请求
  const fetchData1 = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/200');
    if (res) {
      console.log(res);
      message.success(res.name);
    }
  };

  // 业务逻辑错误
  const fetchData2 = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/10001');
    if (res) {
      if (res.resultMsg) {
        message.error(res.resultMsg);
      }
    }
    console.log(res);
  };

  // 特殊状态码处理
  const fetchData3 = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/400');
    if (res) {
      message.success(res.name);
    }
    console.log(res);
  };

  // POST 请求示例
  const fetchData4 = async () => {
    const res = await jnAxiosPost<{ name: string }>('/api/post', {});
    if (res) {
      message.success(res.name);
    }
    console.log(res);
  };

  return (
    <div>
      <p>GET 请求示例</p>
      <div>
        <Button onClick={fetchData1}>正常 GET 请求</Button>
        <Button onClick={fetchData2}>带错误处理的 GET 请求</Button>
        <Button onClick={fetchData3}>特殊状态码处理</Button>
      </div>
      <p>POST 请求示例</p>
      <Button onClick={fetchData4}>POST 请求</Button>
    </div>
  );
}

export default App;
```

## 类型定义

为了获得更好的类型提示，建议为请求和响应数据定义接口：

```typescript
// 请求数据类型
interface CreateUserRequest {
  name: string;
  email: string;
}

// 响应数据类型
interface CreateUserResponse {
  id: number;
  success: boolean;
}

// 使用类型
const createUser = async (data: CreateUserRequest) => {
  const res = await jnAxiosPost<CreateUserResponse>('/api/user', data);
  if (res) {
    console.log(`用户创建成功，ID: ${res.id}`);
  }
};
```

## 最佳实践

1. **统一错误处理**

   - 在初始化时配置全局错误处理
   - 对特殊状态码进行单独处理
   - 使用 `expectCodeList` 处理特定业务场景

2. **类型安全**

   - 为所有请求定义类型接口
   - 利用 TypeScript 的类型推导
   - 避免使用 `any` 类型

3. **请求封装**

   - 将相关的请求封装到服务模块中
   - 统一管理 API 路径
   - 复用请求配置

4. **响应处理**
   - 始终检查响应是否存在
   - 处理所有可能的错误情况
   - 提供用户友好的错误提示

## 下一步

- 了解[错误处理](./error-handling.md)机制
- 探索[请求配置](./configuration.md)选项
- 查看[类型系统](./typescript.md)的使用
