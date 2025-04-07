# 高级配置示例

这个页面展示了 JN-Axios 的高级配置选项，包含可运行的代码示例。

## 自定义请求配置

下面是一个自定义请求配置的示例：

```tsx
import { jnAxiosGet } from 'jn-axios';

const fetchDataWithConfig = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/get/200', {
    headers: {
      'X-Custom-Header': 'custom-value',
    },
    timeout: 5000,
    withCredentials: true,
  });
  if (res) {
    console.log('请求成功:', res);
  }
};
```

<iframe src="https://codesandbox.io/embed/jn-axios-advanced-config-8q6j2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jn-axios-advanced-config"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 请求拦截器

下面是一个使用请求拦截器的示例：

```tsx
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  // ... 其他配置
  requestInterceptor: config => {
    // 添加认证信息
    config.headers['Authorization'] = 'Bearer token';
    return config;
  },
});

// 使用示例
const fetchDataWithAuth = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/auth');
  if (res) {
    console.log('认证请求成功:', res);
  }
};
```

## 响应拦截器

下面是一个使用响应拦截器的示例：

```tsx
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  // ... 其他配置
  responseInterceptor: response => {
    // 处理响应数据
    if (response.data.code === 200) {
      return response.data.data;
    }
    return response;
  },
});

// 使用示例
const fetchDataWithTransform = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/transform');
  if (res) {
    console.log('转换后的数据:', res);
  }
};
```

## 完整示例

下面是一个完整的 React 组件示例，展示了各种高级配置场景：

```tsx
import { Button, message } from 'antd';
import { jnAxiosGet, jnAxiosInit } from 'jn-axios';

// 初始化配置
jnAxiosInit({
  headers: {},
  successCode: 200,
  exceptionMsg: '服务异常，请稍后',
  expectCodeList: [10001],
  requestInterceptor: config => {
    config.headers['X-Request-ID'] = Math.random().toString(36).substr(2);
    return config;
  },
  responseInterceptor: response => {
    if (response.data.code === 200) {
      return response.data.data;
    }
    return response;
  },
  exceptionCallBack: function (msg, error) {
    console.error('请求错误:', msg);
  },
});

function App() {
  // 自定义配置请求
  const handleCustomConfig = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/200', {
      headers: {
        'X-Custom-Header': 'custom-value',
      },
      timeout: 5000,
    });
    if (res) {
      message.success('自定义配置请求成功');
    }
  };

  // 带认证的请求
  const handleAuthRequest = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/auth');
    if (res) {
      message.success('认证请求成功');
    }
  };

  // 数据转换请求
  const handleTransformRequest = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/transform');
    if (res) {
      message.success('数据转换请求成功');
    }
  };

  return (
    <div>
      <h2>高级配置示例</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button type="primary" onClick={handleCustomConfig}>
          自定义配置请求
        </Button>
        <Button type="primary" onClick={handleAuthRequest}>
          带认证的请求
        </Button>
        <Button type="primary" onClick={handleTransformRequest}>
          数据转换请求
        </Button>
      </div>
    </div>
  );
}

export default App;
```

<iframe src="https://codesandbox.io/embed/jn-axios-complete-advanced-8q6j2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jn-axios-complete-advanced"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 在线演示

您可以在以下 CodeSandbox 中查看和运行完整的示例：

- [高级配置示例](https://codesandbox.io/s/jn-axios-advanced-config-8q6j2)
- [完整高级配置示例](https://codesandbox.io/s/jn-axios-complete-advanced-8q6j2)

## 下一步

- 了解[基础请求示例](./basic.md)
- 探索[错误处理示例](./error-handling.md)
- 查看[API 参考](../api/)
