# 基础请求示例

这个页面展示了 JN-Axios 的基础用法，包含可运行的代码示例。

## 初始化配置

首先，我们需要在项目中初始化 JN-Axios：

```ts
import { jnAxiosInit } from 'jn-axios';

jnAxiosInit({
  headers: {},
  successCode: 200,
  exceptionMsg: '服务异常，请稍后',
  expectCodeList: [10001],
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

## 基础 GET 请求

下面是一个简单的 GET 请求示例：

```tsx
import { jnAxiosGet } from 'jn-axios';

const fetchData = async () => {
  const res = await jnAxiosGet<{ name: string }>('/api/get/200');
  if (res) {
    console.log('请求成功:', res);
  }
};
```

<iframe src="https://codesandbox.io/embed/jn-axios-basic-get-request-8q6j2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jn-axios-basic-get-request"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 基础 POST 请求

下面是一个简单的 POST 请求示例：

```tsx
import { jnAxiosPost } from 'jn-axios';

const postData = async () => {
  const res = await jnAxiosPost<{ id: number }>('/api/post', {
    name: '测试用户',
    email: 'test@example.com',
  });
  if (res) {
    console.log('创建成功，ID:', res.id);
  }
};
```

<iframe src="https://codesandbox.io/embed/jn-axios-basic-post-request-8q6j2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jn-axios-basic-post-request"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 完整示例

下面是一个完整的 React 组件示例，展示了各种基础请求场景：

```tsx
import { Button } from 'antd';
import { jnAxiosGet, jnAxiosPost } from 'jn-axios';

function App() {
  // 正常 GET 请求
  const fetchData = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/200');
    if (res) {
      console.log('GET 请求成功:', res);
    }
  };

  // 正常 POST 请求
  const postData = async () => {
    const res = await jnAxiosPost<{ id: number }>('/api/post', {
      name: '测试用户',
      email: 'test@example.com',
    });
    if (res) {
      console.log('POST 请求成功，ID:', res.id);
    }
  };

  return (
    <div>
      <h2>基础请求示例</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button type="primary" onClick={fetchData}>
          发送 GET 请求
        </Button>
        <Button type="primary" onClick={postData}>
          发送 POST 请求
        </Button>
      </div>
    </div>
  );
}

export default App;
```

<iframe src="https://codesandbox.io/embed/jn-axios-complete-example-8q6j2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jn-axios-complete-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 在线演示

您可以在以下 CodeSandbox 中查看和运行完整的示例：

- [基础 GET 请求示例](https://codesandbox.io/s/jn-axios-basic-get-request-8q6j2)
- [基础 POST 请求示例](https://codesandbox.io/s/jn-axios-basic-post-request-8q6j2)
- [完整示例](https://codesandbox.io/s/jn-axios-complete-example-8q6j2)

## 下一步

- 了解[错误处理示例](./error-handling.md)
- 探索[高级配置示例](./advanced.md)
- 查看[API 参考](../api/)
