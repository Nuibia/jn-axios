# 基本用法

本章节将通过实际示例来展示 JN-Axios 的基本用法。

## 初始化配置

在使用 JN-Axios 之前，您需要先进行初始化配置：

```typescript
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  // 全局请求头配置
  headers: {
    'Content-Type': 'application/json',
  },
  // 成功状态码
  successCode: 200,
  // 异常提示信息
  exceptionMsg: '服务异常，请稍后重试',
  // 特殊状态码列表
  expectCodeList: [10001],
  // 异常回调处理
  exceptionCallBack: function (msg, error) {
    if (!error) return;
    console.error('请求错误:', msg);
  },
});
```


## 基础请求示例

下面是一个简单的请求示例，您可以直接点击按钮查看效果：

<DemoContainer>
  <BasicDemo />
  <template #code>

```typescript
import { jnAxiosGet, jnAxiosPost } from 'jn-axios';

// GET 请求
const handleGet = async () => {
  try {
    const res = await jnAxiosGet('/api/get/200');
    console.log('GET 请求成功:', res);
  } catch (error) {
    console.error('GET 请求失败:', error);
  }
};

// POST 请求
const handlePost = async () => {
  try {
    const res = await jnAxiosPost('/api/post', {
      name: '测试用户',
      email: 'test@example.com',
    });
    console.log('POST 请求成功:', res);
  } catch (error) {
    console.error('POST 请求失败:', error);
  }
};
```

  </template>
</DemoContainer>

## GET 请求

发起一个 GET 请求：

<DemoContainer>
  <GetDemo />
  <template #code>

```typescript
import { jnAxiosGet } from 'jn-axios';

// 基本 GET 请求
const getData = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/user');
  if (res) {
    console.log(res.name);
  }
};

// 带参数的 GET 请求
const getDataWithParams = async () => {
  const res = await jnAxiosGet('/api/users', {
    params: {
      page: 1,
      size: 10,
    },
  });
  if (res) {
    console.log(res);
  }
};
```

  </template>
</DemoContainer>

## POST 请求

发起一个 POST 请求：

<DemoContainer>
  <PostDemo />
  <template #code>

```typescript
import { jnAxiosPost } from 'jn-axios';

// 基本 POST 请求
const createUser = async () => {
  const res = await jnAxiosPost<{ id: number }>('/api/user', {
    name: '测试用户',
    email: 'test@example.com',
  });
  if (res) {
    console.log('用户创建成功，ID:', res.id);
  }
};

// 带配置的 POST 请求
const createUserWithConfig = async () => {
  const res = await jnAxiosPost(
    '/api/user',
    {
      name: '测试用户',
      email: 'test@example.com',
    },
    {
      headers: {
        'X-Custom-Header': 'value',
      },
    },
  );
  if (res) {
    console.log('用户创建成功');
  }
};
```

  </template>
</DemoContainer>

# 类型支持

JN-Axios 提供了完整的 TypeScript 类型支持：


```typescript
// 定义响应数据类型
interface IRequestPrams {
}

// 定义请求数据类型
interface IRequestResponse {
}

// 使用类型
  const data = await jnAxiosGet<IRequestResponse,IRequestPrams>('xxx',params);
```

## 下一步

- 了解[错误处理](./error-handling.md)
- 查看[API 参考](/guide/api-reference)
