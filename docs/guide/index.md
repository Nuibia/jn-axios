# 快速开始

## 介绍

JN-Axios 是一个基于 Axios 的 HTTP 请求封装库，它提供了：

- 完整的 TypeScript 支持
- 统一的错误处理机制
- 简化的 API 设计
- 灵活的配置选项

## 安装

使用 yarn 安装：

```bash
yarn add jn-axios
```

## 基本使用

### 初始化配置

```typescript
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  // 全局请求头配置
  headers: {},
  // 成功状态码
  successCode: 200,
  // 异常提示信息
  exceptionMsg: '服务异常，请稍后',
  // 特殊状态码列表
  expectCodeList: [10001],
  // 异常回调处理
  exceptionCallBack: function (msg, error) {
    if (!error) return;
    if ('data' in error) {
      if (error.data.code === 400) {
        console.log('成功退出登录');
        return;
      }
    }
    console.error(msg);
  },
});
```

### 发送请求

```typescript
import { jnAxiosGet, jnAxiosPost } from 'jn-axios';

// GET 请求
const getData = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/user');
  if (res) {
    console.log(res.name);
  }
};

// POST 请求
const createUser = async () => {
  const res = await jnAxiosPost<{ id: number }>('/api/user', {
    name: '测试用户',
    email: 'test@example.com',
  });
  if (res) {
    console.log('用户创建成功，ID:', res.id);
  }
};
```

## 下一步

- 了解更多[基本用法](./basic-usage.md)
- 探索[错误处理](./error-handling.md)机制
- 查看[配置选项](./configuration.md)
- 浏览[示例代码](/examples/)
