# 错误处理

JN-Axios 提供了三层错误处理机制，让你能够更好地控制和处理请求过程中的各种异常情况。

## 错误处理层级

### 第一层：请求异常捕获

这一层处理网络请求过程中的异常，比如网络错误、超时等。这些错误会触发 `exceptionMsg` 和 `exceptionCallBack`。

```typescript
jnAxiosInit({
  exceptionMsg: '网络请求失败，请检查网络连接',
  exceptionCallBack: (msg, error) => {
    // 处理网络层面的错误
    console.error('网络错误:', msg);
    showToast(msg);
  },
});
```

### 第二层：业务状态码处理

这一层处理服务端返回的非成功状态码，但是这些状态码在 `expectCodeList` 中定义为特殊处理的情况。

```typescript
jnAxiosInit({
  // 定义需要特殊处理的状态码
  expectCodeList: [401, 403],
  exceptionCallBack: (msg, error) => {
    const response = error.response;
    if (response) {
      switch (response.data.code) {
        case 401:
          // 处理未授权
          redirectToLogin();
          break;
        case 403:
          // 处理权限不足
          showNoPermissionMessage();
          break;
      }
    }
  },
});
```

### 第三层：业务异常处理

这一层处理除了上述两种情况之外的业务异常，即不在 `successCode` 和 `expectCodeList` 中的状态码。

```typescript
jnAxiosInit({
  // 定义成功的状态码
  successCode: 200,
  exceptionCallBack: (msg, error) => {
    // 处理其他业务异常
    if (error.response?.data?.message) {
      showErrorMessage(error.response.data.message);
    }
  },
});
```

## 错误处理最佳实践

### 1. 全局错误处理

在应用入口处配置全局错误处理：

```typescript
import { jnAxiosInit } from 'jn-axios';
import { message } from 'antd'; // 使用你的 UI 库的提示组件

jnAxiosInit({
  successCode: 200,
  expectCodeList: [401, 403],
  exceptionMsg: '服务异常，请稍后重试',
  exceptionCallBack: (msg, error) => {
    // 网络错误
    if (!error.response) {
      message.error('网络连接异常，请检查网络');
      return;
    }

    // 特殊状态码处理
    const { code } = error.response.data;
    switch (code) {
      case 401:
        message.error('登录已过期，请重新登录');
        // 跳转到登录页
        window.location.href = '/login';
        break;
      case 403:
        message.error('没有权限访问该资源');
        break;
      default:
        message.error(msg || '请求失败');
    }
  },
});
```

### 2. 请求级别错误处理

对于特定请求，你可以通过检查返回值来处理特定的错误情况：

```typescript
const handleSubmit = async (data: FormData) => {
  const result = await jnAxiosPost<SubmitResponse>('/api/submit', data);

  if (!result) {
    // 请求失败，已经被全局错误处理器处理
    return;
  }

  if (result.expectAxiosCode === 400) {
    // 处理表单验证错误
    handleValidationErrors(result.response?.data);
    return;
  }

  // 请求成功，处理正常业务逻辑
  handleSuccess(result);
};
```

### 3. 错误恢复

在某些情况下，你可能需要在错误发生后进行恢复操作：

```typescript
const fetchData = async () => {
  try {
    const result = await jnAxiosGet<DataType>('/api/data');
    if (!result) {
      // 加载备用数据或显示友好的错误提示
      loadFallbackData();
      return;
    }
    processData(result);
  } catch (error) {
    // 处理其他未预期的错误
    console.error('Unexpected error:', error);
    showFallbackUI();
  }
};
```

## 调试错误

JN-Axios 在开发环境下会输出详细的错误信息到控制台，帮助你更好地调试问题：

```typescript
jnAxiosInit({
  exceptionCallBack: (msg, error) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('JN-Axios Error');
      console.error('Error Message:', msg);
      console.error('Error Details:', error);
      console.error('Request Config:', error.config);
      console.error('Response:', error.response);
      console.groupEnd();
    }

    // 生产环境下的错误处理
    handleProductionError(msg, error);
  },
});
```
