# 错误处理

本章节将介绍 JN-Axios 的错误处理机制。

## 错误处理示例

下面是一个错误处理的示例，您可以点击不同的按钮来触发不同类型的错误：

<DemoContainer>
  <ErrorHandlingDemo />
  <template #code>

```typescript
import { jnAxiosGet } from 'jn-axios';

// 处理业务逻辑错误
const handleBusinessError = async () => {
  try {
    const res = await jnAxiosGet('/api/user/invalid');
    console.log(res);
  } catch (error) {
    if (error.code === 10001) {
      console.error('业务错误:', error.message);
    }
  }
};

// 处理特殊状态码
const handleSpecialCode = async () => {
  try {
    const res = await jnAxiosGet('/api/auth/check');
    console.log(res);
  } catch (error) {
    if (error.code === 400) {
      console.log('用户已退出登录');
      // 执行退出登录逻辑
    }
  }
};

// 处理网络错误
const handleNetworkError = async () => {
  try {
    const res = await jnAxiosGet('/api/timeout');
    console.log(res);
  } catch (error) {
    console.error('网络错误:', error.message);
  }
};
```

  </template>
</DemoContainer>

## 错误处理配置

JN-Axios 提供了全局的错误处理配置：

<DemoContainer>
  <template #code>

```typescript
import { jnAxiosInit } from 'jn-axios';
import { message } from 'antd';

jnAxiosInit({
  // 成功状态码
  successCode: 200,

  // 全局异常提示信息
  exceptionMsg: '服务异常，请稍后重试',

  // 特殊状态码列表
  expectCodeList: [10001, 400],

  // 异常回调处理
  exceptionCallBack: function (msg, error) {
    if (!error) {
      message.error(msg);
      return;
    }

    if ('data' in error) {
      switch (error.data.code) {
        case 400:
          // 处理退出登录
          message.info('用户已退出登录');
          // 跳转到登录页
          window.location.href = '/login';
          break;

        case 10001:
          // 处理业务错误
          message.error(error.data.message);
          break;

        default:
          // 处理其他错误
          message.error(msg);
      }
    }
  },
});
```

  </template>
</DemoContainer>

## 错误类型

### 1. 业务逻辑错误

业务逻辑错误通常是由后端返回的特定错误码标识的错误，例如：

- 表单验证失败
- 记录不存在
- 权限不足

这类错误可以通过 `expectCodeList` 配置来识别和处理：

<DemoContainer>
  <template #code>

```typescript
jnAxiosInit({
  expectCodeList: [10001, 10002, 10003],
  exceptionCallBack: (msg, error) => {
    if (error?.data?.code === 10001) {
      console.error('表单验证失败:', error.data.message);
    } else if (error?.data?.code === 10002) {
      console.error('记录不存在:', error.data.message);
    } else if (error?.data?.code === 10003) {
      console.error('权限不足:', error.data.message);
    }
  },
});
```

  </template>
</DemoContainer>

### 2. 特殊状态码

特殊状态码通常表示需要特殊处理的情况，例如：

- 未登录（401）
- 无权限（403）
- 会话过期（440）

这类错误可以在 `exceptionCallBack` 中统一处理：

<DemoContainer>
  <template #code>

```typescript
jnAxiosInit({
  exceptionCallBack: (msg, error) => {
    if (!error?.data?.code) return;

    switch (error.data.code) {
      case 401:
        // 跳转到登录页
        window.location.href = '/login';
        break;
      case 403:
        message.error('您没有权限访问此资源');
        break;
      case 440:
        message.info('会话已过期，请重新登录');
        // 清除本地存储
        localStorage.clear();
        // 跳转到登录页
        window.location.href = '/login';
        break;
    }
  },
});
```

  </template>
</DemoContainer>

### 3. 网络错误

网络错误包括：

- 请求超时
- 网络连接失败
- 服务器错误（500）

这类错误可以在请求时通过 try/catch 处理，也可以在全局配置中处理：

<DemoContainer>
  <template #code>

```typescript
// 请求级别处理
const handleRequest = async () => {
  try {
    const res = await jnAxiosGet('/api/data');
    return res;
  } catch (error) {
    if (error.isAxiosError) {
      if (error.code === 'ECONNABORTED') {
        console.error('请求超时');
      } else if (!error.response) {
        console.error('网络连接失败');
      } else if (error.response.status === 500) {
        console.error('服务器错误');
      }
    }
    throw error;
  }
};

// 全局处理
jnAxiosInit({
  exceptionCallBack: (msg, error) => {
    if (error?.isAxiosError) {
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请稍后重试');
      } else if (!error.response) {
        message.error('网络连接失败，请检查网络');
      } else if (error.response.status === 500) {
        message.error('服务器错误，请联系管理员');
      }
    }
  },
});
```

  </template>
</DemoContainer>

## 最佳实践

1. **统一错误处理**

   - 在全局配置中处理通用错误
   - 在请求级别处理特殊错误
   - 提供友好的错误提示

2. **错误分类**

   - 明确区分业务错误和技术错误
   - 为不同类型的错误提供不同的处理策略
   - 合理使用错误码

3. **错误恢复**
   - 提供重试机制
   - 保存用户操作状态
   - 提供回退方案

## 下一步

- 了解[基本用法](./basic-usage.md)
- 探索[配置选项](./configuration.md)
- 查看更多[示例](/examples/)
