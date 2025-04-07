# 错误处理示例

这个页面展示了 JN-Axios 的错误处理机制，包含可运行的代码示例。

## 初始化配置

首先，我们需要配置错误处理：

```ts
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  headers: {},
  successCode: 200,
  exceptionMsg: '服务异常，请稍后',
  expectCodeList: [10001, 400],
  exceptionCallBack: function (msg, error) {
    if (!error) return;
    if ('data' in error) {
      if (error.data.code === 400) {
        console.log('成功退出登录');
        return;
      }
      if (error.data.code === 10001) {
        console.log('业务逻辑错误:', error.data.message);
        return;
      }
    }
    console.error('系统错误:', msg);
  },
});
```

## 业务逻辑错误处理

下面是一个处理业务逻辑错误的示例：

```tsx
import { jnAxiosGet } from 'jn-axios';

const fetchDataWithError = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/get/10001');
  if (res) {
    console.log('请求成功，但包含业务逻辑错误:', res);
  }
};
```

<iframe src="https://codesandbox.io/embed/jn-axios-error-handling-8q6j2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jn-axios-error-handling"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 特殊状态码处理

下面是一个处理特殊状态码（如退出登录）的示例：

```tsx
import { jnAxiosGet } from 'jn-axios';

const fetchDataWithAction = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/get/400');
  if (res) {
    console.log('请求成功，但触发了特殊状态码:', res);
  }
};
```

## 网络错误处理

下面是一个处理网络错误的示例：

```tsx
import { jnAxiosGet } from 'jn-axios';

const fetchDataWithNetworkError = async () => {
  try {
    const res = await jnAxiosGet<{ name: string }>('/api/get/network-error');
    if (res) {
      console.log('请求成功:', res);
    }
  } catch (error) {
    console.error('网络错误:', error);
  }
};
```

## 完整示例

下面是一个完整的 React 组件示例，展示了各种错误处理场景：

```tsx
import { Button, message } from 'antd';
import { jnAxiosGet } from 'jn-axios';

function App() {
  // 业务逻辑错误
  const handleBusinessError = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/10001');
    if (res) {
      message.info('业务逻辑错误已处理');
    }
  };

  // 特殊状态码（如退出登录）
  const handleSpecialCode = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/400');
    if (res) {
      message.info('特殊状态码已处理');
    }
  };

  // 网络错误
  const handleNetworkError = async () => {
    try {
      const res = await jnAxiosGet<{ name: string }>('/api/get/network-error');
      if (res) {
        message.success('请求成功');
      }
    } catch (error) {
      message.error('网络错误已处理');
    }
  };

  return (
    <div>
      <h2>错误处理示例</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button type="primary" onClick={handleBusinessError}>
          触发业务逻辑错误
        </Button>
        <Button type="primary" onClick={handleSpecialCode}>
          触发特殊状态码
        </Button>
        <Button type="primary" onClick={handleNetworkError}>
          触发网络错误
        </Button>
      </div>
    </div>
  );
}

export default App;
```

<iframe src="https://codesandbox.io/embed/jn-axios-complete-error-handling-8q6j2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jn-axios-complete-error-handling"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 在线演示

您可以在以下 CodeSandbox 中查看和运行完整的示例：

- [错误处理示例](https://codesandbox.io/s/jn-axios-error-handling-8q6j2)
- [完整错误处理示例](https://codesandbox.io/s/jn-axios-complete-error-handling-8q6j2)

## 下一步

- 了解[基础请求示例](./basic.md)
- 探索[高级配置示例](./advanced.md)
- 查看[API 参考](../api/)
